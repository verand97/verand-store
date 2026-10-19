"use client";

import { statusColor } from "@/utils/format";

const JOKI_STEPS = [
  { key: "pending", label: "Menunggu Bayar", desc: "Invoice dibuat" },
  { key: "waiting_for_account", label: "Menunggu Akun", desc: "Kirim data akun" },
  { key: "processing", label: "Dikerjakan", desc: "Pro booster aktif" },
  { key: "completed", label: "Selesai", desc: "Hasil tercapai" },
  { key: "finished", label: "Tuntas", desc: "Verifikasi tuntas" },
];

const TOPUP_STEPS = [
  { key: "pending", label: "Menunggu Bayar", desc: "Invoice dibuat" },
  { key: "processing", label: "Diproses Otomatis", desc: "Mengirim diamond" },
  { key: "finished", label: "Terkirim", desc: "Masuk ke akun" },
];

export default function OrderTracker({ status, type }) {
  if (status === "cancelled") {
    return (
      <div className="pill" style={{ background: "var(--danger-soft)", color: "var(--danger)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "8px 16px" }}>
        ✕ Pesanan Dibatalkan
      </div>
    );
  }

  const steps = type === "joki" ? JOKI_STEPS : TOPUP_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="order-stepper-wrap" style={{ width: "100%", padding: "10px 0" }}>
      <div className="order-stepper">
        {steps.map((step, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={step.key} style={{ display: "contents" }}>
              <div className={`step-node ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                <div className="step-circle">
                  {isDone ? "✓" : i + 1}
                </div>
                <span className="step-node-label">{step.label}</span>
                <span className="muted" style={{ fontSize: 10, marginTop: 2 }}>{step.desc}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-connector ${i < activeIndex ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
