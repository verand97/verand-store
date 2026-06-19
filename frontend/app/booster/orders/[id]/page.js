"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/services/api";
import ChatPanel from "@/components/ChatPanel";
import { rupiah, statusLabel, statusColor, GAMES, jokiDetailEntries } from "@/utils/format";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "");

export default function BoosterOrderPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState([]);
  const [form, setForm] = useState({ percent: 0, activity: "" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const o = await api.order(id);
    setOrder(o);
    setProgress(await api.progress(id));
    if (o.joki_order) setForm((f) => ({ ...f, percent: o.joki_order.progress }));
  }
  useEffect(() => { load().catch((e) => setMsg(e.message)); }, [id]);

  async function postProgress(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("percent", form.percent);
    fd.append("activity", form.activity);
    if (file) fd.append("screenshot", file);
    try {
      await api.postProgress(id, fd);
      setForm({ ...form, activity: "" });
      setFile(null);
      load();
    } catch (err) { setMsg(err.message); }
  }

  async function changeStatus(status) {
    try { await api.transition(id, status); load(); } catch (err) { alert(err.message); }
  }

  if (!order) return <div className="container" style={{ paddingTop: 40 }}>{msg || "Memuat…"}</div>;

  const joki = order.joki_order;
  const next = { waiting_for_account: null, processing: "completed", completed: "finished" }[order.status];

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1 style={{ marginBottom: 4 }}>{order.order_number}</h1>
      <p className="muted">{GAMES[joki?.game] || joki?.game} · {joki?.service} · <span className="pill" style={{ background: statusColor(order.status) + "22", color: statusColor(order.status) }}>{statusLabel(order.status)}</span></p>

      <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        <div>
          <div className="card mb">
            <h3 style={{ marginTop: 0 }}>Info Pengerjaan</h3>
            {jokiDetailEntries(joki?.targets).length === 0 && (
              <p className="muted" style={{ marginTop: 0 }}>Belum ada detail dari customer.</p>
            )}
            {jokiDetailEntries(joki?.targets).map(([label, value]) => (
              <div className="row between mt" key={label}>
                <span className="muted">{label}</span>
                <span style={{ textAlign: "right", maxWidth: "60%" }}>{value}</span>
              </div>
            ))}
            <div className="row between mt"><span className="muted">UID / Server</span><span>{joki?.game_uid || "—"} / {joki?.game_server || "—"}</span></div>
            <div className="row between mt"><span className="muted">Total</span><strong>{rupiah(order.total_amount)}</strong></div>
          </div>

          {order.status === "processing" && (
            <div className="card mb">
              <h3 style={{ marginTop: 0 }}>Update Progres</h3>
              <form onSubmit={postProgress}>
                <div className="field"><label>Persentase: {form.percent}%</label>
                  <input type="range" min={0} max={100} value={form.percent} style={{ width: "100%" }}
                    onChange={(e) => setForm({ ...form, percent: Number(e.target.value) })} />
                </div>
                <div className="field"><label>Aktivitas</label>
                  <input className="input" required value={form.activity} placeholder="cth: Mencapai Legend III"
                    onChange={(e) => setForm({ ...form, activity: e.target.value })} />
                </div>
                <div className="field"><label>Screenshot (opsional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button className="btn btn-primary">Kirim Update</button>
              </form>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Riwayat Progres</h3>
            {progress.length === 0 && <p className="muted">Belum ada.</p>}
            {progress.map((p) => (
              <div key={p.id} className="row" style={{ gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div className="pill" style={{ background: "var(--card-2)" }}>{p.percent}%</div>
                <div style={{ flex: 1 }}>
                  <div>{p.activity}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{new Date(p.created_at).toLocaleString("id-ID")}</div>
                  {p.screenshot && <a href={`${API_ORIGIN}/storage/${p.screenshot}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: 13 }}>Screenshot</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card mb">
            <h3 style={{ marginTop: 0 }}>Kontrol Status</h3>
            <p className="muted" style={{ fontSize: 13 }}>Status saat ini: {statusLabel(order.status)}</p>
            {next ? (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => changeStatus(next)}>
                Tandai: {statusLabel(next)}
              </button>
            ) : order.status === "finished" ? (
              <p className="success-text">Pesanan sudah tuntas. 🎉</p>
            ) : (
              <p className="muted">Menunggu customer mengirim akun.</p>
            )}
            {!["finished", "cancelled"].includes(order.status) && (
              <button className="btn btn-ghost mt" style={{ width: "100%", color: "var(--danger)" }} onClick={() => changeStatus("cancelled")}>
                Batalkan
              </button>
            )}
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Chat dengan Customer</h3>
            <ChatPanel orderId={id} />
          </div>
        </div>
      </div>
      {msg && <p className="error-text mt">{msg}</p>}
    </div>
  );
}
