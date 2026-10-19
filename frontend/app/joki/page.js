"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { GAMES } from "@/utils/format";

const JOKI_GAMES = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    image: "/images/mlbb_banner.jpg",
    genre: "MOBA 5v5",
    services: [
      "Rank Boost (Warrior s/d Mythic Immortal)",
      "Classic Winrate Boost (Hero WR 70%+)",
      "Mythic Placement (Garansi 10 Match)",
      "MMR Hero Power & Leaderboard Boost",
      "Penyelesaian Event Musiman & Quest"
    ],
    boosterCount: "8 Pro Booster Online",
    rating: "4.95 ★",
    startingPrice: "Rp 12.000"
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    image: "/images/genshin_banner.jpg",
    genre: "OPEN WORLD RPG",
    services: [
      "Perawatan Akun Harian & Mingguan",
      "Weekly Boss Clear (3x / minggu)",
      "Joki Story (Archon Quest & World Quest)",
      "Eksplorasi Region 100% & Oculus Finder",
      "Spiral Abyss Floor 12 (36 Star Guarantee)"
    ],
    boosterCount: "6 Account Specialist Online",
    rating: "4.98 ★",
    startingPrice: "Rp 10.000"
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    image: "/images/hsr_banner.jpg",
    genre: "SPACE FANTASY RPG",
    services: [
      "Daily Training & Power Management",
      "Weekly Boss (Echo of War) Clear",
      "Trailblaze Mission / Story Chapter",
      "Eksplorasi Area 100% & Treasure Hunt",
      "Simulated Universe & Memory of Chaos"
    ],
    boosterCount: "5 Astral Specialists Online",
    rating: "4.96 ★",
    startingPrice: "Rp 10.000"
  }
];

export default function JokiIndex() {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <Reveal>
        <div className="center" style={{ maxWidth: 740, margin: "0 auto 36px" }}>
          <span className="pill pill-cyan" style={{ marginBottom: 12 }}>PRO BOOSTER SERVICES</span>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", margin: "8px 0 16px" }}>
            Jasa Joki Akun Game <span style={{ color: "var(--primary-light)" }}>Profesional & Terpercaya</span>
          </h1>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Dikerjakan secara manual oleh Pro Player & Top Global terverifikasi.
            Tanpa script, tanpa cheat, dan dilengkapi pantauan progres real-time serta enkripsi kredensial.
          </p>
        </div>
      </Reveal>

      {/* Safety & Quality Pledge */}
      <div className="grid grid-4" style={{ marginBottom: 44 }}>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>🛡️</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>100% Pure Handplay</div>
          <div className="muted" style={{ fontSize: 12 }}>Manual pengerjaan tanpa bot, script macro, atau hack yang membahayakan akun.</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Kredensial Aman 256-Bit</div>
          <div className="muted" style={{ fontSize: 12 }}>Password dienkripsi end-to-end dan otomatis terhapus setelah pengerjaan selesai.</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>📸</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Live Bukti Screenshot</div>
          <div className="muted" style={{ fontSize: 12 }}>Booster wajib mengirimkan bukti match / screenshot progres harian di dashboard.</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>💰</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Garansi Uang Kembali</div>
          <div className="muted" style={{ fontSize: 12 }}>Jika target rank atau progres tidak tercapai tepat waktu sesuai estimasi.</div>
        </div>
      </div>

      {/* Game Selection Cards */}
      <div className="grid grid-3">
        {JOKI_GAMES.map((g, i) => (
          <Reveal key={g.slug} delay={i * 90}>
            <div className="game-cover-card" style={{ height: "100%" }}>
              <div className="game-cover-media">
                <Image
                  src={g.image}
                  alt={g.name}
                  width={480}
                  height={270}
                />
                <div className="game-cover-scrim" />
                <span className="game-cover-badge">{g.genre}</span>
              </div>

              <div className="game-cover-content">
                <div className="row between" style={{ marginBottom: 6 }}>
                  <h3 className="game-cover-title">{g.name}</h3>
                  <span className="pill pill-amber" style={{ fontSize: 11 }}>{g.rating}</span>
                </div>

                <div className="row" style={{ gap: 6, marginBottom: 16 }}>
                  <span className="status-dot-green" />
                  <span className="muted" style={{ fontSize: 12 }}>{g.boosterCount}</span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Layanan Tersedia:
                </div>
                <ul className="combo-list" style={{ marginBottom: 20, flex: 1 }}>
                  {g.services.map((s, idx) => (
                    <li key={idx} style={{ fontSize: 12 }}>{s}</li>
                  ))}
                </ul>

                <div className="row between" style={{ paddingTop: 14, borderTop: "1px solid var(--border)", marginTop: "auto" }}>
                  <div>
                    <span className="muted" style={{ fontSize: 11, display: "block" }}>Mulai dari</span>
                    <strong style={{ fontSize: 16, color: "var(--primary-light)", fontFamily: "var(--font-display-stack)" }}>
                      {g.startingPrice}
                    </strong>
                  </div>

                  <Link href={`/joki/${g.slug}`} className="btn btn-primary btn-sm">
                    Pilih Layanan →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
