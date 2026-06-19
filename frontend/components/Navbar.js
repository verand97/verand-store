"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { unread, markAllRead } = useNotifications();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand"><span className="brand-mark">◆</span> Verand<span className="brand-mark">Store</span></Link>
        <div className="nav-links">
          <Link href="/topup">Top-up</Link>
          <Link href="/joki">Jasa Joki</Link>
          {user && <Link href="/dashboard">Dashboard</Link>}
          {user?.role === "booster" && <Link href="/booster">Booster</Link>}
          {user?.role === "admin" && <Link href="/admin">Admin</Link>}
        </div>
        <div className="nav-spacer" />
        <Link href="/checkout" className="btn btn-sm btn-ghost">
          🛒 {items.length > 0 && <span>({items.length})</span>}
        </Link>
        {user ? (
          <div className="row">
            <button
              className="btn btn-sm btn-ghost"
              title={unread > 0 ? `${unread} notifikasi belum dibaca` : "Notifikasi"}
              onClick={markAllRead}
              style={{ position: "relative" }}
            >
              🔔
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4, minWidth: 18, height: 18,
                  padding: "0 5px", borderRadius: 999, background: "var(--danger)",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unread}</span>
              )}
            </button>
            <Link href="/dashboard" className="muted" style={{ fontSize: 14 }}>{user.name}</Link>
            <button className="btn btn-sm" onClick={handleLogout}>Keluar</button>
          </div>
        ) : (
          <div className="row">
            <Link href="/auth/login" className="btn btn-sm btn-ghost">Masuk</Link>
            <Link href="/auth/register" className="btn btn-sm btn-primary">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
