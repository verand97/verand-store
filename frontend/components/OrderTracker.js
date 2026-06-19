"use client";

import { statusColor } from "@/utils/format";

const STEPS = [
  { key: "pending", label: "Dibuat" },
  { key: "waiting_for_account", label: "Menunggu Akun" },
  { key: "processing", label: "Dikerjakan" },
  { key: "completed", label: "Selesai" },
  { key: "finished", label: "Tuntas" },
];

const TOPUP_STEPS = [
  { key: "pending", label: "Dibuat" },
  { key: "processing", label: "Diproses" },
  { key: "finished", label: "Terkirim" },
];

export default function OrderTracker({ status, type }) {
  if (status === "cancelled") {
    return <div className="pill" style={{ background: "#ef444422", color: "#ef4444" }}>Pesanan Dibatalkan</div>;
  }

  const steps = type === "joki" ? STEPS : TOPUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="row wrap" style={{ gap: 0 }}>
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.key} className="row" style={{ flex: 1, minWidth: 80 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", margin: "0 auto 6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? statusColor(status) : "var(--bg-2)",
                border: "2px solid " + (done ? statusColor(status) : "var(--border)"),
                color: "#fff", fontSize: 13, fontWeight: 700,
              }}>{done ? "✓" : i + 1}</div>
              <div className="muted" style={{ fontSize: 11 }}>{step.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ height: 2, flex: 1, background: i < currentIndex ? statusColor(status) : "var(--border)", marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
