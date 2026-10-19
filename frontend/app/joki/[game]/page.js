"use client";

import { use, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import Reveal from "@/components/Reveal";
import { GAMES, JOKI_FORM_SCHEMA, rupiah } from "@/utils/format";

const GAME_BANNERS = {
  "mobile-legends": "/images/mlbb_banner.jpg",
  "genshin-impact": "/images/genshin_banner.jpg",
  "honkai-star-rail": "/images/hsr_banner.jpg",
};

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
  const bannerImage = GAME_BANNERS[game] || GAME_BANNERS["mobile-legends"];

  const selectService = useCallback(async (p) => {
    if (!p) return;
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
  }, []);

  useEffect(() => {
    let ignore = false;
    api.products({ type: "joki", game })
      .then((data) => {
        if (ignore) return;
        setProducts(data);
        if (data.length > 0) {
          const first = data.find((p) => p.meta?.is_combo) || data[0];
          selectService(first);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [game, selectService]);

  const combos = useMemo(() => products.filter((p) => p.meta?.is_combo), [products]);
  const singles = useMemo(() => products.filter((p) => !p.meta?.is_combo), [products]);

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
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 32, border: "1px solid var(--border-light)" }}>
        <div style={{ position: "relative", height: 160 }}>
          <Image
            src={bannerImage}
            alt={GAMES[game] || game}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(9, 12, 19, 0.95) 0%, rgba(9, 12, 19, 0.7) 60%, rgba(9, 12, 19, 0.4) 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
          }}>
            <div>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <Link href="/joki" style={{ color: "var(--primary-light)", fontSize: 13, textDecoration: "underline" }}>
                  ← Kembali ke Pilihan Game
                </Link>
                <span className="pill pill-cyan" style={{ fontSize: 10 }}>LAYANAN JOKI PRO</span>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", margin: "4px 0", color: "#fff" }}>
                {GAMES[game] || game}
              </h1>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                🛡️ Pro Booster Terverifikasi · 100% Manual Handplay · Garansi Bintang & Hasil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.8fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          {/* Combo Packages (Genshin & HSR) */}
          {combos.length > 0 && (
            <div className="mb" style={{ marginBottom: 36 }}>
              <div className="section-head" style={{ margin: "0 0 16px" }}>
                <div>
                  <h2 style={{ fontSize: 20 }}>📦 Paket <span className="accent">Combo Hemat</span></h2>
                  <span className="muted" style={{ fontSize: 13 }}>Bundling lengkap perawatan akun dengan diskon s/d 30%</span>
                </div>
              </div>

              <div className="grid grid-2">
                {combos.map((p) => (
                  <Reveal key={p.id}>
                    <div
                      className={`card combo-card ${selected?.id === p.id ? "selected" : ""}`}
                      onClick={() => selectService(p)}
                      role="button"
                      tabIndex={0}
                      style={{
                        cursor: "pointer",
                        height: "100%",
                        border: selected?.id === p.id ? "2px solid var(--primary-light)" : "1px solid var(--border)",
                        background: selected?.id === p.id ? "var(--surface-3)" : "var(--card)"
                      }}
                    >
                      <div className="row between" style={{ marginBottom: 8 }}>
                        <span className="pill pill-cyan" style={{ fontSize: 10 }}>
                          COMBO · {p.meta?.duration}
                        </span>
                        {selected?.id === p.id && (
                          <span className="pill pill-green" style={{ fontSize: 10 }}>DIPILIH ✓</span>
                        )}
                      </div>

                      <div style={{ fontWeight: 800, fontSize: 17, fontFamily: "var(--font-display-stack)" }}>
                        {p.name}
                      </div>

                      <p className="muted" style={{ fontSize: 13, margin: "6px 0 12px" }}>
                        {p.description}
                      </p>

                      <ul className="combo-list">
                        {p.meta?.includes?.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>

                      <div className="row between" style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                        <div>
                          <span className="muted" style={{ fontSize: 11, display: "block" }}>Harga Paket</span>
                          <div className="price-value" style={{ fontSize: 18 }}>{rupiah(p.price)}</div>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-sm ${selected?.id === p.id ? "btn-primary" : "btn-secondary"}`}
                        >
                          {selected?.id === p.id ? "Aktif" : "Pilih Paket"}
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Single Services */}
          <div>
            <div className="section-head" style={{ margin: "0 0 16px" }}>
              <div>
                <h2 style={{ fontSize: 20 }}>Layanan Joki <span className="accent">Satuan</span></h2>
                <span className="muted" style={{ fontSize: 13 }}>Pilih layanan per bintang, match, chapter, atau region</span>
              </div>
            </div>

            <div className="grid grid-2">
              {singles.map((p) => {
                const isCurrent = selected?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className="card product-card-v2"
                    onClick={() => selectService(p)}
                    role="button"
                    tabIndex={0}
                    style={{
                      border: isCurrent ? "2px solid var(--primary-light)" : "1px solid var(--border)",
                      background: isCurrent ? "var(--surface-3)" : "var(--card)"
                    }}
                  >
                    <div className="row between">
                      <span className="game-micro-tag">{p.unit}</span>
                      <span className="muted" style={{ fontSize: 11 }}>
                        Tingkat Kesulitan: {"★".repeat(p.meta?.difficulty || 1)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 16, margin: "6px 0" }}>
                      {p.name}
                    </div>

                    <div className="product-card-footer row between">
                      <div>
                        <span className="price-label muted">Tarif Satuan</span>
                        <div className="price-value">{rupiah(p.price)}</div>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-sm ${isCurrent ? "btn-primary" : "btn-secondary"}`}
                      >
                        {isCurrent ? "Dipilih ✓" : "Pilih"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ORDER DETAILS FORM (RIGHT STICKY SIDEBAR) */}
        <div style={{ position: "sticky", top: 90 }}>
          <div className="card" style={{ border: "1px solid var(--border-light)", boxShadow: "var(--shadow)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              Detail Pesanan Joki
            </h3>

            {!selected ? (
              <p className="muted" style={{ fontSize: 13 }}>Silakan pilih salah satu layanan atau paket combo di samping.</p>
            ) : (
              <>
                <div className="field">
                  <label>Layanan Terpilih</label>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                  {isCombo ? (
                    <span className="pill pill-cyan" style={{ marginTop: 6, fontSize: 11 }}>
                      Paket Combo · {selected.meta?.duration}
                    </span>
                  ) : (
                    <span className="muted" style={{ fontSize: 12 }}>Satuan ({selected.unit})</span>
                  )}
                </div>

                {!isCombo && (
                  <div className="field">
                    <label>Jumlah ({selected.unit})</label>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                )}

                {/* Game specific inputs from schema */}
                {schema.fields.map((f) => (
                  <div className="field" key={f.key}>
                    <label>{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        rows={2}
                        value={details[f.key] || ""}
                        placeholder={f.placeholder}
                        onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}
                      />
                    ) : f.type === "select" ? (
                      <select
                        value={details[f.key] || ""}
                        onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}
                      >
                        <option value="">{f.placeholder}</option>
                        {f.options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="input"
                        value={details[f.key] || ""}
                        placeholder={f.placeholder}
                        onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                {/* Price Breakdown */}
                {quote && (
                  <div className="card mb" style={{ background: "var(--bg)", fontSize: 13, border: "1px solid var(--border)" }}>
                    <div className="row between">
                      <span className="muted">Harga Dasar</span>
                      <span>{rupiah(quote.base_price)}</span>
                    </div>
                    {quote.multiplier !== 1 && (
                      <div className="row between mt">
                        <span className="muted">Pengali Kesulitan</span>
                        <span style={{ color: "var(--amber-light)" }}>x{quote.multiplier}</span>
                      </div>
                    )}
                    {quote.reasons?.map((r, i) => (
                      <div key={i} className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                        · {r}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0 14px" }} />

                <div className="row between">
                  <span style={{ fontSize: 14 }}>Total Biaya {isCombo ? "" : `(${qty}x)`}</span>
                  <strong style={{ fontSize: 20, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                    {rupiah(total)}
                  </strong>
                </div>

                <button
                  className="btn btn-primary btn-lg mt"
                  style={{ width: "100%", marginTop: 16 }}
                  onClick={order}
                >
                  Pesan Joki Sekarang →
                </button>

                <p className="muted center" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.4 }}>
                  🛡️ Akun dijamin aman 100%. Booster akan meminta konfirmasi akun via dashboard chat terenkripsi.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
