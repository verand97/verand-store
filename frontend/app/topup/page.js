"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { GAMES, rupiah } from "@/utils/format";

export default function TopupPage() {
  const [game, setGame] = useState("mobile-legends");
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState("");
  const [server, setServer] = useState("");
  const [validation, setValidation] = useState(null);
  const [selected, setSelected] = useState(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    api.products({ type: "topup", game }).then(setProducts).catch(() => {});
    setValidation(null);
    setSelected(null);
  }, [game]);

  async function checkUid() {
    setValidation({ loading: true });
    try {
      const res = await api.validateUid({ game, uid, server });
      setValidation(res);
    } catch (err) {
      setValidation({ valid: false, message: err.message });
    }
  }

  function buy() {
    if (!selected) return alert("Pilih nominal dulu.");
    if (!validation?.valid) return alert("Validasi UID dulu.");
    addItem({
      product_id: selected.id,
      name: `${GAMES[game]} — ${selected.name}`,
      price: selected.price,
      quantity: 1,
      options: { game, uid, server, nickname: validation.nickname },
      type: "topup",
    });
    router.push("/checkout");
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1>Top-up Game</h1>
      <p className="muted">Pilih game, masukkan UID, pilih nominal, lalu bayar.</p>

      <div className="tabs">
        {Object.entries(GAMES).map(([slug, name]) => (
          <div key={slug} className={`tab ${game === slug ? "active" : ""}`} onClick={() => setGame(slug)}>
            {name}
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>1. Data Akun</h3>
          <div className="field">
            <label>User ID (UID)</label>
            <input className="input" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="cth: 123456789" />
          </div>
          <div className="field">
            <label>Server / Zone (opsional)</label>
            <input className="input" value={server} onChange={(e) => setServer(e.target.value)} placeholder="cth: 2001" />
          </div>
          <button className="btn" onClick={checkUid} disabled={!uid}>Validasi UID</button>
          {validation && !validation.loading && (
            <p className={validation.valid ? "success-text" : "error-text"} style={{ marginBottom: 0 }}>
              {validation.valid ? `✓ ${validation.nickname} — ${validation.message}` : `✗ ${validation.message}`}
            </p>
          )}
        </div>

        <div>
          <div className="card mb">
            <h3 style={{ marginTop: 0 }}>2. Pilih Nominal</h3>
            <div className="grid grid-3">
              {products.map((p) => (
                <div key={p.id}
                  className="card"
                  onClick={() => setSelected(p)}
                  style={{
                    cursor: "pointer",
                    borderColor: selected?.id === p.id ? "var(--primary)" : "var(--border)",
                    background: selected?.id === p.id ? "var(--card-2)" : "var(--card)",
                  }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div className="price">{rupiah(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={buy} disabled={!selected || !validation?.valid}>
            Lanjut ke Pembayaran {selected && `· ${rupiah(selected.price)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
