"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-wrap">
      <div className="card auth-card">
        <h2 style={{ marginTop: 0 }}>Daftar Akun</h2>
        <p className="muted">Buat akun untuk mulai top-up & order joki.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label>Nama Lengkap</label>
            <input className="input" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>No. WhatsApp (opsional)</label>
            <input className="input" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Kata Sandi</label>
            <input className="input" type="password" required minLength={8} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="field">
            <label>Konfirmasi Kata Sandi</label>
            <input className="input" type="password" required value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? <span className="spinner" /> : "Daftar"}
          </button>
        </form>
        <p className="muted mt center">
          Sudah punya akun? <Link href="/auth/login" style={{ color: "var(--primary-2)" }}>Masuk</Link>
        </p>
      </div>
    </div>
  );
}
