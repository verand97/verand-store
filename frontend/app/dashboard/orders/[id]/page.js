"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
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
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const o = await api.order(id);
      setOrder(o);
      if (o.type === "joki") {
        try {
          const p = await api.progress(id);
          setProgress(p);
        } catch (_) {}
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function submitAccount(e) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await api.submitAccount(id, account);
      setMsg("Data akun berhasil dikirimkan dengan enkripsi. Booster akan segera mulai pengerjaan.");
      load();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!order) {
    return (
      <div className="container" style={{ paddingTop: 60 }}>
        <div className="center muted">{msg || "Memuat rincian pesanan…"}</div>
      </div>
    );
  }

  const joki = order.joki_order;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Breadcrumb & Navigation */}
      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        <Link href="/dashboard" style={{ color: "var(--primary-light)", fontSize: 13, textDecoration: "underline" }}>
          ← Kembali ke Dashboard
        </Link>
        <span className="muted" style={{ fontSize: 13 }}>/</span>
        <span className="muted" style={{ fontSize: 13 }}>Pesanan #{order.order_number}</span>
      </div>

      {/* Header Info */}
      <div className="row between wrap" style={{ gap: 16, marginBottom: 24 }}>
        <div>
          <span className="pill pill-cyan" style={{ marginBottom: 6 }}>
            {order.type === "joki" ? "JASA JOKI PRO" : "TOP-UP INSTAN"}
          </span>
          <h1 style={{ margin: "2px 0", fontSize: "clamp(24px, 3.5vw, 34px)" }}>{order.order_number}</h1>
          <div className="muted" style={{ fontSize: 13 }}>
            Dibuat pada: {new Date(order.created_at || Date.now()).toLocaleString("id-ID")}
          </div>
        </div>

        <span
          className="pill"
          style={{
            background: statusColor(order.status) + "22",
            color: statusColor(order.status),
            border: `1px solid ${statusColor(order.status)}55`,
            fontSize: 14,
            padding: "8px 18px",
          }}
        >
          {statusLabel(order.status)}
        </span>
      </div>

      {/* Visual Stepper Tracker */}
      <div className="card mb" style={{ border: "1px solid var(--border-light)" }}>
        <OrderTracker status={order.status} type={order.type} />
      </div>

      {/* Main Grid: Details on Left, Interaction (Account/Chat) on Right */}
      <div className="grid" style={{ gridTemplateColumns: order.type === "joki" ? "1.5fr 1fr" : "1fr", gap: 28, alignItems: "start" }}>
        <div>
          {/* Order Items Card */}
          <div className="card mb" style={{ border: "1px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 17, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
              Daftar Item Pesanan
            </h3>

            {order.items?.map((it) => (
              <div key={it.id} className="row between wrap" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{it.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Jumlah: {it.quantity}x @ {rupiah(it.price)}
                  </div>
                </div>
                <strong style={{ fontSize: 16, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                  {rupiah(it.price * it.quantity)}
                </strong>
              </div>
            ))}

            <div className="row between mt">
              <span className="muted">Status Pembayaran</span>
              <span
                className="pill"
                style={{
                  background: statusColor(order.payment_status) + "22",
                  color: statusColor(order.payment_status),
                  border: `1px solid ${statusColor(order.payment_status)}55`,
                  fontSize: 12
                }}
              >
                {statusLabel(order.payment_status)}
              </span>
            </div>

            <div className="row between mt" style={{ paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <strong style={{ fontSize: 16 }}>Total Transaksi</strong>
              <strong style={{ fontSize: 20, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                {rupiah(order.total_amount)}
              </strong>
            </div>
          </div>

          {/* Joki Specifications (if applicable) */}
          {joki && jokiDetailEntries(joki.targets).length > 0 && (
            <div className="card mb" style={{ border: "1px solid var(--border)" }}>
              <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 17, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                Spesifikasi Joki — {GAMES[joki.game] || joki.game}
              </h3>
              {jokiDetailEntries(joki.targets).map(([label, value]) => (
                <div className="row between mt" key={label} style={{ fontSize: 13 }}>
                  <span className="muted">{label}</span>
                  <strong style={{ textAlign: "right", maxWidth: "60%" }}>{value}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Joki Progress & Activity Stream */}
          {joki && (
            <div className="card mb" style={{ border: "1px solid var(--border)" }}>
              <div className="row between" style={{ marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 17 }}>Progres Pengerjaan</h3>
                <span className="pill pill-cyan" style={{ fontSize: 12 }}>
                  {joki.progress}% Selesai
                </span>
              </div>

              <div className="progress-track mb" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: `${joki.progress}%` }} />
              </div>

              {joki.booster && (
                <div className="row" style={{ gap: 8, margin: "14px 0", padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: 18 }}>⚔️</span>
                  <div>
                    <span className="muted" style={{ fontSize: 11 }}>Booster Penanggung Jawab:</span>
                    <strong style={{ display: "block", fontSize: 13 }}>{joki.booster.name}</strong>
                  </div>
                </div>
              )}

              <div style={{ fontWeight: 700, fontSize: 14, margin: "18px 0 10px" }}>Log Aktivitas Booster:</div>

              {progress.length === 0 ? (
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                  Belum ada update log pengerjaan. Booster akan mengunggah tangkapan layar saat progres bertambah.
                </p>
              ) : (
                <div className="grid" style={{ gap: 10 }}>
                  {progress.map((p) => (
                    <div
                      key={p.id}
                      className="card"
                      style={{
                        background: "var(--surface-2)",
                        padding: 14,
                        border: "1px solid var(--border)"
                      }}
                    >
                      <div className="row between" style={{ marginBottom: 6 }}>
                        <span className="pill pill-green" style={{ fontSize: 11 }}>{p.percent}% Selesai</span>
                        <span className="muted" style={{ fontSize: 11 }}>
                          {new Date(p.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>{p.activity}</div>
                      {p.screenshot && (
                        <a
                          href={`${API_ORIGIN}/storage/${p.screenshot}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--primary-light)", fontSize: 12, fontWeight: 700 }}
                        >
                          📸 Lihat Bukti Screenshot Match →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Credential Submission or Booster Chat */}
        {order.type === "joki" && (
          <div>
            {order.status === "waiting_for_account" && (
              <div className="card mb" style={{ border: "1px solid var(--amber-light)", background: "var(--surface-2)" }}>
                <span className="pill pill-amber" style={{ marginBottom: 8 }}>MENUNGGU KREDENSIAL</span>
                <h3 style={{ marginTop: 0, marginBottom: 6 }}>Kirim Data Akun Game</h3>
                <p className="muted" style={{ fontSize: 12, lineHeight: 1.5, margin: "0 0 16px" }}>
                  Kredensial disimpan dengan enkripsi AES-256 dan hanya digunakan oleh booster untuk login selama pengerjaan.
                </p>

                <form onSubmit={submitAccount}>
                  <div className="field">
                    <label>UID Akun</label>
                    <input
                      className="input"
                      value={account.game_uid}
                      onChange={(e) => setAccount({ ...account, game_uid: e.target.value })}
                      placeholder="User ID game"
                    />
                  </div>
                  <div className="field">
                    <label>Server</label>
                    <input
                      className="input"
                      value={account.game_server}
                      onChange={(e) => setAccount({ ...account, game_server: e.target.value })}
                      placeholder="cth: Asia / 2001"
                    />
                  </div>
                  <div className="field">
                    <label>Email / Akun Login *</label>
                    <input
                      className="input"
                      required
                      value={account.account_login}
                      onChange={(e) => setAccount({ ...account, account_login: e.target.value })}
                      placeholder="Email login game / Moonton ID"
                    />
                  </div>
                  <div className="field">
                    <label>Password Akun *</label>
                    <input
                      className="input"
                      type="password"
                      required
                      value={account.account_password}
                      onChange={(e) => setAccount({ ...account, account_password: e.target.value })}
                      placeholder="Kata sandi akun"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Mengenkripsi & Mengirim…" : "🔒 Kirim Akun Secara Aman"}
                  </button>
                </form>
              </div>
            )}

            {/* Booster Chat Box */}
            <div className="card" style={{ border: "1px solid var(--border-light)" }}>
              <div className="row" style={{ gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>💬</span>
                <h3 style={{ margin: 0, fontSize: 17 }}>Chat Langsung dengan Booster</h3>
              </div>
              <p className="muted" style={{ fontSize: 12, margin: "0 0 14px", lineHeight: 1.4 }}>
                Komunikasi langsung tanpa aplikasi pihak ketiga. Dilarang membagikan data pembayaran di luar sistem resmi.
              </p>
              <ChatPanel orderId={id} />
            </div>
          </div>
        )}
      </div>

      {msg && (
        <div className="pill pill-green mt" style={{ padding: "10px 16px", display: "inline-block" }}>
          ✓ {msg}
        </div>
      )}
    </div>
  );
}
