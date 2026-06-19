"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/services/api";
import OrderTracker from "@/components/OrderTracker";
import ChatPanel from "@/components/ChatPanel";
import { rupiah, statusLabel, statusColor, GAMES, jokiDetailEntries } from "@/utils/format";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "");

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState([]);
  const [account, setAccount] = useState({ account_login: "", account_password: "", game_uid: "", game_server: "" });
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const o = await api.order(id);
      setOrder(o);
      if (o.type === "joki") setProgress(await api.progress(id));
    } catch (err) {
      setMsg(err.message);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function submitAccount(e) {
    e.preventDefault();
    try {
      await api.submitAccount(id, account);
      setMsg("Akun terkirim. Booster akan segera mengerjakan.");
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (!order) return <div className="container" style={{ paddingTop: 40 }}>{msg || "Memuat…"}</div>;

  const joki = order.joki_order;

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <div className="row between wrap">
        <div>
          <p className="muted" style={{ margin: 0 }}>{order.type === "joki" ? "Jasa Joki" : "Top-up"}</p>
          <h1 style={{ margin: "4px 0" }}>{order.order_number}</h1>
        </div>
        <span className="pill" style={{ background: statusColor(order.status) + "22", color: statusColor(order.status), fontSize: 14 }}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="card mt mb">
        <OrderTracker status={order.status} type={order.type} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: order.type === "joki" ? "1.4fr 1fr" : "1fr", gap: 24 }}>
        <div>
          <div className="card mb">
            <h3 style={{ marginTop: 0 }}>Detail Pesanan</h3>
            {order.items?.map((it) => (
              <div key={it.id} className="row between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{it.quantity}x</div>
                </div>
                <strong>{rupiah(it.price * it.quantity)}</strong>
              </div>
            ))}
            <div className="row between mt"><span className="muted">Pembayaran</span>
              <span className="pill" style={{ background: statusColor(order.payment_status) + "22", color: statusColor(order.payment_status) }}>{statusLabel(order.payment_status)}</span>
            </div>
            <div className="row between mt" style={{ fontSize: 18 }}><strong>Total</strong><strong style={{ color: "var(--primary-2)" }}>{rupiah(order.total_amount)}</strong></div>
          </div>

          {joki && jokiDetailEntries(joki.targets).length > 0 && (
            <div className="card mb">
              <h3 style={{ marginTop: 0 }}>Detail Joki — {GAMES[joki.game] || joki.game}</h3>
              {jokiDetailEntries(joki.targets).map(([label, value]) => (
                <div className="row between mt" key={label}>
                  <span className="muted">{label}</span>
                  <span style={{ textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {joki && (
            <div className="card mb">
              <h3 style={{ marginTop: 0 }}>Progres Pengerjaan — {joki.progress}%</h3>
              <div className="progress-track mb"><div className="progress-fill" style={{ width: `${joki.progress}%` }} /></div>
              {joki.booster && <p className="muted">Booster: {joki.booster.name}</p>}
              {progress.length === 0 && <p className="muted">Belum ada update progres.</p>}
              {progress.map((p) => (
                <div key={p.id} className="row" style={{ gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="pill" style={{ background: "var(--card-2)" }}>{p.percent}%</div>
                  <div style={{ flex: 1 }}>
                    <div>{p.activity}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{p.author?.name} · {new Date(p.created_at).toLocaleString("id-ID")}</div>
                    {p.screenshot && <a href={`${API_ORIGIN}/storage/${p.screenshot}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: 13 }}>Lihat screenshot</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {order.type === "joki" && (
          <div>
            {order.status === "waiting_for_account" && (
              <div className="card mb">
                <h3 style={{ marginTop: 0 }}>Kirim Akun Game</h3>
                <p className="muted" style={{ fontSize: 13 }}>Kredensial dienkripsi & hanya dipakai booster untuk pengerjaan.</p>
                <form onSubmit={submitAccount}>
                  <div className="field"><label>UID</label><input className="input" value={account.game_uid} onChange={(e) => setAccount({ ...account, game_uid: e.target.value })} /></div>
                  <div className="field"><label>Server</label><input className="input" value={account.game_server} onChange={(e) => setAccount({ ...account, game_server: e.target.value })} /></div>
                  <div className="field"><label>Login / Email</label><input className="input" required value={account.account_login} onChange={(e) => setAccount({ ...account, account_login: e.target.value })} /></div>
                  <div className="field"><label>Password</label><input className="input" type="password" required value={account.account_password} onChange={(e) => setAccount({ ...account, account_password: e.target.value })} /></div>
                  <button className="btn btn-primary" style={{ width: "100%" }}>Kirim Akun</button>
                </form>
              </div>
            )}
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Chat dengan Booster</h3>
              <ChatPanel orderId={id} />
            </div>
          </div>
        )}
      </div>
      {msg && <p className="success-text mt">{msg}</p>}
    </div>
  );
}
