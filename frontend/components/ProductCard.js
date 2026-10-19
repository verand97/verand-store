"use client";

import { rupiah, GAMES } from "@/utils/format";

export default function ProductCard({ product, onAdd, actionLabel = "Pilih", isSelected = false, onSelect = null }) {
  const isMlbb = product.game === "mobile-legends";
  const isGenshin = product.game === "genshin-impact";
  const isHsr = product.game === "honkai-star-rail";

  // Visual badge based on game currency
  const getCurrencyIcon = () => {
    if (product.type === "joki") {
      return (
        <span className="product-icon-badge joki-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
      );
    }
    if (isMlbb) {
      return (
        <span className="product-icon-badge mlbb-diamond">
          💎
        </span>
      );
    }
    if (isGenshin) {
      return (
        <span className="product-icon-badge genshin-crystal">
          ✦
        </span>
      );
    }
    if (isHsr) {
      return (
        <span className="product-icon-badge hsr-shard">
          💠
        </span>
      );
    }
    return <span className="product-icon-badge">🪙</span>;
  };

  const handleClick = () => {
    if (onSelect) onSelect(product);
    else if (onAdd) onAdd(product);
  };

  return (
    <div
      className={`card product-card-v2 ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="product-card-top row between">
        <span className="game-micro-tag">
          {GAMES[product.game] || product.game}
        </span>
        {product.meta?.bonus && (
          <span className="bonus-tag">{product.meta.bonus}</span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-icon-container">
          {getCurrencyIcon()}
        </div>
        <div className="product-name">{product.name}</div>
        {product.unit && product.unit !== "currency" && (
          <div className="product-unit muted">{product.unit}</div>
        )}
      </div>

      <div className="product-card-footer row between">
        <div className="product-price-block">
          <span className="price-label muted">Harga</span>
          <div className="price-value">{rupiah(product.price)}</div>
        </div>

        {onAdd && (
          <button
            type="button"
            className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
          >
            {isSelected ? "Dipilih ✓" : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
