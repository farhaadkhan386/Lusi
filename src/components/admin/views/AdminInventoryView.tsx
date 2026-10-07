import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  CheckCircle2,
  PackageX,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminInventoryView: React.FC = () => {
  const { products, updateStock, updateLowStockThreshold } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  const lowStockThresholdDefault = 10;

  const filteredItems = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'low') return p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
    if (filterType === 'out') return p.stockQuantity === 0;
    return true;
  });

  const lowStockCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Inventory & Stock Controls</h2>
          <p className="text-xs text-[#8A7E6E]">
            Monitor warehouse inventory counts, set auto warnings, and adjust physical stock.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-colors ${
              filterType === 'all'
                ? 'bg-[#C9A354] text-black border-[#C9A354] font-semibold'
                : 'bg-[#1C1814] text-[#A89E8F] border-[#332A1F]'
            }`}
          >
            All Stock ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-colors flex items-center gap-1.5 ${
              filterType === 'low'
                ? 'bg-amber-500 text-black border-amber-500 font-semibold'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('out')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-colors flex items-center gap-1.5 ${
              filterType === 'out'
                ? 'bg-red-500 text-black border-red-500 font-semibold'
                : 'bg-red-950/40 text-red-300 border-red-800/50'
            }`}
          >
            <PackageX className="w-3.5 h-3.5" />
            <span>Out of Stock ({outOfStockCount})</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#736857]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inventory by garment title or SKU..."
          className="w-full bg-transparent text-xs text-white placeholder-[#63594B] focus:outline-none font-mono"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU / Sizes</th>
                <th className="py-3 px-4">Available Variants</th>
                <th className="py-3 px-4">Alert Threshold</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status Indicator</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredItems.map((item) => {
                const isOut = item.stockQuantity === 0;
                const isLow = !isOut && item.stockQuantity <= item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-[#1C1814] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-10 h-13 object-cover rounded-xs border border-[#292219] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate max-w-xs">{item.name}</div>
                          <div className="text-[10px] text-[#736857]">{item.category} · {item.subcategory}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="text-white">{item.sku}</div>
                      <div className="text-[10px] text-[#736857] truncate max-w-[120px]">
                        {item.sizes.join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.lowStockThreshold}
                          onChange={(e) => updateLowStockThreshold(item.id, Number(e.target.value))}
                          className="w-14 bg-[#1F1B16] border border-[#332A1F] rounded-xs px-2 py-1 text-xs text-white text-center focus:border-[#C9A354]"
                        />
                        <span className="text-[10px] text-[#736857]">units</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold">
                      <span
                        className={`text-sm ${
                          isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.stockQuantity}
                      </span>
                      <span className="text-[10px] text-[#736857] ml-1 font-normal">units</span>
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 bg-red-950/80 text-red-300 border border-red-800/60 rounded-xs text-[10px] font-mono uppercase font-bold">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-xs text-[10px] font-mono uppercase font-semibold">
                          LOW STOCK — Only {item.stockQuantity} left
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded-xs text-[10px] font-mono uppercase">
                          Sufficient Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-[#1F1B16] border border-[#332A1F] rounded-xs p-1">
                        <button
                          type="button"
                          onClick={() => updateStock(item.id, item.stockQuantity - 1)}
                          disabled={item.stockQuantity <= 0}
                          className="p-1 hover:bg-[#2E271F] text-[#DDD6C8] disabled:opacity-30 rounded-xs"
                          title="Decrease 1 unit"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={item.stockQuantity}
                          onChange={(e) => updateStock(item.id, Number(e.target.value))}
                          className="w-12 bg-transparent text-center font-mono text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateStock(item.id, item.stockQuantity + 1)}
                          className="p-1 hover:bg-[#2E271F] text-[#DDD6C8] rounded-xs"
                          title="Increase 1 unit"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
