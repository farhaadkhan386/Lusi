import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminCoupon } from '../../../types';

export const AdminCouponsView: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponActive } = useAdmin();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number;
    startDate: string;
    expiryDate: string;
    usageLimit: number;
    applicableCategory: 'All' | 'Men' | 'Women' | 'Kids';
    isActive: boolean;
  }>({
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 1999,
    maxDiscount: 2000,
    startDate: '2026-10-01',
    expiryDate: '2026-12-31',
    usageLimit: 5000,
    applicableCategory: 'All',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 1000,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      usageLimit: 2000,
      applicableCategory: 'All',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCoupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscount: c.maxDiscount || 0,
      startDate: c.startDate,
      expiryDate: c.expiryDate,
      usageLimit: c.usageLimit,
      applicableCategory: c.applicableCategory || 'All',
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData);
    } else {
      addCoupon({
        ...formData,
        code: formData.code.trim().toUpperCase(),
        usedCount: 0,
      });
    }
    setIsModalOpen(false);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Discounts & Coupon Privileges</h2>
          <p className="text-xs text-[#8A7E6E]">
            Configure promo codes, percentage/fixed discounts, minimum carts, and expiry dates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Privilege Type & Value</th>
                <th className="py-3 px-4">Min. Cart Value</th>
                <th className="py-3 px-4">Applicable Scope</th>
                <th className="py-3 px-4">Valid Period</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#1C1814] transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-1 bg-[#241F18] border border-[#3E3526] text-[#C9A354] rounded-xs font-bold text-xs">
                      {c.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-white">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    {c.maxDiscount ? (
                      <span className="text-[10px] text-[#736857] block">Max ₹{c.maxDiscount}</span>
                    ) : null}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#DDD6C8]">
                    {c.minOrderValue > 0 ? `₹${c.minOrderValue.toLocaleString('en-IN')}` : 'No minimum'}
                  </td>

                  <td className="py-3.5 px-4 text-[#A89E8F] uppercase font-mono text-[11px]">
                    {c.applicableCategory || 'All'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#736857]">
                    {c.startDate} to {c.expiryDate}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white">{c.usedCount}</span> / {c.usageLimit}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleCouponActive(c.id)}
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold transition-colors ${
                        c.isActive
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-[#8A7E6E] hover:text-white rounded-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 text-[#8A7E6E] hover:text-red-400 rounded-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#171512] border border-[#2E271F] p-6 rounded-xs text-[#DDD6C8]">
            <h3 className="font-serif text-lg text-white mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Promotional Code'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                  Coupon Code (uppercase)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono uppercase"
                  placeholder="e.g. LUSISPRING"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Rupee (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Value ({formData.discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Min. Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                    Applicable Scope
                  </label>
                  <select
                    value={formData.applicableCategory}
                    onChange={(e) => setFormData({ ...formData, applicableCategory: e.target.value as any })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Men">Men Only</option>
                    <option value="Women">Women Only</option>
                    <option value="Kids">Kids Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#292219] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A7E6E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C9A354] hover:bg-[#B38F44] text-black font-semibold text-xs rounded-xs uppercase tracking-wider"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
