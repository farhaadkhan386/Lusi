import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Store & Fulfillment Settings</h2>
          <p className="text-xs text-[#8A7E6E]">
            Brand information, shipping charges, cash on delivery thresholds, and payment architecture.
          </p>
        </div>

        {saved && (
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xs flex items-center gap-1.5 font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Store Profile */}
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs space-y-4">
          <div className="flex items-center gap-2 text-white font-serif text-base pb-3 border-b border-[#241F18]">
            <Building className="w-4 h-4 text-[#C9A354]" />
            <span>Brand Identity & Contact Dossier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Brand Name</label>
              <input
                type="text"
                disabled
                value={formData.brandName}
                className="w-full bg-[#12100E] border border-[#2B2319] rounded-xs p-2.5 text-xs text-[#DDD6C8] font-mono cursor-not-allowed"
                title="Strict brand name is LUSI"
              />
              <span className="text-[10px] text-[#736857] mt-1 block">Brand wordmark is strictly 'LUSI' without dot.</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Currency & Country</label>
              <input
                type="text"
                disabled
                value={`${formData.currency} (${formData.currencySymbol}) · ${formData.country}`}
                className="w-full bg-[#12100E] border border-[#2B2319] rounded-xs p-2.5 text-xs text-[#DDD6C8] font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Atelier Store Address</label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Shipping & Delivery Configuration */}
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs space-y-4">
          <div className="flex items-center gap-2 text-white font-serif text-base pb-3 border-b border-[#241F18]">
            <Truck className="w-4 h-4 text-[#C9A354]" />
            <span>Domestic Shipping Rules (India)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-[#736857] mt-1 block">Default: Free shipping above ₹1,999</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                Standard Shipping Charge Below Threshold (₹)
              </label>
              <input
                type="number"
                value={formData.shippingCharge}
                onChange={(e) => setFormData({ ...formData, shippingCharge: Number(e.target.value) })}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Architecture */}
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs space-y-4">
          <div className="flex items-center gap-2 text-white font-serif text-base pb-3 border-b border-[#241F18]">
            <CreditCard className="w-4 h-4 text-[#C9A354]" />
            <span>Payment Processing Gateways</span>
          </div>

          <p className="text-xs text-[#8A7E6E] leading-relaxed">
            Configure payment methods available at checkout. Secret Razorpay credentials remain stored in secure server-side environment variables and are never exposed in frontend code.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#1F1B16] border border-[#2E271F] rounded-xs">
              <div>
                <div className="text-xs font-medium text-white">UPI Instant Payment (GPay, PhonePe, Paytm)</div>
                <div className="text-[11px] text-[#736857]">Zero transaction fee, immediate confirmation</div>
              </div>
              <input
                type="checkbox"
                checked={formData.upiEnabled}
                onChange={(e) => setFormData({ ...formData, upiEnabled: e.target.checked })}
                className="accent-[#C9A354]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#1F1B16] border border-[#2E271F] rounded-xs">
              <div>
                <div className="text-xs font-medium text-white">Credit & Debit Cards (Visa, MasterCard, RuPay)</div>
                <div className="text-[11px] text-[#736857]">Encrypted tokenization via payment gateway</div>
              </div>
              <input
                type="checkbox"
                checked={formData.cardEnabled}
                onChange={(e) => setFormData({ ...formData, cardEnabled: e.target.checked })}
                className="accent-[#C9A354]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#1F1B16] border border-[#2E271F] rounded-xs">
              <div>
                <div className="text-xs font-medium text-white">Cash on Delivery (COD)</div>
                <div className="text-[11px] text-[#736857]">Available for pan-India pincodes up to ₹10,000</div>
              </div>
              <input
                type="checkbox"
                checked={formData.codEnabled}
                onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
                className="accent-[#C9A354]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black font-semibold text-xs rounded-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
