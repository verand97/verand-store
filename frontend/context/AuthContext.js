"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, getToken } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getToken()) {
      api.me().then(setUser).catch(() => setToken(null)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(credentials) {
    const res = await api.login(credentials);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(data) {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }

  async function logout() {
    try {
      await api.logout();
    } catch (_) {}
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
