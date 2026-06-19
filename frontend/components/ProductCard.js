"use client";

import { rupiah, GAMES } from "@/utils/format";

export default function ProductCard({ product, onAdd, actionLabel = "Tambah" }) {
  return (
    <div className="card product-card">
      <span className="game-tag">{GAMES[product.game] || product.game}</span>
      <div className="name">{product.name}</div>
      {product.unit && <div className="meta">{product.unit}</div>}
      <div className="price">{rupiah(product.price)}</div>
      {onAdd && (
        <button className="btn btn-primary btn-sm" onClick={() => onAdd(product)}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
