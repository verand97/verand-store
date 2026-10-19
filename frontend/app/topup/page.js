"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { GAMES, rupiah } from "@/utils/format";
import { PAYMENT_METHODS } from "@/utils/catalogData";
import ProductCard from "@/components/ProductCard";

const GAME_INFO = {
  "mobile-legends": {
    name: "Mobile Legends: Bang Bang",
    banner: "/images/mlbb_banner.jpg",
    uidLabel: "User ID (UID)",
    uidPlaceholder: "cth: 123456789",
    zoneLabel: "Zone ID (4-5 digit)",
    zonePlaceholder: "cth: 2001",
    hasZone: true,
    hint: "Buka profil game Anda di pojok kiri atas. User ID dan Zone ID terletak di bawah avatar (cth: 12345678 (2001)).",
  },
  "genshin-impact": {
    name: "Genshin Impact",
    banner: "/images/genshin_banner.jpg",
    uidLabel: "User ID (UID)",
    uidPlaceholder: "cth: 801234567",
    zoneLabel: "Pilih Server",
    zonePlaceholder: "Pilih server",
    hasZone: true,
    isServerSelect: true,
    servers: ["Asia", "America", "Europe", "TW/HK/MO"],
    hint: "User ID 9 digit tertera di pojok kanan bawah layar saat bermain, atau buka menu Paimon di pojok kiri atas.",
  },
  "honkai-star-rail": {
    name: "Honkai: Star Rail",
    banner: "/images/hsr_banner.jpg",
    uidLabel: "User ID (UID)",
    uidPlaceholder: "cth: 801234567",
    zoneLabel: "Pilih Server",
    zonePlaceholder: "Pilih server",
    hasZone: true,
    isServerSelect: true,
    servers: ["Asia", "America", "Europe", "TW/HK/MO"],
    hint: "User ID 9 digit tertera di pojok kiri bawah layar permainan atau di menu profil Phone menu.",
  },
};

