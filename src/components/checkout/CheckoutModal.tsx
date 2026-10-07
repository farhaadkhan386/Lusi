import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ShippingAddress, OrderConfirmation } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    discountAmount,
    couponCode,
    placeOrder,
    openAccountModal,
  } = useShop();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    paymentMethod: 'upi',
    upiId: '',
  });

  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(formData);
      setConfirmedOrder(order);
      setSubmitting(false);
    }, 800);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 relative z-10">
        <div className="w-full max-w-3xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden my-4">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-[#EAE3D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-[#171615]">
                LUSI
              </span>
              <span className="text-[#C4BCB0]">/</span>
              <span className="text-[10px] uppercase tracking-luxury font-medium text-[#6B655D]">
                {confirmedOrder ? 'Order Confirmation' : 'Express Atelier Checkout'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-[#666056] hover:text-[#171615] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {confirmedOrder ? (
            /* Order Success State */
            <div className="p-8 sm:p-12 text-center bg-white space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF3EA] text-[#2C6228] flex items-center justify-center mx-auto border border-[#C5DDC0]">
                <CheckCircle className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-luxury font-semibold text-[#8A5A44] block mb-1">
                  Confirmation of Acquisition
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#171615]">
                  Your order is confirmed
                </h3>
                <p className="text-xs font-mono text-[#666056] mt-2">
                  Order ID: <strong className="text-[#171615] font-semibold">{confirmedOrder.orderId}</strong>
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-6 border border-[#EAE3D8] rounded-xs max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-[#F0ECE1] pb-2">
                  <span className="text-[#7A746B] font-light">Target Delivery</span>
                  <strong className="text-[#171615] font-medium">{confirmedOrder.estimatedDelivery}</strong>
                </div>
                <div className="flex justify-between border-b border-[#F0ECE1] pb-2">
                  <span className="text-[#7A746B] font-light">Destination</span>
                  <span className="text-[#171615] text-right font-medium">
                    {confirmedOrder.address.fullName}, {confirmedOrder.address.city} - {confirmedOrder.address.pincode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F0ECE1] pb-2">
                  <span className="text-[#7A746B] font-light">Settlement Method</span>
                  <span className="text-[#171615] font-medium uppercase font-mono">
                    {confirmedOrder.address.paymentMethod}
                  </span>
                </div>
                {confirmedOrder.rewardsEarned && (
                  <div className="flex justify-between border-b border-[#F0ECE1] pb-2 text-[#2C6228]">
                    <span className="font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Lusi Rewards Earned
                    </span>
                    <strong className="font-mono">+{confirmedOrder.rewardsEarned} pts</strong>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 text-sm font-semibold text-[#171615]">
                  <span className="font-serif">Total Settled</span>
                  <span className="tabular-nums font-serif text-base font-normal">
                    ₹{confirmedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#7A746B] max-w-md mx-auto font-light">
                An electronic receipt has been dispatched to <strong className="text-[#171615]">{confirmedOrder.address.email}</strong> alongside SMS updates to <strong className="text-[#171615]">+91 {confirmedOrder.address.phone}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const orderId = confirmedOrder.orderId;
                    handleClose();
                    openAccountModal('track', orderId);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#8A5A44] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Truck className="w-4 h-4" />
                  <span>TRACK MY ORDER</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#D5CCC0] text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Fields Left */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-[#171615] mb-3">
                      1. Contact & Recipient Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="rahul@example.com"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                            Phone Number (+91) *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="9876543210"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-[#171615] mb-3">
                      2. Destination in India
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                          Flat / House No. / Building / Street *
                        </label>
                        <input
                          type="text"
                          name="street"
                          required
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="House 42, Green Avenue"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                          Apartment / Area / Landmark
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Near Central Park, Indiranagar"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#5F5950] mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            required
                            maxLength={6}
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCC0] text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-[#171615] mb-3">
                      3. Settlement Preference
                    </h3>
                    <div className="space-y-2">
                      {/* UPI */}
                      <label className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-colors ${formData.paymentMethod === 'upi' ? 'border-[#171615] bg-white shadow-2xs' : 'border-[#E0D7CA] bg-[#FAF8F5]'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                          className="mt-0.5 text-[#171615]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#171615]">UPI (Direct & Instant)</span>
                            <span className="text-[10px] text-[#2C6228] font-medium bg-[#EBF3EA] px-2 py-0.5 font-mono">Zero Surcharge</span>
                          </div>
                          <p className="text-[11px] text-[#7A746B] mt-0.5 font-light">
                            Google Pay, PhonePe, Paytm or custom VPA
                          </p>
                          {formData.paymentMethod === 'upi' && (
                            <div className="mt-2.5">
                              <input
                                type="text"
                                placeholder="Enter UPI ID (e.g. yourname@okhdfcbank)"
                                value={formData.upiId}
                                onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D5CCC0] focus:outline-none focus:border-[#171615]"
                              />
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Card */}
                      <label className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-colors ${formData.paymentMethod === 'card' ? 'border-[#171615] bg-white shadow-2xs' : 'border-[#E0D7CA] bg-[#FAF8F5]'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="mt-0.5 text-[#171615]"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-[#171615]">Credit / Debit Card</span>
                          <p className="text-[11px] text-[#7A746B] mt-0.5 font-light">
                            Visa, MasterCard, RuPay, American Express
                          </p>
                        </div>
                      </label>

                      {/* Cash on Delivery */}
                      <label className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-[#171615] bg-white shadow-2xs' : 'border-[#E0D7CA] bg-[#FAF8F5]'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="mt-0.5 text-[#171615]"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-[#171615]">Cash on Delivery (COD)</span>
                          <p className="text-[11px] text-[#7A746B] mt-0.5 font-light">
                            Settle in cash or via dynamic QR upon delivery
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Order Summary Right */}
                <div className="lg:col-span-5 bg-white p-6 border border-[#EAE3D8] flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-[#171615] mb-4 pb-2.5 border-b border-[#F0ECE1]">
                      Bag Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                    </h3>

                    {/* Small list of items */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-xs">
                          <div className="w-12 h-14 bg-[#FAF8F5] shrink-0 overflow-hidden border border-[#EDE5DA]">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-medium text-[#171615] truncate">{item.product.name}</p>
                            <p className="text-[11px] text-[#7A7369] font-light">
                              Qty: {item.quantity} · {item.selectedSize} · {item.selectedColor.name}
                            </p>
                          </div>
                          <span className="font-mono tabular-nums text-[#171615]">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-3 border-t border-[#F0ECE1] text-xs text-[#6B655D]">
                      <div className="flex justify-between">
                        <span className="font-light">Subtotal</span>
                        <span className="text-[#171615] font-mono tabular-nums">
                          ₹{cartSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-[#2C6228]">
                          <span>Privilege ({couponCode})</span>
                          <span className="font-mono tabular-nums">
                            -₹{discountAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="font-light">Domestic Delivery</span>
                        <span className="text-[#171615] font-mono tabular-nums">
                          {shippingFee === 0 ? <strong className="text-[#2C6228] font-normal tracking-wide">COMPLIMENTARY</strong> : `₹${shippingFee}`}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2.5 border-t border-[#F0ECE1] text-sm font-semibold text-[#171615]">
                        <span className="font-serif">Total Payable</span>
                        <span className="text-base font-serif tabular-nums font-normal">
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between text-[#8A5A44] pt-1 text-[11px]">
                        <span className="font-light flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Lusi Rewards to Earn
                        </span>
                        <span className="font-mono font-medium">
                          +{Math.max(50, Math.floor(cartTotal / 10))} pts
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-[#FAF8F5] border border-[#EDE7DD] text-[11px] text-[#787167] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#171615]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8A5A44]" />
                        <span className="font-medium text-[10px] uppercase tracking-wider">256-Bit Encrypted Checkout</span>
                      </div>
                      <p className="font-light">Direct merchant settlement. Zero hidden tariffs.</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-colors flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 shadow-xs"
                    >
                      {submitting ? 'CONFIRMING ORDER...' : `SETTLE ₹${cartTotal.toLocaleString('en-IN')} & PLACE ORDER`}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
