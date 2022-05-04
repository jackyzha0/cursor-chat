import './style.css'
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"
import { nanoid } from "nanoid"
import randomcolor from "randomcolor"
import { PerfectCursor } from "perfect-cursors"

interface Cursor {
  id: string
  color: string
  x: number
  y: number
  chat: string
  nStale: number
  pc: PerfectCursor | undefined
}

type ReplicatedCursor = Pick<Cursor, "id" | "color" | "x" | "y" | "chat">

class CursorChat {
  self_id: string
  room_id: string
  doc: Y.Doc
  provider: WebsocketProvider
  me: Cursor
  others: Map<string, Cursor>
  replicated_cursors: Y.Map<ReplicatedCursor>
  cursorLayerDiv: HTMLElement
  intervalId: number
  toUpdate: boolean

  constructor(wsProvider = "wss://demos.yjs.dev") {
    const ld = document.getElementById("cursor-chat-layer")
    const chat = document.getElementById("cursor-chat-box") as HTMLInputElement
    if (!(ld && chat)) {
      throw `Couldn't find cursor-chat-related divs! Make sure DOM content is fully loaded before initializing`
    }
    this.cursorLayerDiv = ld

    this.self_id = nanoid()
    this.room_id = `cursor-chat-room-${window.location.host + window.location.pathname}`
    this.doc = new Y.Doc()
    this.provider = new WebsocketProvider(
      wsProvider,
      this.room_id,
      this.doc
    )
    this.toUpdate = true

    // initialize self
    this.me = {
      id: this.self_id,
      color: randomcolor({
        luminosity: 'light',
      }),
      x: 0,
      y: 0,
      chat: "",
      nStale: 0,
      pc: undefined,
    }

    this.replicated_cursors = this.doc.getMap('state')
    this.replicated_cursors.clear()
    this.others = new Map()

    // attach mouse listener to update self object
    document.onmousemove = (evt) => {
      if (this.me.x !== evt.pageX && this.me.y !== evt.pageY) {
        this.toUpdate = true
        this.me.x = evt.pageX
        this.me.y = evt.pageY
      }
      chat.style.setProperty("transform", `translate(${evt.pageX}px, ${evt.pageY}px)`)
    }

    // setup replication
    this.intervalId = setInterval(() => {
      if (this.toUpdate) {
        this.replicated_cursors.set(this.self_id, this.me)
        this.toUpdate = false
      }

      this.others.forEach((concrete) => {
        if (concrete.nStale >= 40) {
          const el = getCursorElement(concrete)
          el?.classList.add("expiring")
          if (concrete.nStale >= 60) {
            el?.remove()
            concrete.pc?.dispose()
            this.others.delete(concrete.id)
            this.replicated_cursors.delete(concrete.id)
          }
        }
        concrete.nStale++
      })
    }, 80)

    // setup key handlers
    document.addEventListener('keydown', (event) => {
      if (event.key === "/" && chat.value === "") {
        event.preventDefault()
        if (chat.style.getPropertyValue("display") === "block") {
          // empty, most likely toggle intent
          chat.style.setProperty("display", "none")
        } else {
          chat.style.setProperty("display", "block")
          chat.focus()
        }
      } if (event.key === "Escape") {
        event.preventDefault()
        chat.value = ""
        chat.style.setProperty("display", "none")
      } if (event.key === "Enter") {
        event.preventDefault()
      }
    })

    document.addEventListener('keyup', () => {
      this.me.chat = chat.value
      this.toUpdate = true
    })

    // poll
    this.replicated_cursors.observe(evt => {
      const cursorsChanged = Array.from(evt.keysChanged)
        .map(cursorId => this.replicated_cursors.get(cursorId))
        .filter(cursorId => cursorId !== undefined) as ReplicatedCursor[]

      cursorsChanged.forEach((cursor: ReplicatedCursor) => {
        if (cursor.id !== this.self_id) {
          if (this.others.has(cursor.id)) {
            // in cache, update
            const concrete = this.others.get(cursor.id) as Cursor
            const el = getCursorElement(concrete)
            const chatEl = getChatElement(concrete)

            if (concrete.chat !== cursor.chat && chatEl) {
              if (cursor.chat === "") {
                chatEl.classList.remove("show")
              } else {
                chatEl.classList.add("show")
              }
              chatEl.innerText = cursor.chat
            }

            // increment stale-ness
            concrete.nStale = 0
            el?.classList.remove("stale")
            el?.classList.remove("expiring")

            concrete.pc?.addPoint([cursor.x, cursor.y])
            const updatedConcrete = {
              ...concrete,
              ...cursor,
              pc: concrete.pc,
            }
            el?.classList.remove("new")
            this.others.set(cursor.id, updatedConcrete)
          } else {
            // new cursor, register and add to dom
            const concrete = initializeCursor(cursor, this.cursorLayerDiv)
            this.others.set(cursor.id, concrete)
          }
        }
      })
    })
  }
}

function initializeCursor(c: ReplicatedCursor, div: HTMLElement): Cursor {
  const htmlFragment = `<div id="cursor_${c.id}" class="cursor">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="white">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="${c.color}">
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
    <p id="chat_${c.id}" class="chat" style="background-color: ${c.color}"></p>
  </div>`

  const template = document.createElement('template')
  template.innerHTML = htmlFragment
  const cursorEl = template.content.firstChild as HTMLElement
  cursorEl.classList.add("new")
  div.appendChild(cursorEl)

  const chatEl = getChatElement(c) as HTMLElement
  chatEl.innerText = c.chat

  function addPoint(point: number[]) {
    const [x, y] = point
    cursorEl.style.setProperty("transform", `translate(${x}px, ${y}px)`)
  }

  return {
    ...c,
    pc: new PerfectCursor(addPoint),
    nStale: 0,
  }
}

function getCursorElement(c: Cursor | ReplicatedCursor) {
  return document.getElementById(`cursor_${c.id}`)
}

function getChatElement(c: Cursor | ReplicatedCursor) {
  return document.getElementById(`chat_${c.id}`)
}

new CursorChat()
