"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import { GAMES } from "@/utils/format";

const DESCRIPTIONS = {
  "mobile-legends": "Rank Boost, Classic Winrate, Mythic Placement, MMR Hero, push Honor/Glory/Immortal, dan event musiman.",
  "genshin-impact": "Perawatan akun harian, Weekly Boss, Joki Story (Archon/Story Quest), dan eksplorasi lengkap.",
  "honkai-star-rail": "Daily Training, Trailblaze Power, Weekly Boss, Trailblaze Mission, dan eksplorasi & treasure.",
};

export default function JokiIndex() {
  return (
    <div className="container" style={{ paddingTop: 44 }}>
      <Reveal>
        <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>Jasa Joki <span style={{ color: "var(--lime)" }}>Profesional</span></h1>
        <p className="muted">Pilih game untuk melihat paket layanan joki. Pantau progres lewat dashboard.</p>
      </Reveal>

      <div className="grid grid-3 mt">
        {Object.entries(GAMES).map(([slug, name], i) => (
          <Reveal key={slug} delay={i * 90}>
            <Link href={`/joki/${slug}`} className="card game-tile" style={{ display: "block", height: "100%" }}>
              <div className="glow" />
              <span className="game-tag" style={{ color: "var(--lime)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>JASA JOKI</span>
              <div style={{ fontSize: 24, fontWeight: 800, margin: "10px 0", fontFamily: "var(--font-display-stack)" }}>{name}</div>
              <p className="muted">{DESCRIPTIONS[slug]}</p>
              <span className="btn btn-sm btn-primary" style={{ marginTop: 6 }}>Pilih Layanan →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
