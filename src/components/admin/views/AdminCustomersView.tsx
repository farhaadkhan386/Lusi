import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Award,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminCustomer } from '../../../types';

export const AdminCustomersView: React.FC = () => {
  const { customers, orders } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Customer Directory</h2>
          <p className="text-xs text-[#8A7E6E]">
            {customers.length} verified shoppers. View orders history, lifetime spend, and loyalty tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#1F1B16] border border-[#2E271F] rounded-xs text-xs font-mono text-[#C9A354]">
            VIP Tiers Enabled
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#736857]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, city, or phone..."
          className="w-full bg-transparent text-xs text-white placeholder-[#63594B] focus:outline-none font-mono"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Dossier</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders Count</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4">Privilege Tier</th>
                <th className="py-3 px-4 text-right">View History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#1C1814] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{cust.name}</div>
                    <div className="text-[10px] text-[#736857] font-mono">ID: {cust.id}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-[#DDD6C8]">{cust.email}</div>
                    <div className="text-[10px] text-[#736857]">{cust.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#A89E8F]">{cust.city}</td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white font-semibold">{cust.ordersCount}</span> orders
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold ${
                        cust.status === 'VIP'
                          ? 'bg-[#C9A354]/20 text-[#C9A354] border border-[#C9A354]/40'
                          : 'bg-[#241F18] text-[#A89E8F]'
                      }`}
                    >
                      {cust.status} · {cust.rewardPoints} pts
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-2.5 py-1.5 bg-[#201C16] hover:bg-[#2C261E] border border-[#332A1F] text-[#C9A354] hover:text-white text-xs rounded-xs font-mono inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#171512] border border-[#2E271F] rounded-xs shadow-2xl p-6 text-[#DDD6C8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#292219]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#C9A354]">CUSTOMER PROFILE</span>
                <h3 className="font-serif text-xl text-white font-light">{selectedCustomer.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-[#8A7E6E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#1C1814] border border-[#2B2319] rounded-xs">
                  <div className="text-[10px] text-[#736857] uppercase font-mono">Orders</div>
                  <div className="text-lg font-mono text-white font-semibold">{selectedCustomer.ordersCount}</div>
                </div>
                <div className="p-3 bg-[#1C1814] border border-[#2B2319] rounded-xs">
                  <div className="text-[10px] text-[#736857] uppercase font-mono">Lifetime Value</div>
                  <div className="text-lg font-mono text-white font-semibold">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 bg-[#1C1814] border border-[#2B2319] rounded-xs">
                  <div className="text-[10px] text-[#736857] uppercase font-mono">Reward Balance</div>
                  <div className="text-lg font-mono text-[#C9A354] font-semibold">{selectedCustomer.rewardPoints} pts</div>
                </div>
                <div className="p-3 bg-[#1C1814] border border-[#2B2319] rounded-xs">
                  <div className="text-[10px] text-[#736857] uppercase font-mono">Account Tier</div>
                  <div className="text-lg font-mono text-white font-semibold">{selectedCustomer.status}</div>
                </div>
              </div>

              <div className="p-4 bg-[#1C1814] border border-[#2B2319] rounded-xs text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E6E]">Email:</span>
                  <span className="font-mono text-white">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E6E]">Phone:</span>
                  <span className="font-mono text-white">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E6E]">City:</span>
                  <span className="text-white">{selectedCustomer.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E6E]">Last Purchase:</span>
                  <span className="font-mono text-white">{selectedCustomer.lastOrderDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#292219] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-[#262018] text-white text-xs rounded-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
