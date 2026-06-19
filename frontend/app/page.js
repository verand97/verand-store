"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { useCart } from "@/context/CartContext";
import { GAMES } from "@/utils/format";

const FEATURES = [
  ["⚙️", "Proses Otomatis", "Pembayaran terverifikasi via Midtrans, pesanan langsung masuk antrean."],
  ["📊", "Pantau Progres", "Dashboard real-time dengan persentase, aktivitas, dan screenshot."],
  ["🔒", "Chat Internal Aman", "Kredensial akun hanya dibagikan lewat chat internal terenkripsi."],
  ["🤖", "Asisten AI", "Chatbot menjawab status pesanan, estimasi, dan komplain otomatis."],
  ["💡", "Rekomendasi Pintar", "Saran layanan dipersonalisasi dari riwayat transaksi Anda."],
  ["💰", "Harga Dinamis", "Harga joki menyesuaikan kesulitan, progres, dan permintaan."],
];

export default function Home() {
  const [topups, setTopups] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    api.products({ type: "topup" }).then((d) => setTopups(d.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <span className="badge"><span className="dot" /> Cepat · Aman · Terpercaya</span>
          <h1>
            Naik Level Tanpa <span className="grad">Drama.</span><br />
            Top-up & Joki Pro.
          </h1>
          <p>
            Layanan top-up instan dan jasa joki untuk Mobile Legends, Genshin Impact,
            dan Honkai: Star Rail. Pantau progres real-time lewat dashboard interaktif.
          </p>
          <div className="row mt wrap">
            <Link href="/topup" className="btn btn-primary">Top-up Sekarang →</Link>
            <Link href="/joki" className="btn btn-ghost">Lihat Jasa Joki</Link>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            <span>
              Mobile Legends <b>◆</b> Genshin Impact <b>◆</b> Honkai: Star Rail <b>◆</b>
              Rank Boost <b>◆</b> Weekly Boss <b>◆</b> Eksplorasi <b>◆</b> Daily Quest <b>◆</b>
            </span>
            <span>
              Mobile Legends <b>◆</b> Genshin Impact <b>◆</b> Honkai: Star Rail <b>◆</b>
              Rank Boost <b>◆</b> Weekly Boss <b>◆</b> Eksplorasi <b>◆</b> Daily Quest <b>◆</b>
            </span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-head">
          <h2>Pilih <span className="accent">Game</span></h2>
        </div>
        <div className="grid grid-3">
          {Object.entries(GAMES).map(([slug, name], i) => (
            <Reveal key={slug} delay={i * 80}>
              <Link href={`/joki/${slug}`} className="card game-tile" style={{ display: "block" }}>
                <div className="glow" />
                <span className="game-tag" style={{ color: "var(--lime)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>GAME</span>
                <div style={{ fontSize: 24, fontWeight: 800, margin: "10px 0", fontFamily: "var(--font-display-stack)" }}>{name}</div>
                <p className="muted">Top-up & jasa joki tersedia.</p>
                <span className="btn btn-sm btn-ghost" style={{ marginTop: 6 }}>Lihat layanan →</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="section-head">
          <h2>Top-up <span className="accent">Populer</span></h2>
          <Link href="/topup" className="muted">Lihat semua →</Link>
        </div>
        <div className="grid grid-4">
          {topups.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} onAdd={addItem} />
            </Reveal>
          ))}
        </div>

        <div className="section-head">
          <h2>Kenapa <span className="accent">Verand Store?</span></h2>
        </div>
        <div className="grid grid-3 mb">
          {FEATURES.map(([icon, title, desc], i) => (
            <Reveal key={title} delay={(i % 3) * 80}>
              <div className="card" style={{ height: "100%" }}>
                <div className="feat-icon">{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <p className="muted" style={{ margin: 0 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
