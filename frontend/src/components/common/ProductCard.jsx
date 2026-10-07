import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({
  product,
  aspectRatio = "aspect-[4/5]",
  showRating = false,
  showQuickAdd = true
}) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors?.[0]?.name || "Standard";
    addToCart(product, defaultColor, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="flex flex-col group relative">
      {/* Product Image Frame */}
      <Link
        to={`/product/${product.id}`}
        className={`relative w-full ${aspectRatio} bg-surface-container mb-stack-sm overflow-hidden rounded-xl block`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-label-caps uppercase tracking-wider z-10 ${
              product.badge === "Sale" || product.badge.startsWith("-")
                ? "bg-error text-on-error"
                : product.badge === "Trending"
                ? "bg-primary text-on-primary"
                : "bg-secondary text-on-secondary"
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-all shadow-sm z-10 active:scale-95"
        >
          <span
            className={`material-symbols-outlined text-[18px] transition-colors ${
              isWishlisted ? "text-error" : "text-on-surface"
            }`}
            style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add Button */}
        {showQuickAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Quick Add to Cart"
            className="absolute bottom-2 right-2 w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface shadow-md hover:bg-primary hover:text-on-primary transition-all active:scale-90 z-10"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col">
        {showRating && product.rating && (
          <div className="flex items-center gap-1 mb-0.5">
            <span
              className="material-symbols-outlined text-[14px] text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        <Link to={`/product/${product.id}`} className="hover:underline">
          <h3 className="font-title-sm text-title-sm text-primary truncate">
            {product.name}
          </h3>
        </Link>

        {product.subtitle && (
          <p className="font-body-sm text-xs text-on-surface-variant mb-1 truncate">
            {product.subtitle}
          </p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-title-sm text-title-sm font-semibold text-primary">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="font-body-sm text-xs text-outline line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
