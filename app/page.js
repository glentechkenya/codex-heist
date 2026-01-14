"use client";

import { useState } from "react";

export default function Home() {
  const [nodes, setNodes] = useState([
    { id: 1, text: "Welcome to Codex Heist" },
    { id: 2, text: "This is a shared neon arena" },
    { id: 3, text: "Your ideas will appear as glowing nodes" }
  ]);
  const [text, setText] = useState("");
  const [menu, setMenu] = useState(false);

  function send() {
    if (!text) return;
    setNodes([...nodes, { id: Date.now(), text }]);
    setText("");
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top bar */}
      <div style={{
        padding: "12px",
        borderBottom: "1px solid #312e81",
        display: "flex",
        alignItems: "center",
        gap: 10
      }}>
        <button onClick={() => setMenu(true)} style={{
          background: "none",
          color: "#a78bfa",
          fontSize: 22,
          border: "none"
        }}>☰</button>
        <div style={{ fontSize: 18 }}>Codex Arena</div>
      </div>

      {/* Slide menu */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "#000c",
        transform: menu ? "translateX(0)" : "translateX(-100%)",
        transition: "0.3s",
        zIndex: 10
      }} onClick={() => setMenu(false)}>
        <div style={{
          width: 260,
          height: "100%",
          background: "#020014",
          padding: 20
        }}>
          <h3>Codexes</h3>
          <div>Codex Arena</div>
        </div>
      </div>

      {/* Arena */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>
        {nodes.map(n => (
          <div key={n.id} style={{
            alignSelf: "flex-start",
            padding: "14px 18px",
            borderRadius: 30,
            background: "radial-gradient(circle, #3b0764, #020014)",
            boxShadow: "0 0 20px #7c3aed",
            maxWidth: "85%",
            animation: "float 4s ease-in-out infinite"
          }}>
            {n.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: 12,
        borderTop: "1px solid #312e81",
        display: "flex",
        gap: 10
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Transmit to the arena..."
          style={{
            flex: 1,
            background: "#020014",
            color: "#a78bfa",
            border: "1px solid #312e81",
            borderRadius: 20,
            padding: "10px 14px"
          }}
        />
        <button onClick={send} style={{
          background: "#4f46e5",
          border: "none",
          borderRadius: 20,
          padding: "10px 16px",
          color: "white"
        }}>
          Send
        </button>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

    </div>
  );
}
