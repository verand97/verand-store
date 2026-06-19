"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/services/api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Halo! Saya asisten Verand Store. Tanya soal status pesanan, pembayaran, atau layanan joki & top-up." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { from: "me", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.aiChat(text);
      setMessages((m) => [...m, { from: "bot", text: res.reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "Maaf, terjadi kendala. Coba lagi." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-head row between">
            <span>🤖 Asisten Verand</span>
            <span style={{ cursor: "pointer" }} onClick={() => setOpen(false)}>✕</span>
          </div>
          <div className="chat-messages" style={{ height: 320 }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === "me" ? "me" : "them"}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-msg them">Mengetik…</div>}
            <div ref={endRef} />
          </div>
          <form className="chat-input-row" style={{ padding: 10 }} onSubmit={send}>
            <input
              className="input"
              placeholder="Tulis pesan…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>➤</button>
          </form>
        </div>
      )}
      <button className="fab" onClick={() => setOpen((o) => !o)}>{open ? "✕" : "💬"}</button>
    </>
  );
}
