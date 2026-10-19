"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { rupiah } from "@/utils/format";

export default function CheckoutPage() {
  const { items, removeItem, clear, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const type = items.some((i) => i.type === "joki") ? "joki" : "topup";

  async function checkout() {
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const jokiItem = items.find((i) => i.type === "joki");
      const order = await api.createOrder({
        type,
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
          options: i.options,
        })),
        meta: { game: items[0]?.options?.game },
        joki: jokiItem
          ? {
              game: jokiItem.options?.game,
              service: jokiItem.options?.service,
              targets: jokiItem.options?.details || {},
            }
          : null,
      });

      // Initialise payment
      const pay = await api.pay(order.id);
      clear();

      // Stub gateway: go to our mock pay page. Real gateway: redirect to Snap.
      if (pay.is_stub) {
        router.push(`/checkout/mock-pay?order=${order.id}`);
      } else {
        window.location.href = pay.redirect_url;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="card center" style={{ maxWidth: 500, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h2 style={{ margin: "0 0 8px" }}>Keranjang Belanja Masih Kosong</h2>
          <p className="muted" style={{ margin: "0 0 24px", fontSize: 14 }}>
            Anda belum memilih nominal diamond atau paket joki game. Yuk pilih layanan yang Anda inginkan.
          </p>
          <div className="row" style={{ justifyContent: "center", gap: 12 }}>
            <Link href="/topup" className="btn btn-primary">⚡ Top-up Kilat</Link>
            <Link href="/joki" className="btn btn-secondary">🛡️ Jasa Joki Game</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 64 }}>
      <div className="row between wrap" style={{ marginBottom: 24 }}>
        <div>
          <span className="pill pill-cyan" style={{ marginBottom: 6 }}>PROSES CHECKOUT</span>
          <h1 style={{ margin: 0, fontSize: "clamp(26px, 3vw, 36px)" }}>Rincian & Pembayaran Pesanan</h1>
        </div>
        <Link href="/topup" className="btn btn-ghost btn-sm">
          + Tambah Item Lain
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.8fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Left Column: Items in Cart */}
        <div>
          <div className="card mb" style={{ border: "1px solid var(--border-light)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              Daftar Item ({items.length})
            </h3>

            {items.map((i) => (
              <div
                key={i._key}
                className="row between wrap"
                style={{
                  borderBottom: "1px solid var(--border)",
                  padding: "16px 0",
                  gap: 16
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                    <span className="pill pill-cyan" style={{ fontSize: 10 }}>
                      {i.type === "joki" ? "JOKI" : "TOP-UP"}
                    </span>
                    <strong style={{ fontSize: 15 }}>{i.name}</strong>
                  </div>

                  <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
                    {i.quantity}x @ {rupiah(i.price)}
                    {i.options?.uid && (
                      <span style={{ color: "var(--text-main)", marginLeft: 6 }}>
                        · UID: <strong>{i.options.uid}</strong> {i.options.server ? `(${i.options.server})` : ""}
                      </span>
                    )}
                    {i.options?.nickname && (
                      <span style={{ color: "var(--success)", marginLeft: 6 }}>
                        · {i.options.nickname}
                      </span>
                    )}
                    {i.options?.is_combo && <span style={{ color: "var(--amber-light)", marginLeft: 6 }}>· Paket Combo</span>}
                    {i.options?.details?.target_rank && <span style={{ marginLeft: 6 }}>· Target: {i.options.details.target_rank}</span>}
                    {i.options?.details?.target_region && <span style={{ marginLeft: 6 }}>· Region: {i.options.details.target_region}</span>}
                  </div>
                </div>

                <div className="row" style={{ gap: 14 }}>
                  <strong style={{ fontSize: 17, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                    {rupiah(i.price * (i.quantity || 1))}
                  </strong>
                  <button
                    className="btn-icon"
                    onClick={() => removeItem(i._key)}
                    title="Hapus dari keranjang"
                    style={{ width: 32, height: 32, color: "var(--danger)" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="row between" style={{ marginTop: 14 }}>
              <span className="muted" style={{ fontSize: 13 }}>Kategori Pesanan</span>
              <span className="pill pill-cyan">{type === "joki" ? "Jasa Joki Akun" : "Top-up Instan"}</span>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="card" style={{ background: "var(--surface)", border: "1px dashed var(--border-light)" }}>
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <div>
                <strong style={{ fontSize: 14, display: "block", color: "var(--text-main)" }}>
                  Jaminan Transaksi Resmi & Aman
                </strong>
                <span className="muted" style={{ fontSize: 12 }}>
                  Setiap transaksi diproses via Midtrans berlisensi Bank Indonesia. Jika voucher gagal dikirim atau joki tidak sesuai deskripsi, garansi refund 100% berlaku.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Midtrans Payment CTA */}
        <div style={{ position: "sticky", top: 90 }}>
          <div className="card" style={{ border: "1px solid var(--border-light)", boxShadow: "var(--shadow)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              Ringkasan Pembayaran
            </h3>

            <div className="row between mt">
              <span className="muted">Total Item</span>
              <strong>{items.length} item</strong>
            </div>

            <div className="row between mt">
              <span className="muted">Subtotal Produk</span>
              <span>{rupiah(total)}</span>
            </div>

            <div className="row between mt">
              <span className="muted">Biaya Gateway</span>
              <span style={{ color: "var(--success)" }}>Gratis / Tergantung Metode</span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0 14px" }} />

            <div className="row between">
              <strong style={{ fontSize: 16 }}>Total Akhir</strong>
              <strong style={{ fontSize: 22, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                {rupiah(total)}
              </strong>
            </div>

            {error && (
              <div className="track-error-card mt">
                <span style={{ fontSize: 13 }}>⚠️ {error}</span>
              </div>
            )}

            {!user && (
              <div className="card mt" style={{ background: "var(--amber-soft)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: 12 }}>
                <span style={{ fontSize: 12, color: "var(--amber-light)" }}>
                  💡 Anda belum masuk ke akun. Klik tombol di bawah untuk login / daftar dalam 10 detik sebelum pembayaran.
                </span>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg mt"
              style={{ width: "100%", marginTop: 18 }}
              onClick={checkout}
              disabled={loading}
            >
              {loading ? "Menyiapkan Pembayaran…" : user ? "Bayar via Midtrans Sekarang →" : "Masuk Akun & Bayar →"}
            </button>

            <div className="center mt" style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>
              Mendukung QRIS, BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, dan ShopeePay.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
