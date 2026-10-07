import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { toggleWishlist, isInWishlist, addToCart, openProductPage } = useShop();
  const wishlisted = isInWishlist(product.id);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  const activeColorIndex = hoveredColorIndex !== null ? hoveredColorIndex : selectedColorIndex;
  const activeColor = product.colors[activeColorIndex] || product.colors[0];

  // Dynamically alternate image preview based on active swatch index if multiple images exist
  const primaryImage =
    product.images[activeColorIndex % product.images.length] || product.images[0];
  const secondaryImage =
    product.images[(activeColorIndex + 1) % product.images.length] || product.images[0];
  const hasSecondaryImage = product.images.length > 1;

  const handleCardClick = () => {
    openProductPage(product);
  };

  const triggerPopAnimation = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPopAnimation();
    if (product.sizes.length > 1 && !showQuickSizes) {
      setShowQuickSizes(true);
    } else {
      // Default add first size
      const defaultSize = product.sizes[0] || 'M';
      addToCart(product, activeColor, defaultSize, 1);
      triggerAddedFeedback();
    }
  };

  const handleQuickSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    triggerPopAnimation();
    addToCart(product, activeColor, size, 1);
    setShowQuickSizes(false);
    triggerAddedFeedback();
  };

  const triggerAddedFeedback = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col cursor-pointer p-2.5 -m-2.5 rounded-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(23,22,21,0.08)] hover:bg-white"
    >
      {/* Editorial Image Container with Soft Hairline Border */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFE9] rounded-xs border border-[#EAE3D8]/60 transition-shadow duration-300">
        {/* Primary Image */}
        <div
          className={`w-full h-full transition-opacity duration-700 ${
            hasSecondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        >
          <ImageWithFallback
            src={primaryImage}
            alt={`${product.name} - ${activeColor.name}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
          />
        </div>

        {/* Secondary Editorial Angle on Hover (if available) */}
        {hasSecondaryImage && (
          <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <ImageWithFallback
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className="w-full h-full object-cover scale-102"
            />
          </div>
        )}

        {/* Top-Right: Minimalist Floating Wishlist Heart */}
        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-[#171615] transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 shadow-2xs border border-white/60"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              wishlisted ? 'fill-[#8A5A44] text-[#8A5A44]' : 'text-[#36322E]'
            }`}
          />
        </button>

        {/* Top-Left: Subtle Luxury Discount Stamp */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#171615] text-[#FAF8F5] text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase z-10 shadow-2xs">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Bottom-Right: Persistent, Sleek Overlay 'Add to Bag' Icon */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {/* Quick View Icon (subtle companion on hover) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
              else openProductPage(product);
            }}
            aria-label="Quick View"
            title="Quick View"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/85 backdrop-blur-md text-[#171615] shadow-xs border border-white/70 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Persistent Sleek 'Add to Bag' Button Icon with Haptic Pop Feedback */}
          <button
            type="button"
            onClick={handleQuickAddClick}
            aria-label={`Add ${product.name} to Bag`}
            title="Add to Bag"
            className={`relative flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 shadow-sm border active:scale-90 ${
              isPopping ? 'animate-haptic-pop' : ''
            } ${
              justAdded
                ? 'bg-[#2C6228] text-white border-[#2C6228] scale-105'
                : 'bg-white/95 text-[#171615] border-white/80 hover:bg-[#171615] hover:text-[#FAF8F5] hover:border-[#171615] hover:scale-105'
            }`}
          >
            {/* Visual Haptic Expansion Ring */}
            {isPopping && (
              <span className="absolute inset-0 rounded-full border-2 border-[#2C6228] animate-haptic-ring pointer-events-none" />
            )}

            {justAdded ? (
              <Check className={`w-4 h-4 text-white stroke-[2.5] ${isPopping ? 'scale-115' : ''} transition-transform`} />
            ) : (
              <ShoppingBag className={`w-4 h-4 stroke-[1.6] ${isPopping ? 'scale-115' : ''} transition-transform`} />
            )}
          </button>
        </div>

        {/* Feedback Banner upon addition */}
        {justAdded && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 bg-[#171615]/95 text-white py-2 px-3 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-sm z-20 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-[#A3D9A5] stroke-[2]" />
            <span className="font-light tracking-wider">Added to Bag</span>
          </div>
        )}

        {/* Sleek Quick Sizes Flyout (Triggered on bag click if multiple sizes) */}
        {showQuickSizes && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 bottom-2 bg-white/98 backdrop-blur-md p-3 shadow-lg border border-[#EAE3D8] z-20 animate-in fade-in slide-in-from-bottom-2 rounded-xs"
          >
            <div className="flex items-center justify-between mb-2 text-[10px] text-[#7A746B] uppercase tracking-luxury font-semibold">
              <span>Choose Size ({activeColor.name})</span>
              <button
                type="button"
                onClick={() => setShowQuickSizes(false)}
                className="text-[#171615] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => handleQuickSizeSelect(e, sz)}
                  className="min-w-[32px] px-2 py-1 text-[11px] font-semibold border border-[#D5CCC0] bg-[#FAF8F5] hover:bg-[#171615] hover:text-white hover:border-[#171615] transition-colors font-mono"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Information with Fine Luxury Typography */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Subtle Category Kicker & Rating */}
        <div className="flex items-center justify-between text-xs text-[#827B72] mb-1">
          <span className="text-[10px] uppercase tracking-luxury font-medium text-[#8F887D]">
            {product.category} · {product.subcategory}
          </span>
          <div className="flex items-center gap-1 font-medium text-[#171615]">
            <Star className="w-3 h-3 fill-[#C9A354] text-[#C9A354]" />
            <span className="text-[11px] tabular-nums font-mono">{product.rating}</span>
          </div>
        </div>

        {/* Product Title in Refined Serif */}
        <h3 className="font-serif text-[15px] sm:text-base font-medium text-[#171615] leading-snug line-clamp-1 group-hover:text-[#8A5A44] transition-colors">
          {product.name}
        </h3>

        {/* Pricing in Tabular Numbers */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-[#171615] tabular-nums font-mono">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#9E978C] line-through tabular-nums font-mono">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Interactive Circular Color Swatches with Active Shade Label */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2.5 pt-1.5 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap" role="radiogroup" aria-label="Available colors">
              {product.colors.map((c, idx) => {
                const isSelected = selectedColorIndex === idx;
                const isHovered = hoveredColorIndex === idx;
                const isActive = activeColorIndex === idx;
                return (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${c.name} color`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(idx);
                    }}
                    onMouseEnter={() => setHoveredColorIndex(idx)}
                    onMouseLeave={() => setHoveredColorIndex(null)}
                    className={`group/swatch relative p-0.5 rounded-full transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'ring-1.5 ring-[#171615] ring-offset-1 scale-110'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    title={`${c.name}${isSelected ? ' (Selected)' : ''}`}
                  >
                    <span
                      className="block w-4 h-4 rounded-full border border-black/15 shadow-2xs transition-transform"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Shade Name */}
            <div className="text-[11px] text-[#787168] truncate max-w-[130px] text-right font-light tracking-wide flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8A196] inline-block" />
              <span className="truncate">{activeColor.name}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