function TopupContent() {
  const searchParams = useSearchParams();
  const initialGame = searchParams.get("game") || "mobile-legends";

  const [game, setGame] = useState(initialGame);
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState("");
  const [server, setServer] = useState(initialGame === "mobile-legends" ? "" : "Asia");
  const [whatsapp, setWhatsapp] = useState("");
  const [validation, setValidation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [validating, setValidating] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  const { addItem } = useCart();
  const router = useRouter();

  const currentInfo = GAME_INFO[game] || GAME_INFO["mobile-legends"];

  useEffect(() => {
    api.products({ type: "topup", game })
      .then((data) => {
        setProducts(data);
        if (data.length > 0 && !selectedProduct) {
          // Pre-select popular product
          const popular = data.find((p) => p.meta?.popular) || data[0];
          setSelectedProduct(popular);
        }
      })
      .catch(() => {});
    setValidation(null);
  }, [game]);

  async function checkUid() {
    if (!uid.trim()) return;
    setValidating(true);
    setValidation(null);
    try {
      const res = await api.validateUid({ game, uid, server });
      setValidation(res);
    } catch (err) {
      setValidation({ valid: false, message: err.message });
    } finally {
      setValidating(false);
    }
  }

  function handleDirectOrder() {
    if (!selectedProduct) return alert("Pilih nominal top-up terlebih dahulu.");
    if (!uid.trim()) return alert("Masukkan User ID (UID) akun game Anda.");

    const finalNickname = validation?.valid ? validation.nickname : `Player #${uid.slice(-4)}`;

    addItem({
      product_id: selectedProduct.id,
      name: `${GAMES[game]} — ${selectedProduct.name}`,
      price: selectedProduct.price,
      quantity: 1,
      options: {
        game,
        uid,
        server,
        nickname: finalNickname,
        whatsapp: whatsapp.trim(),
        payment_method: selectedPayment.id,
      },
      type: "topup",
    });

    router.push("/checkout");
  }

  const basePrice = selectedProduct?.price || 0;
  const adminFee = selectedPayment?.fee || 0;
  const totalPrice = basePrice + adminFee;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Game Header Banner */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 32, border: "1px solid var(--border-light)" }}>
        <div style={{ position: "relative", height: 160 }}>
          <Image
            src={currentInfo.banner}
            alt={currentInfo.name}
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
              <span className="pill pill-cyan" style={{ marginBottom: 8 }}>LAYANAN RESMI TOP-UP</span>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", margin: "4px 0", color: "#fff" }}>
                {currentInfo.name}
              </h1>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                ⚡ Proses otomatis 1-3 menit langsung ke akun Anda · 100% Legal & Terpercaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Layout (2 Columns: Steps on Left, Sticky Summary on Right) */}
      <div className="grid" style={{ gridTemplateColumns: "1.8fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          {/* STEP 1: PILIH GAME & DATA AKUN */}
          <div className="card step-container">
            <div className="step-header">
              <span className="step-badge">1</span>
              <div>
                <h2 className="step-title">Masukkan Data Akun Game</h2>
                <span className="muted" style={{ fontSize: 13 }}>Pilih game dan masukkan nomor User ID akun Anda</span>
              </div>
            </div>

            {/* Game Selector Chips */}
            <div className="tabs" style={{ marginBottom: 20 }}>
              {Object.entries(GAMES).map(([slug, name]) => (
                <button
                  key={slug}
                  type="button"
                  className={`tab ${game === slug ? "active" : ""}`}
                  onClick={() => {
                    setGame(slug);
                    setValidation(null);
                    if (slug === "mobile-legends") setServer("");
                    else setServer("Asia");
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="grid grid-2">
              <div className="field">
                <label className="row between">
                  <span>{currentInfo.uidLabel} *</span>
                  <button
                    type="button"
                    onClick={() => setShowHelper(!showHelper)}
                    style={{ background: "none", border: "none", color: "var(--primary-light)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Di mana letak UID saya?
                  </button>
                </label>
                <input
                  className="input"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                    setValidation(null);
                  }}
                  placeholder={currentInfo.uidPlaceholder}
                />
              </div>

              {currentInfo.hasZone && (
                <div className="field">
                  <label>{currentInfo.zoneLabel} {currentInfo.isServerSelect ? "*" : "(opsional)"}</label>
                  {currentInfo.isServerSelect ? (
                    <select
                      value={server}
                      onChange={(e) => {
                        setServer(e.target.value);
                        setValidation(null);
                      }}
                    >
                      {currentInfo.servers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      value={server}
                      onChange={(e) => {
                        setServer(e.target.value);
                        setValidation(null);
                      }}
                      placeholder={currentInfo.zonePlaceholder}
                    />
                  )}
                </div>
              )}
            </div>

            {/* UID Helper Hint Box */}
            {showHelper && (
              <div className="card mb" style={{ background: "var(--surface-2)", fontSize: 13, border: "1px dashed var(--border-light)" }}>
                <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                  <span>💡</span>
                  <strong>Panduan Menemukan User ID:</strong>
                </div>
                <p className="muted" style={{ margin: 0 }}>{currentInfo.hint}</p>
              </div>
            )}

            <div className="row wrap" style={{ marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={checkUid}
                disabled={!uid.trim() || validating}
              >
                {validating ? "Memeriksa ID Akun…" : "🔍 Cek Nickname Akun"}
              </button>

              {validation && (
                <div
                  className="pill"
                  style={{
                    background: validation.valid ? "var(--success-soft)" : "var(--danger-soft)",
                    color: validation.valid ? "var(--success)" : "var(--danger)",
                    border: `1px solid ${validation.valid ? "var(--success)" : "var(--danger)"}44`,
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  {validation.valid ? `✓ ${validation.nickname} (${validation.message})` : `✗ ${validation.message}`}
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: PILIH NOMINAL */}
          <div className="card step-container">
            <div className="step-header">
              <span className="step-badge">2</span>
              <div>
                <h2 className="step-title">Pilih Nominal Top-up</h2>
                <span className="muted" style={{ fontSize: 13 }}>Pilih denominasi diamond atau pass yang ingin dibeli</span>
              </div>
            </div>

            <div className="grid grid-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isSelected={selectedProduct?.id === p.id}
                  onSelect={setSelectedProduct}
                  actionLabel="Pilih"
                />
              ))}
            </div>
          </div>

          {/* STEP 3: PILIH METODE PEMBAYARAN */}
          <div className="card step-container">
            <div className="step-header">
              <span className="step-badge">3</span>
              <div>
                <h2 className="step-title">Pilih Metode Pembayaran</h2>
                <span className="muted" style={{ fontSize: 13 }}>Semua transaksi terverifikasi otomatis via Midtrans Gateway</span>
              </div>
            </div>

            <div className="grid grid-2">
              {PAYMENT_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  className={`payment-method-card ${selectedPayment?.id === pm.id ? "selected" : ""}`}
                  onClick={() => setSelectedPayment(pm)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>{pm.name}</strong>
                      <span className="pay-badge-tag">{pm.badge}</span>
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>{pm.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 12, color: pm.fee === 0 ? "var(--success)" : "var(--muted)" }}>
                      {pm.fee === 0 ? "Bebas Fee" : `+${rupiah(pm.fee)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: KONTAK WHATSAPP */}
          <div className="card step-container">
            <div className="step-header">
              <span className="step-badge">4</span>
              <div>
                <h2 className="step-title">No. WhatsApp / Konfirmasi Pesanan</h2>
                <span className="muted" style={{ fontSize: 13 }}>Nomor WhatsApp untuk menerima invoice dan bukti transaksi</span>
              </div>
            </div>

            <div className="field">
              <label>Nomor WhatsApp (opsional, disarankan)</label>
              <input
                className="input"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="cth: 081234567890"
              />
              <span className="muted" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                Bukti pembayaran dan status pengiriman voucher akan dikirimkan otomatis.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <div style={{ position: "sticky", top: 90 }}>
          <div className="card" style={{ border: "1px solid var(--border-light)", boxShadow: "var(--shadow)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              Ringkasan Pesanan
            </h3>

            <div className="row between mt">
              <span className="muted">Game</span>
              <strong>{GAMES[game]}</strong>
            </div>

            <div className="row between mt">
              <span className="muted">User ID</span>
              <span>{uid || <span className="muted">-</span>}</span>
            </div>

            {validation?.valid && (
              <div className="row between mt">
                <span className="muted">Nickname</span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>{validation.nickname}</span>
              </div>
            )}

            <div className="row between mt">
              <span className="muted">Nominal Item</span>
              <strong>{selectedProduct ? selectedProduct.name : <span className="muted">Belum dipilih</span>}</strong>
            </div>

            <div className="row between mt">
              <span className="muted">Metode Bayar</span>
              <span>{selectedPayment?.name}</span>
            </div>

            <div className="row between mt">
              <span className="muted">Biaya Layanan</span>
              <span>{adminFee === 0 ? <span style={{ color: "var(--success)" }}>Gratis</span> : rupiah(adminFee)}</span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", margin: "18px 0 16px" }} />

            <div className="row between">
              <span style={{ fontSize: 15 }}>Total Pembayaran</span>
              <strong style={{ fontSize: 20, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                {rupiah(totalPrice)}
              </strong>
            </div>

            <button
              className="btn btn-primary btn-lg mt"
              style={{ width: "100%", marginTop: 20 }}
              onClick={handleDirectOrder}
              disabled={!selectedProduct || !uid.trim()}
            >
              Lanjut ke Pembayaran →
            </button>

            <div className="center mt" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
              🔒 Transaksi aman 100%. Data akun dilindungi enkripsi 256-bit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopupPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 40 }}>Memuat katalog top-up…</div>}>
      <TopupContent />
    </Suspense>
  );
}
