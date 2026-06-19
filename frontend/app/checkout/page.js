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
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // For mixed carts we group by type; here we submit one order per type set.
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
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="card center">
          <h2>Keranjang kosong</h2>
          <p className="muted">Belum ada item. Yuk pilih layanan.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/topup" className="btn btn-primary">Top-up</Link>
            <Link href="/joki" className="btn btn-ghost">Jasa Joki</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1>Checkout</h1>
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Item Pesanan</h3>
          {items.map((i) => (
            <div key={i._key} className="row between" style={{ borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{i.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {i.quantity}x · {rupiah(i.price)}
                  {i.options?.uid && ` · UID ${i.options.uid}`}
                  {i.options?.is_combo && ` · Paket Combo`}
                  {i.options?.details?.target_region && ` · ${i.options.details.target_region}`}
                  {i.options?.details?.target_area && ` · ${i.options.details.target_area}`}
                  {i.options?.details?.target_rank && ` · target ${i.options.details.target_rank}`}
                </div>
              </div>
              <div className="row">
                <strong>{rupiah(i.price * (i.quantity || 1))}</strong>
                <button className="btn btn-sm btn-ghost" onClick={() => removeItem(i._key)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>Ringkasan</h3>
          <div className="row between"><span className="muted">Tipe</span><span>{type === "joki" ? "Jasa Joki" : "Top-up"}</span></div>
          <div className="row between mt"><span className="muted">Total Item</span><span>{items.length}</span></div>
          <div className="row between mt" style={{ fontSize: 20 }}><strong>Total</strong><strong style={{ color: "var(--primary-2)" }}>{rupiah(total)}</strong></div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary mt" style={{ width: "100%" }} onClick={checkout} disabled={loading}>
            {loading ? "Memproses…" : "Bayar Sekarang"}
          </button>
          <p className="muted center" style={{ fontSize: 12, marginBottom: 0 }}>
            Pembayaran via Midtrans (QRIS, VA, e-wallet, transfer bank).
          </p>
        </div>
      </div>
    </div>
  );
}
