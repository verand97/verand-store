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
      <div className="card auth-card center" style={{ border: "1px solid var(--border-light)", boxShadow: "var(--shadow-lg)" }}>
        <span className="pill pill-amber" style={{ marginBottom: 14 }}>
          SIMULASI MIDTRANS PAYMENT GATEWAY
        </span>

        <h2 style={{ margin: "0 0 6px" }}>Pembayaran QRIS Instan</h2>
        <p className="muted" style={{ fontSize: 13, margin: "0 0 18px" }}>
          Scan kode QR di bawah ini menggunakan aplikasi mobile banking atau e-wallet apa saja.
        </p>

        {order ? (
          <>
            <div className="card mb" style={{ background: "var(--bg)", border: "1px solid var(--border)", textAlign: "left", fontSize: 13 }}>
              <div className="row between">
                <span className="muted">Nomor Pesanan</span>
                <strong>{order.order_number}</strong>
              </div>
              <div className="row between mt">
                <span className="muted">Total Tagihan</span>
                <strong style={{ fontSize: 16, color: "var(--primary-light)" }}>
                  {rupiah(order.total_amount)}
                </strong>
              </div>
            </div>

            {/* Simulated QR Code Canvas */}
            <div
              style={{
                width: 200,
                height: 200,
                margin: "16px auto",
                borderRadius: 14,
                background: "repeating-conic-gradient(#090c13 0 25%, #ffffff 0 50%) 0 0/20px 20px",
                border: "10px solid #ffffff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="QRIS Resmi Midtrans (Simulasi)"
            >
              <div style={{
                background: "#ffffff",
                padding: "6px 10px",
                borderRadius: 6,
                fontWeight: 900,
                fontSize: 12,
                color: "#090c13",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}>
                QRIS
              </div>
            </div>

            <p className="muted" style={{ fontSize: 12, lineHeight: 1.5, margin: "16px 0" }}>
              💡 Dalam mode pengujian (sandbox), klik tombol di bawah ini untuk mensimulasikan notifikasi callback pembayaran sukses dari Midtrans.
            </p>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={confirm}
              disabled={paying}
            >
              {paying ? "Memverifikasi Pembayaran…" : "Saya Sudah Bayar (Konfirmasi) →"}
            </button>
          </>
        ) : (
          <div className="muted" style={{ padding: "30px 0" }}>
            Memuat data pesanan invoice…
          </div>
        )}
      </div>
    </div>
  );
}

export default function MockPayPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 40 }}>Memuat simulasi pembayaran…</div>}>
      <MockPay />
    </Suspense>
  );
}
