"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/services/api";

const QUICK_QUESTIONS = [
  "Cek status pesanan",
  "Apakah jasa joki aman dari ban?",
  "Metode pembayaran apa saja yang tersedia?",
  "Berapa lama proses top-up instan?"
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Halo! Saya Asisten AI Verand Store 🤖. Ada yang bisa kami bantu seputar status pesanan, paket joki, atau top-up game?"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { from: "me", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.aiChat(text);
      setMessages((m) => [...m, { from: "bot", text: res.reply }]);
    } catch (_) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Maaf, terjadi sedikit gangguan koneksi. Anda juga dapat menghubungi tim kami langsung via WhatsApp CS 24/7." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSend();
  }

  return (
    <>
      {open && (
        <div className="chatbot-panel card">
          <div className="chatbot-head row between">
            <div className="row" style={{ gap: 10 }}>
              <div className="bot-avatar-badge">🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Asisten Verand Store</div>
                <div className="bot-status-text">
                  <span className="status-dot-green" /> Siap Melayani 24 Jam
                </div>
              </div>
            </div>
            <button className="btn-icon" onClick={() => setOpen(false)} aria-label="Tutup Chat">✕</button>
          </div>

          <div className="chat-messages" style={{ height: 320 }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === "me" ? "me" : "them"}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg them typing-indicator">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="quick-chips-row">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                type="button"
                className="chip-btn"
                onClick={() => handleSend(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Ketik pertanyaan Anda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
              Kirim
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className="fab-v2"
        onClick={() => setOpen((o) => !o)}
        title="Buka Asisten CS"
        aria-label="Buka Asisten CS"
      >
        {open ? (
          <span>✕</span>
        ) : (
          <div className="fab-content">
            <span style={{ fontSize: 22 }}>💬</span>
            <span className="fab-online-dot" />
          </div>
        )}
      </button>
    </>
  );
}
