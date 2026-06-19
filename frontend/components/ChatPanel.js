"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function ChatPanel({ orderId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  async function load() {
    try {
      setMessages(await api.chats(orderId));
    } catch (_) {}
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // simple polling
    return () => clearInterval(t);
  }, [orderId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      const msg = await api.sendChat(orderId, text);
      setMessages((m) => [...m, msg]);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.length === 0 && <p className="muted center">Belum ada pesan. Mulai percakapan dengan booster.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.sender_id === user?.id ? "me" : "them"}`}>
            <span className="who">{m.sender?.name} {m.sender?.role === "booster" ? "· Booster" : ""}</span>
            {m.message}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-input-row" onSubmit={send}>
        <input className="input" placeholder="Tulis pesan ke booster…" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn btn-primary" type="submit">Kirim</button>
      </form>
    </div>
  );
}
