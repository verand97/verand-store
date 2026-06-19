"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { rupiah, statusLabel, statusColor } from "@/utils/format";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      api.adminDashboard().then(setStats).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    if (tab === "orders") api.adminOrders().then((d) => setOrders(d.data || [])).catch(() => {});
    if (tab === "users") api.adminUsers().then((d) => setUsers(d.data || [])).catch(() => {});
  }, [tab, user]);

  if (loading || !user) return <div className="container" style={{ paddingTop: 40 }}>Memuat…</div>;

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1>Panel Admin</h1>
      <div className="tabs">
        {["overview", "orders", "users"].map((t) => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "Ringkasan" : t === "orders" ? "Pesanan" : "Pengguna"}
          </div>
        ))}
      </div>

      {tab === "overview" && stats && (
        <>
          <div className="grid grid-4 mb">
            {[
              ["Total Pengguna", stats.users],
              ["Booster", stats.boosters],
              ["Total Pesanan", stats.orders],
              ["Joki Aktif", stats.pending_joki],
            ].map(([label, val]) => (
              <div key={label} className="card">
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
          <div className="card mb">
            <div className="stat-label">Pendapatan (Lunas)</div>
            <div className="stat-value" style={{ color: "var(--success)" }}>{rupiah(stats.revenue)}</div>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Pesanan Terbaru</h3>
            <table>
              <thead><tr><th>Order</th><th>User</th><th>Tipe</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recent_orders?.map((o) => (
                  <tr key={o.id}>
                    <td>{o.order_number}</td>
                    <td>{o.user?.name}</td>
                    <td>{o.type}</td>
                    <td>{rupiah(o.total_amount)}</td>
                    <td><span className="pill" style={{ background: statusColor(o.status) + "22", color: statusColor(o.status) }}>{statusLabel(o.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="card">
          <table>
            <thead><tr><th>Order</th><th>User</th><th>Tipe</th><th>Total</th><th>Status</th><th>Bayar</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_number}</td>
                  <td>{o.user?.name}</td>
                  <td>{o.type}</td>
                  <td>{rupiah(o.total_amount)}</td>
                  <td><span className="pill" style={{ background: statusColor(o.status) + "22", color: statusColor(o.status) }}>{statusLabel(o.status)}</span></td>
                  <td>{statusLabel(o.payment_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="card">
          <table>
            <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Saldo</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="pill" style={{ background: "var(--card-2)" }}>{u.role}</span></td>
                  <td>{rupiah(u.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
