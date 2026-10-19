"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import OrderTrackerModal from "./OrderTrackerModal";
import { rupiah } from "@/utils/format";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items, total } = useCart();
  const { unread, markAllRead } = useNotifications();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  }

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link href="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary)" />
                <path d="M2 17L12 22L22 17" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">VERAND<span className="brand-accent">STORE</span></span>
              <span className="brand-sub">GAME TOP-UP & JOKI</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <Link href="/topup" className="nav-item">
              <span>Top-up Kilat</span>
              <span className="nav-tag">1-3 MNT</span>
            </Link>
            <Link href="/joki" className="nav-item">
              <span>Jasa Joki</span>
            </Link>
            <button className="nav-btn-link" onClick={() => setTrackerOpen(true)}>
              <span style={{ fontSize: 13 }}>🔍</span>
              <span>Lacak Pesanan</span>
            </button>
            {user && <Link href="/dashboard" className="nav-item">Dashboard</Link>}
            {user?.role === "booster" && <Link href="/booster" className="nav-item role-tag booster">Booster Hub</Link>}
            {user?.role === "admin" && <Link href="/admin" className="nav-item role-tag admin">Admin Panel</Link>}
          </nav>

          <div className="nav-spacer" />

          {/* Right Action Bar */}
          <div className="nav-actions">
            {/* Cart Link with Badge */}
            <Link href="/checkout" className="btn-cart" title="Keranjang Belanja">
              <div className="cart-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {items.length > 0 && <span className="cart-badge">{items.length}</span>}
              </div>
              {items.length > 0 && (
                <span className="cart-total">{rupiah(total)}</span>
              )}
            </Link>

            {/* User Session */}
            {user ? (
              <div className="user-nav-group">
                <button
                  className="btn-icon"
                  title={unread > 0 ? `${unread} notifikasi baru` : "Notifikasi"}
                  onClick={markAllRead}
                  style={{ position: "relative" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unread > 0 && <span className="notification-dot">{unread}</span>}
                </button>

                <Link href="/dashboard" className="user-profile-chip">
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="user-name">{user.name.split(" ")[0]}</span>
                </Link>

                <button className="btn btn-sm btn-ghost" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="guest-nav-group">
                <Link href="/auth/login" className="btn btn-sm btn-ghost">Masuk</Link>
                <Link href="/auth/register" className="btn btn-sm btn-primary">Daftar</Link>
              </div>
            )}

            {/* Mobile Burger Toggle */}
            <button
              className="btn-burger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className={`burger-line ${mobileMenuOpen ? "open" : ""}`} />
              <span className={`burger-line ${mobileMenuOpen ? "open" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-nav-links">
              <Link href="/topup" onClick={() => setMobileMenuOpen(false)} className="mobile-item">
                <span>⚡ Top-up Kilat</span>
                <span className="pill pill-cyan">1-3 MNT</span>
              </Link>
              <Link href="/joki" onClick={() => setMobileMenuOpen(false)} className="mobile-item">
                <span>🛡️ Jasa Joki Game</span>
              </Link>
              <button
                className="mobile-item mobile-item-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackerOpen(true);
                }}
              >
                <span>🔍 Lacak Pesanan Cepat</span>
              </button>
              {user && (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-item">
                  <span>📊 Dashboard Pesanan</span>
                </Link>
              )}
              {user?.role === "booster" && (
                <Link href="/booster" onClick={() => setMobileMenuOpen(false)} className="mobile-item">
                  <span>⚔️ Hub Booster</span>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-item">
                  <span>⚙️ Admin Panel</span>
                </Link>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {user ? (
                <div className="row between">
                  <span className="muted" style={{ fontSize: 13 }}>Masuk sebagai <strong>{user.name}</strong></span>
                  <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Keluar</button>
                </div>
              ) : (
                <div className="row" style={{ width: "100%", gap: 8 }}>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost" style={{ flex: 1, textAlign: "center" }}>
                    Masuk
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>
                    Daftar Akun
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Order Tracker Modal */}
      <OrderTrackerModal isOpen={trackerOpen} onClose={() => setTrackerOpen(false)} />
    </>
  );
}
