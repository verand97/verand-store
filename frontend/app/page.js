"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { useCart } from "@/context/CartContext";
import { GAMES, rupiah, statusColor, statusLabel } from "@/utils/format";
import { REVIEWS } from "@/utils/catalogData";

const GAME_CARDS = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    genre: "MOBA 5v5",
    tagline: "Top-up Diamonds kilat, Rank Boost Mythic/Immortal, MMR Hero & Classic Winrate.",
    image: "/images/mlbb_banner.jpg",
    rating: "4.9 ★",
    orders: "28.4k+ Pesanan",
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    genre: "OPEN WORLD RPG",
    tagline: "Genesis Crystals, Blessing Welkin, Perawatan Akun, Weekly Boss & Joki Eksplorasi 100%.",
    image: "/images/genshin_banner.jpg",
    rating: "4.9 ★",
    orders: "19.2k+ Pesanan",
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    genre: "SPACE FANTASY RPG",
    tagline: "Oneiric Shard, Express Supply Pass, Daily Training, Echo of War & Eksplorasi Area.",
    image: "/images/hsr_banner.jpg",
    rating: "4.9 ★",
    orders: "14.8k+ Pesanan",
  },
];

const TRUST_FEATURES = [
  {
    icon: "⚡",
    title: "Pengiriman Kilat 1-3 Menit",
    desc: "Sistem otomatis terhubung API langsung 24/7. Diamond dan crystal masuk otomatis tanpa menunggu admin.",
  },
  {
    icon: "🛡️",
    title: "100% Anti-Ban & Pro Booster",
    desc: "Seluruh joki dikerjakan manual oleh Pro Player & Top Global terverifikasi tanpa cheat, script, atau VPN berbahaya.",
  },
  {
    icon: "📸",
    title: "Live Screenshot & Dashboard",
    desc: "Pantau persentase pengerjaan, histori match, dan bukti pengerjaan berupa tangkapan layar langsung di dashboard.",
  },
  {
    icon: "🔒",
    title: "Enkripsi Kredensial 256-Bit",
    desc: "Data login akun pelanggan disimpan dengan enkripsi standar industri dan otomatis terhapus setelah pesanan selesai.",
  },
  {
    icon: "💳",
    title: "Pembayaran Resmi Midtrans",
    desc: "Mendukung QRIS 0% biaya admin, Virtual Account semua bank utama, serta e-wallet GoPay, OVO, DANA, dan ShopeePay.",
  },
  {
    icon: "💬",
    title: "Customer Support 24 Jam",
    desc: "Tim bantuan responsif selalu siaga membantu kendala pesanan melalui live chat internal maupun WhatsApp resmi.",
  },
];

const LIVE_TICKERS = [
  "✦ 12 detik lalu • Kevin Pratama baru saja top-up 706 Diamonds MLBB • Lunas via QRIS",
  "✦ 45 detik lalu • Aisyah N. memesan Combo Weekly Care Genshin Impact • Diproses Booster",
  "✦ 2 menit lalu • Dimas A. baru saja top-up 300 Genesis Crystals • Terkirim otomatis",
  "✦ 3 menit lalu • Rizky F. memesan Joki Mythic Placement (10 Match) • Dikerjakan Pro Booster",
];

