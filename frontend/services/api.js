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

export const api = {
  // Auth
  register: (data) => request("/auth/register", { method: "POST", body: data, auth: false }),
  login: (data) => request("/auth/login", { method: "POST", body: data, auth: false }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),

  // Products
  products: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ""}`, { auth: false });
  },
  product: (slug) => request(`/products/${slug}`, { auth: false }),

  // Topup
  validateUid: (data) => request("/topup/validate-uid", { method: "POST", body: data, auth: false }),

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
  aiChat: (message) => request("/ai/chat", { method: "POST", body: { message }, auth: false }),
  recommendations: () => request("/ai/recommendations"),
  priceQuote: (data) => request("/ai/price-quote", { method: "POST", body: data }),

  // Admin
  adminDashboard: () => request("/admin/dashboard"),
  adminOrders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/orders${q ? `?${q}` : ""}`);
  },
  adminUsers: () => request("/admin/users"),
};
