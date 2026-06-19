"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import Reveal from "@/components/Reveal";
import { GAMES, JOKI_FORM_SCHEMA, rupiah } from "@/utils/format";

export default function JokiGamePage({ params }) {
  const { game } = use(params);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [details, setDetails] = useState({});
  const [quote, setQuote] = useState(null);
  const { addItem } = useCart();
  const router = useRouter();

  const schema = JOKI_FORM_SCHEMA[game] || JOKI_FORM_SCHEMA["mobile-legends"];

  useEffect(() => {
    api.products({ type: "joki", game }).then(setProducts).catch(() => {});
  }, [game]);

  const combos = useMemo(() => products.filter((p) => p.meta?.is_combo), [products]);
  const singles = useMemo(() => products.filter((p) => !p.meta?.is_combo), [products]);

  async function selectService(p) {
    setSelected(p);
    setDetails({});
    setQty(1);
    setQuote(null);
    try {
      const q = await api.priceQuote({
        product_id: p.id,
        context: { difficulty: p.meta?.difficulty || 1 },
      });
      setQuote(q);
    } catch (_) {}
    // scroll to form on mobile
    if (typeof window !== "undefined" && window.innerWidth < 920) {
      document.getElementById("joki-form")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function order() {
    if (!selected) return;
    const isCombo = selected.meta?.is_combo;
    addItem({
      product_id: selected.id,
      name: `${GAMES[game]} — ${selected.name}`,
      price: quote?.final_price || selected.price,
      quantity: isCombo ? 1 : qty,
      options: { game, service: selected.category, details, is_combo: !!isCombo },
      type: "joki",
    });
    router.push("/checkout");
  }

  const unitPrice = quote?.final_price || selected?.price || 0;
  const isCombo = selected?.meta?.is_combo;
  const total = unitPrice * (isCombo ? 1 : qty);

  return (
    <div className="container" style={{ paddingTop: 44 }}>
      <Reveal>
        <p className="muted" style={{ margin: 0 }}>Jasa Joki</p>
        <h1 style={{ marginTop: 4 }}>{GAMES[game] || game}</h1>
      </Reveal>

      <div className="grid" style={{ gridTemplateColumns: "1.7fr 1fr", gap: 26 }}>
        <div>
          {/* Combo packages — Genshin & HSR */}
          {combos.length > 0 && (
            <>
              <div className="section-head" style={{ margin: "8px 0 16px" }}>
                <h2 style={{ fontSize: 22 }}>📦 Paket <span className="accent">Combo</span></h2>
                <span className="muted" style={{ fontSize: 13 }}>Lebih hemat, sekali bayar</span>
              </div>
              <div className="grid grid-2 mb">
                {combos.map((p) => (
                  <Reveal key={p.id}>
                    <div className="card combo-card"
                      onClick={() => selectService(p)}
                      style={{ cursor: "pointer", borderColor: selected?.id === p.id ? "var(--lime)" : "var(--border)", height: "100%" }}>
                      <span className="pill" style={{ background: "var(--lime-soft)", color: "var(--lime)", marginBottom: 8 }}>COMBO · {p.meta?.duration}</span>
                      <div style={{ fontWeight: 800, fontSize: 17, fontFamily: "var(--font-display-stack)" }}>{p.name}</div>
                      <p className="muted" style={{ fontSize: 13, margin: "6px 0 10px" }}>{p.description}</p>
                      <ul className="combo-list">
                        {p.meta?.includes?.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                      <div className="price" style={{ marginTop: 10 }}>{rupiah(p.price)}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {/* Single services */}
          <div className="section-head" style={{ margin: "8px 0 16px" }}>
            <h2 style={{ fontSize: 22 }}>Layanan <span className="accent">Satuan</span></h2>
          </div>
          <div className="grid grid-2">
            {singles.map((p) => (
              <div key={p.id} className="card"
                onClick={() => selectService(p)}
                style={{ cursor: "pointer", borderColor: selected?.id === p.id ? "var(--purple)" : "var(--border)" }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div className="meta muted">{p.unit} · kesulitan {p.meta?.difficulty || 1}/5</div>
                <div className="price">{rupiah(p.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order detail — schema-driven per game */}
        <div id="joki-form" className="card" style={{ height: "fit-content", position: "sticky", top: 86 }}>
          <h3 style={{ marginTop: 0 }}>Detail Pesanan</h3>
          {!selected && <p className="muted">Pilih layanan atau paket combo dulu.</p>}
          {selected && (
            <>
              <div className="field">
                <label>Layanan</label>
                <div style={{ fontWeight: 700 }}>{selected.name}</div>
                {isCombo && <span className="pill" style={{ background: "var(--lime-soft)", color: "var(--lime)", marginTop: 6 }}>Paket Combo</span>}
              </div>

              {!isCombo && (
                <div className="field">
                  <label>Jumlah ({selected.unit})</label>
                  <input className="input" type="number" min={1} value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
                </div>
              )}

              {/* Game-specific fields */}
              {schema.fields.map((f) => (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={2} value={details[f.key] || ""} placeholder={f.placeholder}
                      onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <select value={details[f.key] || ""}
                      onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}>
                      <option value="">{f.placeholder}</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input className="input" value={details[f.key] || ""} placeholder={f.placeholder}
                      onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })} />
                  )}
                </div>
              ))}

              {quote && (
                <div className="card mb" style={{ background: "var(--bg)", fontSize: 13 }}>
                  <div className="row between"><span className="muted">Harga dasar</span><span>{rupiah(quote.base_price)}</span></div>
                  <div className="row between"><span className="muted">Pengali dinamis</span><span>x{quote.multiplier}</span></div>
                  {quote.reasons?.map((r, i) => <div key={i} className="muted" style={{ fontSize: 12 }}>· {r}</div>)}
                  <div className="row between mt"><strong>Harga{isCombo ? "" : "/unit"}</strong><strong style={{ color: "var(--purple-2)" }}>{rupiah(quote.final_price)}</strong></div>
                </div>
              )}

              <div className="row between mb">
                <span className="muted">Total {isCombo ? "" : `(${qty}x)`}</span>
                <strong style={{ fontSize: 18 }}>{rupiah(total)}</strong>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={order}>Pesan Sekarang</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
