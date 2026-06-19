"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { statusLabel, statusColor, GAMES } from "@/utils/format";

export default function BoosterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "booster" && user.role !== "admin"))) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  async function load() {
    try { setQueue(await api.jokiQueue()); } catch (err) { setMsg(err.message); }
  }
  useEffect(() => { if (user) load(); }, [user]);

  async function take(orderId) {
    try { await api.assign(orderId); load(); } catch (err) { alert(err.message); }
  }

  if (loading || !user) return <div className="container" style={{ paddingTop: 40 }}>Memuat…</div>;

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1>Panel Booster</h1>
      <p className="muted">Antrean pekerjaan joki. Ambil tugas, update progres, dan selesaikan.</p>

      <div className="card mt">
        <table>
          <thead>
            <tr><th>Order</th><th>Game</th><th>Layanan</th><th>Customer</th><th>Status</th><th>Booster</th><th></th></tr>
          </thead>
          <tbody>
            {queue.map((j) => (
              <tr key={j.id}>
                <td>{j.order?.order_number}</td>
                <td>{GAMES[j.game] || j.game}</td>
                <td>{j.service}</td>
                <td>{j.order?.user?.name}</td>
                <td><span className="pill" style={{ background: statusColor(j.order?.status) + "22", color: statusColor(j.order?.status) }}>{statusLabel(j.order?.status)}</span></td>
                <td>{j.booster_id ? (j.booster_id === user.id ? "Saya" : "Diambil") : "—"}</td>
                <td>
                  {!j.booster_id && <button className="btn btn-sm btn-primary" onClick={() => take(j.order_id)}>Ambil</button>}
                  {j.booster_id === user.id && <Link href={`/booster/orders/${j.order_id}`} className="btn btn-sm">Kerjakan</Link>}
                </td>
              </tr>
            ))}
            {queue.length === 0 && <tr><td colSpan={7} className="muted center">Tidak ada pekerjaan.</td></tr>}
          </tbody>
        </table>
      </div>
      {msg && <p className="error-text">{msg}</p>}
    </div>
  );
}
