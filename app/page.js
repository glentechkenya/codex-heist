"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

const supabase = createClient(
  "https://wakzniesxppmaktjekdq.supabase.co",
  "sb_publishable_JfNCwy684RGVfIUrnE_TkQ_JuItrBuh"
);

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [menu, setMenu] = useState(false);
  const user = useState(uuid())[0];
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    const { data } = await supabase.from("rooms").select("*").order("created_at");
    setRooms(data);
    if (!room && data?.length) setRoom(data[0]);
  }

  useEffect(() => {
    if (!room) return;

    loadMessages();
    const msgSub = supabase.channel("msgs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        if (payload.new.room_id === room.id)
          setMessages(m => [...m, payload.new]);
      }).subscribe();

    const typingSub = supabase.channel("typing")
      .on("postgres_changes", { event: "*", schema: "public", table: "typing" }, payload => {
        if (payload.new.room_id === room.id && payload.new.is_typing)
          setTypingUsers(t => [...new Set([...t, payload.new.user_id])]);
        else
          setTypingUsers(t => t.filter(u => u !== payload.new.user_id));
      }).subscribe();

    return () => {
      supabase.removeChannel(msgSub);
      supabase.removeChannel(typingSub);
    };
  }, [room]);

  async function loadMessages() {
    const { data } = await supabase.from("messages").select("*").eq("room_id", room.id).order("created_at");
    setMessages(data);
  }

  async function send() {
    if (!text) return;
    await supabase.from("messages").insert({ room_id: room.id, user_id: user, text });
    setText("");
    await supabase.from("typing").upsert({ room_id: room.id, user_id: user, is_typing: false });
  }

  async function setTyping(val) {
    await supabase.from("typing").upsert({ room_id: room.id, user_id: user, is_typing: val });
  }

  async function newRoom() {
    const name = prompt("Name your Codex");
    if (!name) return;
    await supabase.from("rooms").insert({ name });
    loadRooms();
  }

  return (
    <div style={{ height: "100vh", display: "flex", color: "#a78bfa" }}>
      {/* Menu */}
      <div style={{
        position: "fixed", top: 0, left: menu ? 0 : -260, width: 260, height: "100%",
        background: "#020014", transition: "0.3s", zIndex: 10, padding: 10
      }}>
        <h3>Codex Arena</h3>
        {rooms.map(r => (
          <div key={r.id} onClick={() => { setRoom(r); setMenu(false); }}
            style={{ padding: 8, borderBottom: "1px solid #312e81" }}>
            {r.name}
          </div>
        ))}
        <button onClick={newRoom}>+ New Codex</button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 10, borderBottom: "1px solid #312e81" }}>
          <button onClick={() => setMenu(true)}>☰</button> {room?.name}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {messages.map(m => (
            <div key={m.id} style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 20,
              background: "radial-gradient(circle, #3b0764, #020014)",
              boxShadow: "0 0 15px #7c3aed"
            }}>
              <small>{m.user_id.slice(0,6)}</small>
              <div>{m.text}</div>
            </div>
          ))}
          {typingUsers.length > 0 && <div>...</div>}
        </div>

        <div style={{ display: "flex", padding: 10 }}>
          <input value={text}
            onChange={e => { setText(e.target.value); setTyping(true); }}
            onBlur={() => setTyping(false)}
            style={{ flex: 1, background: "black", color: "#a78bfa" }}
            placeholder="Transmit…" />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
