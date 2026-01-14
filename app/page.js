"use client";

import { useState, useEffect } from "react";
import { connect, send } from "../lib/realtime";
import { deriveKey, encrypt, decrypt } from "../lib/crypto";
import "./globals.css";

export default function Home() {
  const [room, setRoom] = useState("public");
  const [secret, setSecret] = useState("");
  const [key, setKey] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);

  async function join() {
    const k = await deriveKey(secret || "public");
    setKey(k);
    setNodes([]);
    connect(room, async payload => {
      const msg = await decrypt(payload, k);
      setNodes(n => [...n, msg]);
    }, setOnline);
  }

  async function sendMsg() {
    if (!text || !key) return;
    const payload = await encrypt(text, key);
    send(room, payload);
    setText("");
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <div style={{ padding: 12, borderBottom: "1px solid #312e81" }}>
        <b>Codex Heist</b> — {online ? "🟢 Online" : "🔴 Offline"}
      </div>

      <div style={{ padding: 10, display: "flex", gap: 6 }}>
        <input placeholder="room" value={room} onChange={e=>setRoom(e.target.value)} />
        <input placeholder="secret (for private)" value={secret} onChange={e=>setSecret(e.target.value)} />
        <button onClick={join}>Join</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {nodes.map((n,i) => <div key={i} className="node">{n}</div>)}
        {typing && <div>...</div>}
      </div>

      <div style={{ padding: 10, display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={()=>setTyping(true)}
          onBlur={()=>setTyping(false)}
          placeholder="Transmit…"
          style={{ flex: 1 }}
        />
        <button onClick={sendMsg}>Send</button>
      </div>

    </div>
  );
}
