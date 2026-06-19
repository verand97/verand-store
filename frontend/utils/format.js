export function rupiah(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

export function statusLabel(status) {
  const map = {
    pending: "Menunggu Pembayaran",
    waiting_for_account: "Menunggu Akun",
    processing: "Sedang Dikerjakan",
    completed: "Selesai Dikerjakan",
    finished: "Tuntas",
    cancelled: "Dibatalkan",
    unpaid: "Belum Dibayar",
    paid: "Lunas",
    failed: "Gagal",
    refunded: "Dikembalikan",
  };
  return map[status] || status;
}

export function statusColor(status) {
  const map = {
    pending: "#f59e0b",
    waiting_for_account: "#3b82f6",
    processing: "#8b5cf6",
    completed: "#10b981",
    finished: "#22c55e",
    cancelled: "#ef4444",
    paid: "#22c55e",
    unpaid: "#f59e0b",
    failed: "#ef4444",
  };
  return map[status] || "#94a3b8";
}

export const GAMES = {
  "mobile-legends": "Mobile Legends",
  "genshin-impact": "Genshin Impact",
  "honkai-star-rail": "Honkai: Star Rail",
};

/**
 * Per-game order-detail form schema for joki services.
 * MLBB is rank-based (from → to). Genshin/HSR are account-maintenance based
 * (server, account level, target region/area, exploration %, characters).
 */
export const JOKI_FORM_SCHEMA = {
  "mobile-legends": {
    accent: "Mobile Legends",
    fields: [
      { key: "current_rank", label: "Rank Saat Ini", placeholder: "cth: Epic III", type: "text" },
      { key: "target_rank", label: "Target Rank", placeholder: "cth: Mythic", type: "text" },
      { key: "main_hero", label: "Hero Andalan", placeholder: "cth: Ling, Fanny", type: "text" },
      { key: "lane", label: "Lane / Role", placeholder: "cth: Jungler, Mid", type: "text" },
      { key: "note", label: "Catatan Tambahan", placeholder: "Permintaan khusus", type: "textarea" },
    ],
  },
  "genshin-impact": {
    accent: "Genshin Impact",
    fields: [
      { key: "server", label: "Server", placeholder: "Pilih server", type: "select",
        options: ["Asia", "America", "Europe", "TW/HK/MO"] },
      { key: "ar_level", label: "Adventure Rank (AR)", placeholder: "cth: AR 55", type: "text" },
      { key: "target_region", label: "Region / Target", placeholder: "cth: Natlan 100% / Archon Quest 5", type: "text" },
      { key: "main_characters", label: "Karakter Utama", placeholder: "cth: Furina, Neuvillette", type: "text" },
      { key: "resin_pref", label: "Preferensi Resin", placeholder: "Pilih", type: "select",
        options: ["Pakai Fragile Resin", "Hanya Original Resin", "Jangan pakai Resin"] },
      { key: "note", label: "Catatan (do & don't)", placeholder: "cth: jangan pull banner, fokus farming Mora", type: "textarea" },
    ],
  },
  "honkai-star-rail": {
    accent: "Honkai: Star Rail",
    fields: [
      { key: "server", label: "Server", placeholder: "Pilih server", type: "select",
        options: ["Asia", "America", "Europe", "TW/HK/MO"] },
      { key: "tb_level", label: "Trailblaze Level (TB)", placeholder: "cth: TB 65", type: "text" },
      { key: "equilibrium", label: "Equilibrium Level", placeholder: "cth: EL 6", type: "text" },
      { key: "target_area", label: "Area / Target", placeholder: "cth: Penacony 100% / Trailblaze Mission 3", type: "text" },
      { key: "main_characters", label: "Karakter Utama", placeholder: "cth: Acheron, Firefly", type: "text" },
      { key: "tp_pref", label: "Preferensi Trailblaze Power", placeholder: "Pilih", type: "select",
        options: ["Pakai Fuel/Reserved TP", "Hanya TP biasa", "Jangan habiskan TP"] },
      { key: "note", label: "Catatan (do & don't)", placeholder: "cth: jangan warp, simpan Stellar Jade", type: "textarea" },
    ],
  },
};

/**
 * Human-friendly labels for the flexible joki detail keys (used in
 * order-detail views for customer/booster/admin).
 */
export const JOKI_DETAIL_LABELS = {
  current_rank: "Rank Saat Ini",
  target_rank: "Target Rank",
  main_hero: "Hero Andalan",
  lane: "Lane / Role",
  server: "Server",
  ar_level: "Adventure Rank",
  tb_level: "Trailblaze Level",
  equilibrium: "Equilibrium Level",
  target_region: "Region / Target",
  target_area: "Area / Target",
  main_characters: "Karakter Utama",
  resin_pref: "Preferensi Resin",
  tp_pref: "Preferensi TP",
  note: "Catatan",
};

export function jokiDetailEntries(targets) {
  if (!targets || typeof targets !== "object") return [];
  return Object.entries(targets)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]) => [JOKI_DETAIL_LABELS[k] || k, v]);
}
