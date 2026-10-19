"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";
import { getToken } from "@/services/api";

/**
 * Loads the current user's notifications and exposes unread count + actions.
 */
export function useNotifications(pollMs = 15000) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(() => (typeof window !== "undefined" ? !!getToken() : false));

  const load = useCallback(async () => {
    if (!getToken()) return;
    try {
      setItems(await api.notifications());
    } catch (_) {
      // ignore — likely unauthenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    let ignore = false;
    api.notifications().then((data) => {
      if (!ignore) {
        setItems(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!ignore) setLoading(false);
    });

    const id = setInterval(load, pollMs);
    return () => {
      ignore = true;
      clearInterval(id);
    };
  }, [load, pollMs]);

  const unread = items.filter((n) => !n.read_at).length;

  async function markAllRead() {
    await api.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  }

  return { items, unread, loading, refresh: load, markAllRead };
}
