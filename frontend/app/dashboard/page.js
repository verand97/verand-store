"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { rupiah, statusLabel, statusColor } from "@/utils/format";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      api.orders().then(setOrders).catch(() => {});
      api.recommendations().then(setRecs).catch(() => {});
    }
  }, [user]);

  if (loading || !user) return <div className="container" style={{ paddingTop: 40 }}>Memuat…</div>;

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1>Halo, {user.name} 👋</h1>
      <p className="muted">Pantau semua pesanan top-up dan jasa joki Anda di sini.</p>

      <div className="section-head"><h2>Pesanan Saya</h2></div>
      {orders.length === 0 ? (
        <div className="card center">
          <p className="muted">Belum ada pesanan.</p>
          <Link href="/topup" className="btn btn-primary">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {orders.map((o) => (
            <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="card row between wrap">
              <div>
                <div style={{ fontWeight: 700 }}>{o.order_number}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {o.type === "joki" ? "Jasa Joki" : "Top-up"} · {o.items?.length || 0} item · {rupiah(o.total_amount)}
                </div>
              </div>
              <div className="row">
                {o.type === "joki" && o.joki_order && (
                  <div style={{ width: 120 }}>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${o.joki_order.progress}%` }} /></div>
                    <div className="muted center" style={{ fontSize: 11, marginTop: 2 }}>{o.joki_order.progress}%</div>
                  </div>
                )}
                <span className="pill" style={{ background: statusColor(o.status) + "22", color: statusColor(o.status) }}>
                  {statusLabel(o.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {recs?.items?.length > 0 && (
        <>
          <div className="section-head"><h2>Rekomendasi Untuk Anda 🤖</h2></div>
          <div className="grid grid-4">
            {recs.items.map((p) => (
              <Link key={p.id} href={p.type === "joki" ? `/joki/${p.game}` : "/topup"} className="card product-card">
                <span className="game-tag">{p.game}</span>
                <div className="name">{p.name}</div>
                <div className="price">{rupiah(p.price)}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
