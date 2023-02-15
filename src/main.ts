import './style.css'

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { PerfectCursor } from 'perfect-cursors'
import { nanoid } from 'nanoid'
import randomcolor from 'randomcolor'

type UserMetadata<T> = { [key: string]: T }

interface Cursor<T> {
  id: string
  x: number
  y: number
  chat: string
  color: string
  userMetaData: UserMetadata<T>
}

export function defaultCursorRenderer<T>(cursor: Cursor<T>): HTMLElement {
  const htmlFragment = `<div id="cursor_${cursor.id}" class="cursor">
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
      <g fill="${cursor.color}">
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
    <p id="chat_${cursor.id}" class="chat" style="background-color: ${cursor.color}">${cursor.chat}</p>
  </div>`;
  const template = document.createElement('template');
  template.innerHTML = htmlFragment;
  const cursorEl = template.content.firstChild as HTMLElement;
  return cursorEl;
}

export interface Config<T> {
  triggerKey: string,
  cursorDivId: string,
  chatDivId: string,
  userMetaData: UserMetadata<T>,
  renderCursor: <T>(cursor: Cursor<T>) => HTMLElement,
  yDoc: Y.Doc,
}

export const DefaultConfig = {
  triggerKey: "/",
  cursorDivId: "cursor-chat-layer",
  chatDivId: "cursor-chat-box",
  userMetaData: {},
  renderCursor: defaultCursorRenderer,
  yDoc: undefined,
}

export const initCursorChat = <T>(
  room_id: string = `cursor-chat-room-${window.location.host + window.location.pathname}`,
  config: Partial<Config<T>> = {},
) => {
  const {
    triggerKey,
    cursorDivId,
    chatDivId,
    userMetaData,
    renderCursor,
    yDoc,
  } = {
    ...DefaultConfig,
    ...config
  }

  const cursorDiv = document.getElementById(cursorDivId)!
  const chatDiv = document.getElementById(chatDivId)! as HTMLInputElement

  if (!cursorDiv || !chatDiv) {
    throw `Couldn't find cursor-chat-related divs! Make sure DOM content is fully loaded before initializing`
  }

  const me: Cursor<T> = {
    id: nanoid(),
    x: 0,
    y: 0,
    chat: "",
    color: randomcolor(),
    userMetaData,
  }

  let doc: Y.Doc
  let provider: Y.AbstractConnector | undefined
  if (yDoc !== undefined) {
    doc = yDoc
  } else {
    doc = new Y.Doc()
    provider = new WebrtcProvider(
      room_id,
      doc
    )
  }

  const others: Y.Map<Cursor<T>> = doc.getMap("state")
  let sendUpdate = false

  const cleanup = () => {
    others.delete(me.id)
    provider?.destroy()
  }

  addEventListener('beforeunload', cleanup)
  setInterval(() => {
    if (sendUpdate) {
      others.set(me.id, me)
      sendUpdate = false
    }
  }, 80)


  document.onmousemove = (evt) => {
    if (me.x !== evt.pageX && me.y !== evt.pageY) {
      sendUpdate = true
      me.x = evt.pageX
      me.y = evt.pageY
      chatDiv.style.setProperty("transform", `translate(${me.x}px, ${me.y}px)`)
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === triggerKey) {
      if (chatDiv.style.getPropertyValue("display") === "block" && chatDiv.value === "") {
        event.preventDefault()
        chatDiv.style.setProperty("display", "none")
      } else {
        event.preventDefault()
        chatDiv.style.setProperty("display", "block")
        chatDiv.focus()
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      chatDiv.value = ""
      chatDiv.style.setProperty("display", "none")
    } else if (event.key === "Enter") {
      event.preventDefault()
    }
  })

  document.addEventListener('keyup', () => {
    me.chat = chatDiv.value
    sendUpdate = true
  })

  const cursor_interp = new Map<string, PerfectCursor>()
  others.observe(evt => {
    const updated_cursors = evt.changes.keys
    updated_cursors.forEach((change, cursor_id) => {
      if (cursor_id !== me.id) {
        switch (change.action) {
          case 'add':
            // make a new cursor
            const new_cursor = others.get(cursor_id)!;
            const new_cursor_div = renderCursor(new_cursor);
            new_cursor_div.classList.add("new")
            cursorDiv.appendChild(new_cursor_div);
            const add_point_closure = ([x, y]: number[]) => new_cursor_div.style.setProperty("transform", `translate(${x}px, ${y}px)`);
            const perfect_cursor = new PerfectCursor(add_point_closure);
            perfect_cursor.addPoint([new_cursor.x, new_cursor.y]);
            cursor_interp.set(cursor_id, perfect_cursor);
            break;
          case 'update':
            const updated_cursor = others.get(cursor_id)!;
            const updated_cursor_div = document.getElementById(`cursor_${cursor_id}`)!;
            const updated_chat_div = document.getElementById(`chat_${cursor_id}`)!;

            if (updated_cursor.chat === "") {
              updated_chat_div.classList.remove("show")
            } else {
              updated_chat_div.classList.add("show")
            }
            updated_chat_div.innerText = updated_cursor.chat
            updated_cursor_div.classList.remove("new")
            cursor_interp.get(cursor_id)!.addPoint([updated_cursor.x, updated_cursor.y]);
            break;
          case 'delete':
            const old_cursor_div = document.getElementById(`cursor_${cursor_id}`)!;
            old_cursor_div.classList.add("expiring")
            setTimeout(() => {
              old_cursor_div.remove();
              cursor_interp.delete(cursor_id);
            }, 1000)
            break;
        }
      }
    })
  })

  return cleanup
}
