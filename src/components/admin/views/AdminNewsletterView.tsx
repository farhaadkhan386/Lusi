import React, { useState } from 'react';
import {
  Mail,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminNewsletterView: React.FC = () => {
  const { subscribers, deleteSubscriber } = useAdmin();
  const [search, setSearch] = useState('');

  const filteredSubs = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Date Joined,Status'].concat(
        subscribers.map((s) => `${s.email},${s.dateJoined},${s.status}`)
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lusi-newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">VIP Newsletter Subscribers</h2>
          <p className="text-xs text-[#8A7E6E]">
            {subscribers.length} total verified email subscribers opted in for fashion drops and privileges.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#241F18] hover:bg-[#332A1F] text-[#C9A354] border border-[#3E3526] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#736857]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter subscribers by email..."
          className="w-full bg-transparent text-xs text-white placeholder-[#63594B] font-mono focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Date Subscribed</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#211B14]">
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="hover:bg-[#1C1814] transition-colors">
                <td className="py-3.5 px-4 font-mono text-white">{sub.email}</td>
                <td className="py-3.5 px-4 font-mono text-[#736857]">{sub.dateJoined}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 rounded-xs text-[10px] font-mono uppercase">
                    {sub.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => deleteSubscriber(sub.id)}
                    className="p-1.5 text-[#736857] hover:text-red-400"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
