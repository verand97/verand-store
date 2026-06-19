"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      router.push(user.role === "admin" ? "/admin" : user.role === "booster" ? "/booster" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-wrap">
      <div className="card auth-card">
        <h2 style={{ marginTop: 0 }}>Masuk</h2>
        <p className="muted">Selamat datang kembali di Verand Store.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Kata Sandi</label>
            <input className="input" type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? <span className="spinner" /> : "Masuk"}
          </button>
        </form>
        <p className="muted mt center">
          Belum punya akun? <Link href="/auth/register" style={{ color: "var(--primary-2)" }}>Daftar</Link>
        </p>
        <div className="card mt" style={{ background: "var(--bg-2)", fontSize: 13 }}>
          <strong>Akun demo:</strong>
          <div className="muted">customer@verand.store / booster@verand.store / admin@verand.store</div>
          <div className="muted">Password semua: <code>password</code></div>
        </div>
      </div>
    </div>
  );
}
