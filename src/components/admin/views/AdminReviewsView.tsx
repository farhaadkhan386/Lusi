import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  EyeOff,
  Trash2,
  Star,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminReview } from '../../../types';

export const AdminReviewsView: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Hidden'>('All');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Customer Reviews Moderation</h2>
          <p className="text-xs text-[#8A7E6E]">
            {reviews.length} total customer ratings. Approve, hide, or delete reviews across all clothing pieces.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736857]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by garment, reviewer name, or text..."
            className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs pl-9 pr-3 py-2 text-xs text-white placeholder-[#63594B] font-mono focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-[#1F1B16] border border-[#332A1F] text-xs text-[#DDD6C8] px-3 py-2 rounded-xs"
        >
          <option value="All">All Moderation Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending Moderation</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-[#1C1814] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                    {r.productName}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{r.author}</div>
                    <div className="text-[10px] text-[#736857]">{r.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-[#C9A354]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-mono font-bold">{r.rating}.0</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#DDD6C8] max-w-md">
                    <div className="font-medium text-white">{r.title}</div>
                    <div className="text-[11px] text-[#A89E8F] line-clamp-2 mt-0.5">{r.comment}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#736857] whitespace-nowrap">
                    {r.date}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold ${
                        r.status === 'Approved'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : r.status === 'Pending'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.status !== 'Approved' && (
                        <button
                          type="button"
                          onClick={() => updateReviewStatus(r.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 rounded-xs text-[10px] uppercase font-mono"
                          title="Approve Review"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'Hidden' && (
                        <button
                          type="button"
                          onClick={() => updateReviewStatus(r.id, 'Hidden')}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xs text-[10px] uppercase font-mono"
                          title="Hide Review"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteReview(r.id)}
                        className="p-1 text-[#736857] hover:text-red-400"
                        title="Delete Review"
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
    </div>
  );
};
