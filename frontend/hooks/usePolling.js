"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Polls an async fetcher at a fixed interval. Used for near-real-time order
 * progress and chat updates without a websocket.
 *
 * @param {() => Promise<any>} fetcher
 * @param {number} intervalMs
 */
export function usePolling(fetcher, intervalMs = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const savedFetcher = useRef(fetcher);
  savedFetcher.current = fetcher;

  const refresh = useCallback(async () => {
    try {
      const result = await savedFetcher.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return { data, error, loading, refresh };
}
