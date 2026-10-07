import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Ruler,
  Check,
  Share2,
} from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsCheckoutOpen, products } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#222222' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>('description');
  const [copiedShare, setCopiedShare] = useState(false);

  const wishlisted = isInWishlist(product.id);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? '' : name);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Sticky Close & Top Bar */}
        <div className="px-5 py-4 bg-white border-b border-[#EAE3D8] flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-[#7A746B]">
            <span className="uppercase tracking-luxury font-semibold text-[#8A5A44]">
              {product.category}
            </span>
            <span className="text-[#C4BCB0]">/</span>
            <span className="tracking-wider uppercase text-[11px]">{product.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-[#5F5850] hover:text-[#171615] transition-colors relative"
              title="Share style link"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
              {copiedShare && (
                <span className="absolute -bottom-6 right-0 bg-[#171615] text-white text-[9px] px-2 py-0.5 whitespace-nowrap shadow-xs uppercase tracking-wider">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#5F5850] hover:text-[#171615] transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 lg:p-10 pb-24 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Product Media Gallery */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0 scrollbar-none">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-22 overflow-hidden rounded-xs border transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#171615] opacity-100 ring-1 ring-[#171615]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display */}
              <div className="relative aspect-[3/4] flex-1 bg-[#F2EDE4] rounded-xs overflow-hidden shadow-2xs border border-[#EAE3D8]">
                <ImageWithFallback
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.discountPercentage && (
                  <span className="absolute top-3.5 left-3.5 bg-[#171615] text-[#FAF8F5] text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-[#C9A354]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-semibold text-[#171615] tabular-nums font-mono">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-[#9E978C]">·</span>
                  <span className="text-xs text-[#7A746B] underline cursor-pointer font-light">
                    {product.reviewCount} verified Indian reviews
                  </span>
                </div>

                {/* Title in Luxury Display Serif */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-light text-[#171615] leading-[1.12] mb-3">
                  {product.name}
                </h1>

                {/* Pricing in ₹ */}
                <div className="flex items-baseline gap-3 mb-6 pb-5 border-b border-[#EAE3D8]">
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#171615] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-[#948D82] line-through tabular-nums font-mono">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-[#2C6228] bg-[#EBF3EA] px-2 py-0.5">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Color Selector */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-[#171615] uppercase tracking-luxury text-[10px]">
                      Shade:
                    </span>
                    <span className="text-[#69635A] font-medium text-xs">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor.name === c.name
                            ? 'border-[#171615] scale-110 shadow-xs'
                            : 'border-transparent hover:border-black/30'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector with Size Guide Trigger */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2.5">
                    <span className="font-semibold text-[#171615] uppercase tracking-luxury text-[10px]">
                      Select Size:
                    </span>
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center gap-1 text-[#8A5A44] font-medium hover:underline text-xs"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] h-11 px-3.5 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-all ${
                          selectedSize === sz
                            ? 'bg-[#171615] text-[#FAF8F5] shadow-xs'
                            : 'bg-white border border-[#DDD5C8] text-[#2E2B27] hover:border-[#171615]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#DDD5C8] bg-white h-12 px-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-[#6E675E] hover:text-[#171615] p-1 font-bold text-sm"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-semibold text-[#171615] tabular-nums font-mono">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-[#6E675E] hover:text-[#171615] p-1 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="w-12 h-12 border border-[#DDD5C8] bg-white flex items-center justify-center text-[#171615] hover:border-[#171615] transition-colors"
                      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          wishlisted ? 'fill-[#8A5A44] text-[#8A5A44]' : 'text-[#36322E]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-12 bg-[#8A5A44] text-white text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#724532] transition-colors shadow-xs active:scale-98"
                  >
                    BUY NOW · EXPRESS PRIVILEGE
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-3 gap-2 py-3.5 px-3.5 bg-white border border-[#EAE3D8] rounded-xs text-[11px] text-[#69635A] mb-6">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                    <span>Free Shipping &gt; ₹1,999</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                    <span>7-Day Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                    <span>100% Genuine Fashion</span>
                  </div>
                </div>
              </div>

              {/* Accordions: Description, Fabric, Fit, Care, Shipping */}
              <div className="border-t border-[#EAE3D8] divide-y divide-[#EAE3D8] text-xs">
                {/* Description */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('description')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-luxury text-[10px] text-[#171615]"
                  >
                    <span>Garment Silhouette & Narrative</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeAccordion === 'description' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === 'description' && (
                    <div className="pb-3 text-[#625C54] leading-relaxed font-light">
                      <p>{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Fabric & Fit */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('fabric')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-luxury text-[10px] text-[#171615]"
                  >
                    <span>Textile & Fit Architecture</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeAccordion === 'fabric' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === 'fabric' && (
                    <div className="pb-3 text-[#625C54] space-y-1.5 leading-relaxed font-light">
                      <p>
                        <strong className="text-[#171615] font-medium">Textile:</strong> {product.fabric}
                      </p>
                      <p>
                        <strong className="text-[#171615] font-medium">Fit Profile:</strong> {product.fit}
                      </p>
                      <p>
                        <strong className="text-[#171615] font-medium">Provenance:</strong> Hand-finished in Surat & Tirupur, India
                      </p>
                    </div>
                  )}
                </div>

                {/* Care Instructions */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('care')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-luxury text-[10px] text-[#171615]"
                  >
                    <span>Garment Care</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeAccordion === 'care' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === 'care' && (
                    <div className="pb-3 text-[#625C54] leading-relaxed font-light">
                      <p>{product.care}</p>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-luxury text-[10px] text-[#171615]"
                  >
                    <span>Logistics & Exchange Policy</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeAccordion === 'shipping' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === 'shipping' && (
                    <div className="pb-3 text-[#625C54] space-y-1 leading-relaxed font-light">
                      <p>• Dispatched within 24-48 hours via premium express couriers across India.</p>
                      <p>• Metro delivery: 2-4 business days. Non-metro: 3-5 business days.</p>
                      <p>• Doorstep pickup available for reverse exchanges and returns within 7 days of delivery.</p>
                      <p>• Concierge: <a href="tel:+917248596540" className="text-[#171615] font-medium">+91-7248596540</a> or email <a href="mailto:Help@lusi.in" className="text-[#8A5A44]">Help@lusi.in</a>.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-14 pt-10 border-t border-[#EAE3D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#171615]">
                  Patron Reviews
                </h3>
                <p className="text-xs text-[#7A746B] mt-0.5 font-light">
                  Rated {product.rating} out of 5 based on {product.reviewCount} verified purchases
                </p>
              </div>

              <div className="mt-2 sm:mt-0 flex items-center gap-1 text-[#C9A354]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white border border-[#EAE3D8] rounded-xs text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#C9A354]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[#8A847A] font-mono text-[11px]">{rev.date}</span>
                    </div>
                    <h4 className="font-serif text-sm font-medium text-[#171615]">{rev.title}</h4>
                    <p className="text-[#655F57] leading-relaxed font-light">{rev.comment}</p>
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#2C6228]">
                      <Check className="w-3 h-3 stroke-[2]" />
                      <span>Verified Buyer · {rev.author} ({rev.city || 'India'})</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 bg-white border border-[#EAE3D8] text-xs text-[#787167]">
                  No reviews yet. Be the first to review this style!
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-14 pt-10 border-t border-[#EAE3D8]">
              <h3 className="font-serif text-2xl font-light text-[#171615] mb-8">
                Complete The Look
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Buy Bar (<54px height, quick thumb CTA) */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/96 backdrop-blur-md border-t border-[#EAE3D8] p-3 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <p className="text-xs font-medium text-[#171615] truncate max-w-[150px]">{product.name}</p>
            <p className="text-xs font-semibold text-[#171615] tabular-nums font-mono">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-4 py-2.5 bg-[#171615] text-[#FAF8F5] text-[10px] font-semibold tracking-luxury uppercase shadow-xs active:scale-95"
            >
              Add To Bag
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="px-4 py-2.5 bg-[#8A5A44] text-white text-[10px] font-semibold tracking-luxury uppercase shadow-xs active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
