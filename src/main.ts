import './style.css'
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"
import { nanoid } from "nanoid"
import randomcolor from "randomcolor"

interface Cursor {
  id: string
  color: string
  x: number
  y: number
  chat: string
  lastSent: string
}

const self = nanoid()
const room_id = `cursor-chat-room-${window.location.host + window.location.pathname}`
const doc: Y.Doc = new Y.Doc()
const provider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  room_id,
  doc
)

const me: Cursor = {
  id: self,
  color: randomcolor({
    hue: "#e46262",
  }),
  x: 0,
  y: 0,
  chat: "",
  lastSent: (new Date(0)).toUTCString()
}

// register handler to update the self object
document.addEventListener("DOMContentLoaded", () => {
  document.onmousemove = (evt) => {
    me.x = evt.pageX;
    me.y = evt.pageY;
  }
})

const state: Y.Map<Cursor> = doc.getMap('state')
state.clear()

// target is 80ms
setInterval(() => {
  state.set(self, me)
}, 80)

const clientSideState: Record<string, Cursor> = {}

function initializeCursor(c: Cursor) {
  if (c.id === self) {
    throw "Shouldn't render your own cursor!"
  }
  const cursorLayerDiv = document.getElementById("cursor-chat-layer")
  const htmlFragment = `<svg
    id="${c.id}"
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
  const cursor = template.content.firstChild as ChildNode
  cursorLayerDiv?.appendChild(cursor)
}

function updateCursor(c: Cursor) {

}