export default function Home() {
  const [topups, setTopups] = useState([]);
  const [activeGameTab, setActiveGameTab] = useState("all");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [quickOrderNumber, setQuickOrderNumber] = useState("");
  const [quickSearchLoading, setQuickSearchLoading] = useState(false);
  const [quickSearchResult, setQuickSearchResult] = useState(null);
  const [quickSearchError, setQuickSearchError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    api.products({ type: "topup" })
      .then((data) => setTopups(data))
      .catch(() => {});
  }, []);

  // Cycle the live transaction ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Quick Order Tracking from Hero
  async function handleQuickSearch(e) {
    e.preventDefault();
    if (!quickOrderNumber.trim()) return;
    setQuickSearchLoading(true);
    setQuickSearchError("");
    setQuickSearchResult(null);

    try {
      const order = await api.order(quickOrderNumber.trim());
      setQuickSearchResult(order);
    } catch (_) {
      try {
        const list = await api.orders();
        const found = list.find((o) =>
          o.order_number?.toLowerCase() === quickOrderNumber.trim().toLowerCase() ||
          String(o.id) === quickOrderNumber.trim()
        );
        if (found) setQuickSearchResult(found);
        else setQuickSearchError("Pesanan tidak ditemukan. Cek kembali invoice Anda.");
      } catch (err) {
        setQuickSearchError("Pesanan tidak ditemukan atau silakan masuk ke akun Anda.");
      }
    } finally {
      setQuickSearchLoading(false);
    }
  }

  const filteredTopups = activeGameTab === "all"
    ? topups.slice(0, 8)
    : topups.filter((p) => p.game === activeGameTab).slice(0, 8);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="hero-v2">
        <div className="container">
          <div className="hero-v2-grid">
            {/* Left Column: Value Proposition */}
            <div>
              <div className="hero-badge-wrap">
                <span className="hero-badge-dot" />
                <span>Pusat Top-Up Kilat & Joki Game Terpercaya #1</span>
              </div>

              <h1 className="hero-title">
                Top-Up Game <span className="hero-highlight">1-3 Menit</span> & Jasa Joki Profesional.
              </h1>

              <p className="hero-desc">
                Solusi resmi untuk Mobile Legends, Genshin Impact, dan Honkai: Star Rail.
                Transaksi instan via QRIS & Virtual Account dengan garansi pengerjaan aman 100%.
              </p>

              <div className="hero-actions">
                <Link href="/topup" className="btn btn-primary btn-lg">
                  ⚡ Top-up Sekarang
                </Link>
                <Link href="/joki" className="btn btn-secondary btn-lg">
                  🛡️ Lihat Jasa Joki
                </Link>
              </div>

              <div className="hero-metrics-bar">
                <div className="metric-item">
                  <span className="metric-value">50,000+</span>
                  <span className="metric-label">Pesanan Sukses</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">1-3 Mnt</span>
                  <span className="metric-label">Rata-rata Proses</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">4.9 / 5.0</span>
                  <span className="metric-label">Rating Pelanggan</span>
                </div>
              </div>
            </div>

            {/* Right Column: Instant Order Status Tracker */}
            <div>
              <div className="hero-tracker-card">
                <div className="tracker-card-head">
                  <div className="tracker-badge-icon">🔍</div>
                  <div>
                    <h3 className="tracker-card-title">Cek Status Pesanan</h3>
                    <span className="muted" style={{ fontSize: 12 }}>
                      Pantau proses invoice Anda tanpa login
                    </span>
                  </div>
                </div>

                <form onSubmit={handleQuickSearch}>
                  <div className="field" style={{ marginBottom: 12 }}>
                    <input
                      className="input"
                      placeholder="Masukkan No. Pesanan (cth: VS-20261019-XXXX)..."
                      value={quickOrderNumber}
                      onChange={(e) => setQuickOrderNumber(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    style={{ width: "100%" }}
                    disabled={quickSearchLoading}
                  >
                    {quickSearchLoading ? "Memeriksa…" : "Lacak Pesanan Sekarang →"}
                  </button>
                </form>

                {quickSearchError && (
                  <div className="track-error-card mt">
                    <span style={{ fontSize: 13 }}>⚠️ {quickSearchError}</span>
                  </div>
                )}

                {quickSearchResult && (
                  <div className="track-result-card card mt" style={{ background: "var(--surface-2)" }}>
                    <div className="row between">
                      <div>
                        <span className="pill pill-cyan" style={{ fontSize: 10 }}>
                          {quickSearchResult.type === "joki" ? "JOKI PRO" : "TOP-UP"}
                        </span>
                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>
                          {quickSearchResult.order_number}
                        </div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {rupiah(quickSearchResult.total_amount)}
                        </div>
                      </div>
                      <span
                        className="pill"
                        style={{
                          background: statusColor(quickSearchResult.status) + "22",
                          color: statusColor(quickSearchResult.status),
                          border: `1px solid ${statusColor(quickSearchResult.status)}55`,
                          fontSize: 11
                        }}
                      >
                        {statusLabel(quickSearchResult.status)}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/orders/${quickSearchResult.id}`}
                      className="btn btn-secondary btn-sm mt"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      Buka Rincian Pesanan →
                    </Link>
                  </div>
                )}
              </div>

              {/* Live verified transaction ticker */}
              <div className="live-ticker">
                <span className="ticker-pulse" />
                <div className="ticker-text">
                  {LIVE_TICKERS[tickerIndex]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED GAME HUBS ================= */}
      <section className="container" style={{ marginTop: 20 }}>
        <div className="section-head">
          <div>
            <h2>Pilih <span className="accent">Game Favorit</span></h2>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>
              Katalog resmi voucher game dan layanan joki akun profesional
            </p>
          </div>
        </div>

        <div className="grid grid-3">
          {GAME_CARDS.map((g, i) => (
            <Reveal key={g.slug} delay={i * 80}>
              <div className="game-cover-card">
                <div className="game-cover-media">
                  <Image
                    src={g.image}
                    alt={g.name}
                    width={480}
                    height={270}
                    priority={i === 0}
                  />
                  <div className="game-cover-scrim" />
                  <span className="game-cover-badge">{g.genre}</span>
                </div>

                <div className="game-cover-content">
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <h3 className="game-cover-title">{g.name}</h3>
                    <span className="pill pill-amber" style={{ fontSize: 11 }}>{g.rating}</span>
                  </div>

                  <p className="game-cover-meta">{g.tagline}</p>

                  <div className="game-cover-buttons">
                    <Link href={`/topup?game=${g.slug}`} className="btn btn-primary btn-sm">
                      ⚡ Top-up
                    </Link>
                    <Link href={`/joki/${g.slug}`} className="btn btn-secondary btn-sm">
                      🛡️ Joki Akun
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TOP-UP POPULER ================= */}
      <section className="container" style={{ marginTop: 36 }}>
        <div className="section-head">
          <div>
            <h2>Top-up <span className="accent">Paling Populer</span></h2>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>
              Nominal favorit para gamer dengan harga termurah dan proses 1-3 menit
            </p>
          </div>
          <Link href="/topup" className="btn btn-ghost btn-sm">
            Lihat Semua Produk →
          </Link>
        </div>

        {/* Game Filter Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeGameTab === "all" ? "active" : ""}`}
            onClick={() => setActiveGameTab("all")}
          >
            Semua Game
          </button>
          {Object.entries(GAMES).map(([slug, name]) => (
            <button
              key={slug}
              className={`tab ${activeGameTab === slug ? "active" : ""}`}
              onClick={() => setActiveGameTab(slug)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-4">
          {filteredTopups.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <ProductCard
                product={p}
                onAdd={addItem}
                actionLabel="Beli"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= WHY VERAND STORE (VALUE PROPS) ================= */}
      <section className="container" style={{ marginTop: 56 }}>
        <div className="section-head center" style={{ flexDirection: "column", gap: 6 }}>
          <h2>Standar Kualitas & <span className="accent">Keamanan Verand</span></h2>
          <p className="muted" style={{ fontSize: 15, maxWidth: 620, margin: "0 auto" }}>
            Kami membangun platform e-commerce gaming yang memprioritaskan keamanan akun, transparansi progres, dan kecepatan transaksi.
          </p>
        </div>

        <div className="grid grid-3" style={{ marginTop: 24 }}>
          {TRUST_FEATURES.map((feat, i) => (
            <Reveal key={feat.title} delay={(i % 3) * 70}>
              <div className="card" style={{ height: "100%" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{feat.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{feat.title}</h3>
                <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= AUTHENTIC CUSTOMER REVIEWS ================= */}
      <section className="container" style={{ marginTop: 56 }}>
        <div className="section-head">
          <div>
            <h2>Ulasan <span className="accent">Para Pemain</span></h2>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>
              Apa kata mereka yang telah menggunakan layanan top-up & joki Verand Store
            </p>
          </div>
          <span className="pill pill-green">✓ 100% Ulasan Terverifikasi</span>
        </div>

        <div className="grid grid-4">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-stars">
                {"★".repeat(rev.rating)}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: "0 0 14px", color: "var(--text)" }}>
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="review-author">
                <div className="review-avatar">{rev.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{rev.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    {rev.game} · {rev.rank}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
