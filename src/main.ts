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
  lastSent: string
  el: HTMLElement | undefined
  pc: PerfectCursor | undefined
}

type ReplicatedCursor = Pick<Cursor, "id" | "color" | "x" | "y" | "chat" | "lastSent">;

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

  constructor(divId = "cursor-chat-layer", wsProvider = "wss://demos.yjs.dev") {
    const ld = document.getElementById(divId)
    if (!ld) {
      throw `Couldn't find div with id ${divId} Make sure DOM content is fully loaded before initializing`
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

    // initialize self
    this.me = {
      id: this.self_id,
      color: randomcolor({
        hue: "#e46262",
      }),
      x: 0,
      y: 0,
      chat: "",
      lastSent: (new Date(0)).toUTCString(),
      el: undefined,
      pc: undefined,
    }

    this.replicated_cursors = this.doc.getMap('state')
    this.replicated_cursors.clear()
    this.others = new Map()

    // attach mouse listener to update self object
    document.onmousemove = (evt) => {
      this.me.x = evt.pageX;
      this.me.y = evt.pageY;
    }

    // setup replication
    this.intervalId = setInterval(() => {
      console.log(this.replicated_cursors)
      // push self
      this.replicated_cursors.set(this.self_id, this.me)

      // update local cache
      this.replicated_cursors.forEach((cursor: ReplicatedCursor) => {
        if (cursor.id !== this.self_id) {
          if (this.others.has(cursor.id)) {
            // in cache, update
            const concrete = this.others.get(cursor.id) as Cursor
            concrete.pc?.addPoint([cursor.x, cursor.y])
            const updatedConcrete = {
              ...concrete,
              ...cursor,
            }
            this.others.set(cursor.id, updatedConcrete)
          } else {
            // new cursor, register and add to dom
            const concrete = initializeCursor(cursor)
            if (concrete.el) {
              concrete.el.classList.add("new")
              this.cursorLayerDiv.appendChild(concrete.el)
            }
            this.others.set(cursor.id, concrete)
          }
        }
      })

      // delete old records
      this.others.forEach((cursor: Cursor) => {
        if (!this.replicated_cursors.has(cursor.id)) {
          deleteCursor(cursor)
        }
      })
    }, 80)
  }

  destroy() {
    // TODO: properly clean up resources
    this.replicated_cursors.delete(this.self_id)
    clearInterval(this.intervalId)
  }
}

function initializeCursor(c: ReplicatedCursor): Cursor {
  const htmlFragment = `<svg
    id="cursor_${c.id}"
    class="cursor"
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
  </svg>`

  const template = document.createElement('template')
  template.innerHTML = htmlFragment
  const cursorEl = template.content.firstChild as HTMLElement
  const concreteCursor: Cursor = {
    ...c,
    el: cursorEl,
    pc: new PerfectCursor((point: number[]) => {
      [c.x, c.y] = point
      cursorEl.style.setProperty("transform", `translate(${c.x}px, ${c.y}px)`)
    })
  }
  return concreteCursor
}

function deleteCursor(c: Cursor) {
  const cursorEl = document.getElementById(`cursor_${c.id}`)
  if (c.pc) {
    c.pc.dispose()
  }
  if (cursorEl) {
    cursorEl.remove()
  } else {
    throw `Warning: couldn't find cursor with id ${c.id}!`
  }
}

const _ = new CursorChat()
