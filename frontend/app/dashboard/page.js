"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { rupiah, statusLabel, statusColor, GAMES } from "@/utils/format";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login?redirect=/dashboard");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      api.orders().then(setOrders).catch(() => {});
      api.recommendations().then(setRecs).catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <div className="center muted">Memuat dashboard pelanggan…</div>
      </div>
    );
  }

  const activeOrdersCount = orders.filter((o) => !["finished", "cancelled"].includes(o.status)).length;

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 64 }}>
      {/* Welcome Banner */}
      <div className="card mb" style={{ border: "1px solid var(--border-light)", background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)", padding: 28 }}>
        <div className="row between wrap" style={{ gap: 20 }}>
          <div className="row" style={{ gap: 16 }}>
            <div className="user-avatar" style={{ width: 52, height: 52, fontSize: 22 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                <h1 style={{ margin: 0, fontSize: "clamp(22px, 3vw, 28px)" }}>Halo, {user.name} 👋</h1>
                <span className="pill pill-cyan">MEMBER AKTIF</span>
              </div>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                {user.email} · Pantau seluruh status top-up diamond dan progres joki akun Anda.
              </p>
            </div>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <Link href="/topup" className="btn btn-primary btn-sm">
              ⚡ Top-up Baru
            </Link>
            <Link href="/joki" className="btn btn-secondary btn-sm">
              🛡️ Order Joki
            </Link>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-3" style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <div className="metric-item">
            <span className="metric-value">{orders.length}</span>
            <span className="metric-label">Total Pesanan</span>
          </div>
          <div className="metric-item">
            <span className="metric-value" style={{ color: activeOrdersCount > 0 ? "var(--primary-light)" : "var(--muted)" }}>
              {activeOrdersCount}
            </span>
            <span className="metric-label">Pesanan Sedang Aktif</span>
          </div>
          <div className="metric-item">
            <span className="metric-value" style={{ color: "var(--amber-light)" }}>VIP</span>
            <span className="metric-label">Tingkat Keanggotaan</span>
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="section-head">
        <div>
          <h2>Riwayat <span className="accent">Pesanan Saya</span></h2>
          <span className="muted" style={{ fontSize: 13 }}>Klik pada pesanan untuk melihat detail pengerjaan, screenshot, atau chat booster</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card center" style={{ padding: "48px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <h3 style={{ margin: "0 0 6px" }}>Belum Ada Pesanan</h3>
          <p className="muted" style={{ fontSize: 14, margin: "0 0 20px" }}>
            Anda belum pernah melakukan pemesanan top-up diamond maupun jasa joki di Verand Store.
          </p>
          <div className="row" style={{ justifyContent: "center", gap: 10 }}>
            <Link href="/topup" className="btn btn-primary">Mulai Top-up</Link>
            <Link href="/joki" className="btn btn-secondary">Cari Jasa Joki</Link>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gap: 14 }}>
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/orders/${o.id}`}
              className="card row between wrap"
              style={{
                padding: "18px 22px",
                transition: "all 0.18s ease",
              }}
            >
              <div>
                <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                  <span className="pill pill-cyan" style={{ fontSize: 10 }}>
                    {o.type === "joki" ? "JASA JOKI" : "TOP-UP"}
                  </span>
                  <strong style={{ fontSize: 16 }}>{o.order_number}</strong>
                </div>

                <div className="muted" style={{ fontSize: 13 }}>
                  {o.items?.length || 0} Item · Total: <strong style={{ color: "var(--text-main)" }}>{rupiah(o.total_amount)}</strong>
                  {o.created_at && ` · ${new Date(o.created_at).toLocaleDateString("id-ID")}`}
                </div>
              </div>

              <div className="row" style={{ gap: 18 }}>
                {o.type === "joki" && o.joki_order && (
                  <div style={{ width: 130 }}>
                    <div className="row between" style={{ fontSize: 11, marginBottom: 4 }}>
                      <span className="muted">Progres</span>
                      <strong style={{ color: "var(--primary-light)" }}>{o.joki_order.progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${o.joki_order.progress}%` }} />
                    </div>
                  </div>
                )}

                <span
                  className="pill"
                  style={{
                    background: statusColor(o.status) + "22",
                    color: statusColor(o.status),
                    border: `1px solid ${statusColor(o.status)}55`,
                    fontSize: 12
                  }}
                >
                  {statusLabel(o.status)}
                </span>

                <span style={{ color: "var(--muted)", fontSize: 16 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recommended Services Section */}
      {recs?.items?.length > 0 && (
        <div style={{ marginTop: 52 }}>
          <div className="section-head">
            <div>
              <h2>Rekomendasi <span className="accent">Untuk Anda</span></h2>
              <span className="muted" style={{ fontSize: 13 }}>Pilihan layanan terpopuler berdasarkan riwayat game Anda</span>
            </div>
          </div>

          <div className="grid grid-4">
            {recs.items.map((p) => (
              <Link
                key={p.id}
                href={p.type === "joki" ? `/joki/${p.game}` : `/topup?game=${p.game}`}
                className="card product-card-v2"
                style={{ textDecoration: "none" }}
              >
                <div className="row between">
                  <span className="game-micro-tag">{GAMES[p.game] || p.game}</span>
                  <span className="bonus-tag">Rekomendasi</span>
                </div>
                <div className="product-name" style={{ margin: "8px 0" }}>{p.name}</div>
                <div className="product-card-footer row between">
                  <div className="price-value">{rupiah(p.price)}</div>
                  <span className="btn btn-sm btn-secondary">Lihat →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
