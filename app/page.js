"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";

const supabase = createClient(
  "https://wakzniesxppmaktjekdq.supabase.co",
  "sb_publishable_b3zYqzIjdc41CD0AWNTcXg_zPcOghqF"
);

export default function Home() {
  const [room, setRoom] = useState("Codex Arena");
  const [rooms, setRooms] = useState(["Codex Arena"]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = useState(uuid())[0];

  useEffect(() => {
    const channel = supabase.channel(room)
      .on("broadcast", { event: "msg" }, payload => {
        setMessages(m => [...m, payload.payload]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  function send() {
    if (!text) return;
    supabase.channel(room).send({
      type: "broadcast",
      event: "msg",
      payload: { user, text }
    });
    setText("");
  }

  function createRoom() {
    const name = prompt("Name your Codex");
    if (!name) return;
    setRooms([...rooms, name]);
    setRoom(name);
    setMessages([]);
  }

  return (
    <div style={{ background: "black", color: "#3b82f6", height: "100vh", display: "flex" }}>
      <div style={{ width: 220, borderRight: "1px solid #1e3a8a", padding: 12 }}>
        <h2>Codex Arena</h2>
        {rooms.map(r => (
          <div key={r} onClick={() => { setRoom(r); setMessages([]); }}
            style={{ padding: 8, cursor: "pointer", background: room === r ? "#1e3a8a" : "" }}>
            {r}
          </div>
        ))}
        <button onClick={createRoom} style={{ marginTop: 10, width: "100%" }}>
          + New Codex
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ borderBottom: "1px solid #1e3a8a", padding: 10 }}>{room}</div>

        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ background: "#1e3a8a55", marginBottom: 10, padding: 10 }}>
              <small>{m.user.slice(0,6)}</small>
              <div>{m.text}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", padding: 10 }}>
          <input value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            style={{ flex: 1, background: "black", color: "#3b82f6" }} />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
