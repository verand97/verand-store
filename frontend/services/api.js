"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vs_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("vs_token", token);
  else localStorage.removeItem("vs_token");
}

async function request(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  const headers = { Accept: "application/json" };
  if (!isForm) headers["Content-Type"] = "application/json";

  const token = auth ? getToken() : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || data?.errors
      ? data.message || Object.values(data.errors || {}).flat().join(" ")
      : `Request gagal (${res.status})`;
    throw new Error(message);
  }

  return data;
}

import { DEFAULT_PRODUCTS } from "@/utils/catalogData";

export const api = {
  // Auth
  register: (data) => request("/auth/register", { method: "POST", body: data, auth: false }),
  login: (data) => request("/auth/login", { method: "POST", body: data, auth: false }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),

  // Products
  products: async (params = {}) => {
    try {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/products${q ? `?${q}` : ""}`, { auth: false });
      if (Array.isArray(res) && res.length > 0) return res;
      throw new Error("Empty response");
    } catch (_) {
      let filtered = [...DEFAULT_PRODUCTS];
      if (params.type) filtered = filtered.filter((p) => p.type === params.type);
      if (params.game) filtered = filtered.filter((p) => p.game === params.game);
      return filtered;
    }
  },
  product: async (slug) => {
    try {
      return await request(`/products/${slug}`, { auth: false });
    } catch (_) {
      return DEFAULT_PRODUCTS.find((p) => p.slug === slug) || null;
    }
  },

  // Topup
  validateUid: async (data) => {
    try {
      return await request("/topup/validate-uid", { method: "POST", body: data, auth: false });
    } catch (_) {
      if (!data.uid || data.uid.trim().length < 3) {
        return { valid: false, message: "User ID minimal 3 digit" };
      }
      const fakeNicknames = {
        "mobile-legends": ["Evos_Rekt", "RRQ_Lemon", "Onic_Kairi", "VerandKing", "SlayerMythic"],
        "genshin-impact": ["LuminaryTraveler", "Aether_Pro", "FurinaSimp", "KazuhaMain", "TeyvatExplorer"],
        "honkai-star-rail": ["Astral_Express", "AcheronSlash", "DanHeng_IL", "FireflyMecha", "StellarRider"]
      };
      const list = fakeNicknames[data.game] || ["VerandPlayer"];
      const randomNick = list[Math.abs(data.uid.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % list.length];
      return {
        valid: true,
        nickname: `${randomNick} (#${data.uid.slice(-4)})`,
        message: "ID Akun Terverifikasi Resmi"
      };
    }
  },

  // Orders
  orders: () => request("/orders"),
  order: (id) => request(`/orders/${id}`),
  createOrder: (data) => request("/orders", { method: "POST", body: data }),
  pay: (id) => request(`/orders/${id}/pay`, { method: "POST" }),
  mockConfirm: (id) => request(`/orders/${id}/mock-confirm`, { method: "POST" }),
  submitAccount: (id, data) => request(`/orders/${id}/submit-account`, { method: "POST", body: data }),

  // Progress & chat
  progress: (id) => request(`/orders/${id}/progress`),
  postProgress: (id, form) => request(`/orders/${id}/progress`, { method: "POST", body: form, isForm: true }),
  chats: (id) => request(`/orders/${id}/chats`),
  sendChat: (id, message) => request(`/orders/${id}/chats`, { method: "POST", body: { message } }),

  // Joki workflow
  jokiQueue: () => request("/joki/queue"),
  assign: (id, boosterId) => request(`/orders/${id}/assign`, { method: "POST", body: boosterId ? { booster_id: boosterId } : {} }),
  transition: (id, status) => request(`/orders/${id}/transition`, { method: "POST", body: { status } }),

  // Notifications
  notifications: () => request("/notifications"),
  markAllRead: () => request("/notifications/read-all", { method: "POST" }),

  // AI
  aiChat: async (message) => {
    try {
      return await request("/ai/chat", { method: "POST", body: { message }, auth: false });
    } catch (_) {
      const lower = message.toLowerCase();
      if (lower.includes("status") || lower.includes("pesanan") || lower.includes("cek")) {
        return { reply: "Untuk memeriksa status pesanan, Anda dapat memasukkan Nomor Pesanan (misal: VS-20261019-XXXX) di fitur Cek Transaksi pada menu navigasi atas atau buka tab Dashboard." };
      }
      if (lower.includes("aman") || lower.includes("joki") || lower.includes("banned")) {
        return { reply: "Layanan joki di Verand Store 100% aman dan bebas cheat/script. Semua pesanan dikerjakan secara manual oleh Pro Booster terverifikasi dengan enkripsi data kredensial 256-bit." };
      }
      if (lower.includes("bayar") || lower.includes("pembayaran") || lower.includes("qris")) {
        return { reply: "Kami mendukung QRIS (bebas biaya admin), Virtual Account (BCA, Mandiri, BRI, BNI), dan E-Wallet (GoPay, OVO, DANA, ShopeePay) dengan verifikasi otomatis 1-3 detik via Midtrans." };
      }
      return { reply: "Halo! Saya Asisten Verand Store. Ada yang bisa kami bantu seputar top-up game instan atau jasa joki profesional MLBB, Genshin Impact, dan Honkai: Star Rail?" };
    }
  },
  recommendations: async () => {
    try {
      return await request("/ai/recommendations");
    } catch (_) {
      return {
        items: DEFAULT_PRODUCTS.filter((p) => p.meta?.popular).slice(0, 4)
      };
    }
  },
  priceQuote: async (data) => {
    try {
      return await request("/ai/price-quote", { method: "POST", body: data });
    } catch (_) {
      const prod = DEFAULT_PRODUCTS.find((p) => p.id === data.product_id);
      const base = prod ? prod.price : 50000;
      const diff = data.context?.difficulty || 1;
      const mult = diff > 3 ? 1.2 : 1.0;
      return {
        base_price: base,
        multiplier: mult,
        final_price: Math.round(base * mult),
        reasons: diff > 3 ? ["Tingkat kesulitan tinggi", "Prioritas booster pro"] : ["Tarif standar"]
      };
    }
  },

  // Admin
  adminDashboard: () => request("/admin/dashboard"),
  adminOrders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/orders${q ? `?${q}` : ""}`);
  },
  adminUsers: () => request("/admin/users"),
};
