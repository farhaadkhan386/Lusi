import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    navigateToCategory,
    rewardPoints,
    openAccountModal,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EAE3D8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4.5 h-4.5 text-[#171615] stroke-[1.5]" />
              <h2 className="font-serif text-xl font-light text-[#171615]">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#5F5850] hover:text-[#171615] transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F3EFE9] px-6 py-3 border-b border-[#E8DFC8] text-xs">
            {cartSubtotal >= 1999 ? (
              <p className="text-[#2C6228] font-medium flex items-center gap-1.5">
                <span>✓</span> You qualify for Complimentary Domestic Delivery!
              </p>
            ) : (
              <div>
                <p className="text-[#59524A] font-light">
                  Add <strong className="text-[#171615] font-mono">₹{(1999 - cartSubtotal).toLocaleString('en-IN')}</strong> more for <strong className="text-[#8A5A44]">Free Dispatch</strong>
                </p>
                <div className="mt-2 w-full bg-[#DDD6CA] h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#8A5A44] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 1999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#787167]">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mb-4 text-[#8A5A44] border border-[#DDD5C8]">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-light text-[#171615]">Your bag is empty</h3>
                <p className="text-xs text-[#7A7369] max-w-xs mt-1.5 mb-8 font-light">
                  Explore versatile everyday essentials tailored for Men, Women and Kids.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToCategory('All');
                  }}
                  className="px-7 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-all"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white border border-[#EAE3D8] rounded-xs shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-26 shrink-0 overflow-hidden bg-[#F2EDE4] rounded-xs border border-[#EAE3D8]">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-medium text-[#171615] line-clamp-1 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#968E83] hover:text-[#B33939] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <p className="text-[11px] text-[#7A746B] mt-1 font-light">
                        Size: <span className="font-medium text-[#171615] font-mono">{item.selectedSize}</span> · Color: <span className="font-medium text-[#171615]">{item.selectedColor.name}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F5F2EB]">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#DDD5C8] bg-[#FAF8F5] rounded-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2 py-0.5 hover:bg-[#F2ECE1] text-[#4A453F]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-[#171615] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2 py-0.5 hover:bg-[#F2ECE1] text-[#4A453F]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <span className="text-sm font-medium tabular-nums text-[#171615] font-serif">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EAE3D8] space-y-3.5">
              {/* Coupon Code Section */}
              <div className="pb-3 border-b border-[#F0ECE1]">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#F4F8F3] border border-[#C5DDC0] p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#2C6228]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{couponCode}</strong> Applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-[#A63B3B] underline hover:text-black font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (try LUSIFIRST)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CCC0] focus:outline-none focus:border-[#171615]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-[10px] font-semibold uppercase tracking-luxury bg-[#FAF8F5] border border-[#171615] text-[#171615] hover:bg-[#171615] hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && !couponCode && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.success ? 'text-[#2C6228]' : 'text-[#A63B3B]'}`}>
                    {couponFeedback.message}
                  </p>
                )}

                {/* Lusi Rewards Quick Nudge */}
                <div className="mt-2.5 pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#5F5850]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A354]" />
                    <span>Lusi Rewards: <strong className="text-[#171615] font-mono">{rewardPoints} pts</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      openAccountModal('rewards');
                    }}
                    className="text-[#8A5A44] font-medium hover:underline text-[10px] tracking-wide uppercase"
                  >
                    Redeem Discounts →
                  </button>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#6B655D]">
                <div className="flex justify-between">
                  <span className="font-light">Subtotal</span>
                  <span className="font-medium text-[#171615] tabular-nums font-mono">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2C6228]">
                    <span>Privilege Discount</span>
                    <span className="font-medium tabular-nums font-mono">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="font-light">Domestic Shipping</span>
                  <span className="font-medium text-[#171615] tabular-nums font-mono">
                    {shippingFee === 0 ? (
                      <strong className="text-[#2C6228] font-normal tracking-wide">COMPLIMENTARY</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2.5 border-t border-[#F0ECE1] text-sm font-semibold text-[#171615]">
                  <span className="font-serif">Total (All Taxes Incl.)</span>
                  <span className="text-lg font-serif tabular-nums font-normal">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 bg-transparent text-[#666057] text-xs font-light hover:text-[#171615] transition-colors text-center"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
