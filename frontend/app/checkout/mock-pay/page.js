"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { rupiah } from "@/utils/format";

function MockPay() {
  const sp = useSearchParams();
  const router = useRouter();
  const orderId = sp.get("order");
  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (orderId) api.order(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  async function confirm() {
    setPaying(true);
    try {
      await api.mockConfirm(orderId);
      router.push(`/dashboard/orders/${orderId}`);
    } catch (err) {
      alert(err.message);
      setPaying(false);
    }
  }

  return (
    <div className="container auth-wrap">
      <div className="card auth-card center">
        <div className="badge" style={{ background: "var(--bg-2)" }}>Mode Simulasi Midtrans (Sandbox/Stub)</div>
        <h2>Pembayaran</h2>
        {order ? (
          <>
            <p className="muted">Pesanan {order.order_number}</p>
            <div className="stat-value" style={{ color: "var(--primary-2)" }}>{rupiah(order.total_amount)}</div>
            <div style={{
              width: 180, height: 180, margin: "20px auto", borderRadius: 12,
              background: "repeating-conic-gradient(#0b1020 0 25%, #fff 0 50%) 0 0/24px 24px",
              border: "8px solid #fff",
            }} title="QRIS simulasi" />
            <p className="muted" style={{ fontSize: 13 }}>Scan QRIS (simulasi). Klik tombol untuk menandai pembayaran berhasil.</p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={confirm} disabled={paying}>
              {paying ? "Memverifikasi…" : "Saya Sudah Bayar"}
            </button>
          </>
        ) : (
          <p className="muted">Memuat pesanan…</p>
        )}
      </div>
    </div>
  );
}

export default function MockPayPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 40 }}>Memuat…</div>}>
      <MockPay />
    </Suspense>
  );
}
