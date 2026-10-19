"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { rupiah, statusColor, statusLabel } from "@/utils/format";

export default function OrderTrackerModal({ isOpen, onClose }) {
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSearch(e) {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // First try direct lookup if it's an ID or query orders
      const order = await api.order(orderQuery.trim());
      setResult(order);
    } catch (_) {
      // If direct order fails, search in user orders if available
      try {
        const list = await api.orders();
        const found = list.find((o) =>
          o.order_number?.toLowerCase() === orderQuery.trim().toLowerCase() ||
          String(o.id) === orderQuery.trim()
        );
        if (found) {
          setResult(found);
        } else {
          setError("Pesanan tidak ditemukan. Periksa kembali Nomor Pesanan atau Invoice Anda.");
        }
      } catch (err) {
        setError("Pesanan tidak ditemukan atau Anda perlu masuk ke akun Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header row between">
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <h3 style={{ margin: 0, fontSize: 18 }}>Lacak Pesanan Kilat</h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        <p className="muted" style={{ fontSize: 13, marginTop: 8, marginBottom: 16 }}>
          Masukkan Nomor Pesanan (misal: <code>VS-20261019-XXXX</code> atau ID angka) untuk memantau status secara langsung tanpa login.
        </p>

        <form onSubmit={handleSearch} className="row" style={{ gap: 8 }}>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Nomor Pesanan / Invoice ID..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Mencari…" : "Lacak"}
          </button>
        </form>

        {error && (
          <div className="track-error-card mt">
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13 }}>{error}</span>
          </div>
        )}

        {result && (
          <div className="track-result-card card mt">
            <div className="row between">
              <div>
                <span className="pill pill-cyan" style={{ fontSize: 11 }}>
                  {result.type === "joki" ? "JASA JOKI" : "TOP-UP INSTAN"}
                </span>
                <h4 style={{ margin: "6px 0 2px", fontSize: 16 }}>{result.order_number}</h4>
                <div className="muted" style={{ fontSize: 12 }}>
                  Total: <strong style={{ color: "var(--text-main)" }}>{rupiah(result.total_amount)}</strong>
                </div>
              </div>
              <span
                className="pill"
                style={{
                  background: statusColor(result.status) + "22",
                  color: statusColor(result.status),
                  border: `1px solid ${statusColor(result.status)}55`,
                  fontSize: 12
                }}
              >
                {statusLabel(result.status)}
              </span>
            </div>

            {result.type === "joki" && result.joki_order && (
              <div style={{ marginTop: 14 }}>
                <div className="row between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span className="muted">Progres Pengerjaan</span>
                  <strong>{result.joki_order.progress || 0}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${result.joki_order.progress || 0}%` }} />
                </div>
              </div>
            )}

            <button
              className="btn btn-secondary btn-sm mt"
              style={{ width: "100%" }}
              onClick={() => {
                onClose();
                router.push(`/dashboard/orders/${result.id}`);
              }}
            >
              Lihat Rincian Lengkap & Chat Booster →
            </button>
          </div>
        )}

        <div className="modal-footer-note mt">
          <span className="muted" style={{ fontSize: 12 }}>
            💡 Butuh bantuan mendesak? Hubungi tim support WhatsApp kami 24/7.
          </span>
        </div>
      </div>
    </div>
  );
}
