"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
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
