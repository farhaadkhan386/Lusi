import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Shirt,
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminDashboardView: React.FC = () => {
  const { products, orders, customers, setCurrentTab } = useAdmin();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'year'>('30days');

  // Computed metrics
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const todayOrders = orders.filter((o) => o.date.includes('2026-10-06'));
  const todaySales = todayOrders.reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'New' || o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed'
  );
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled');

  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);

  // Category sales breakdown
  const categoryBreakdown = [
    { label: "Men's Apparel", percentage: 48, revenue: 142800, color: 'bg-emerald-500' },
    { label: "Women's Apparel", percentage: 38, revenue: 113000, color: 'bg-amber-500' },
    { label: "Kids' Collection", percentage: 14, revenue: 41600, color: 'bg-sky-500' },
  ];

  // Best selling products
  const bestSellers = products
    .filter((p) => p.isBestSeller)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26221C]">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Store Analytics & Overview</h2>
          <p className="text-xs text-[#8A7E6E] font-light">
            Real-time pan-India retail performance, orders fulfillment, and inventory health.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#1A1713] border border-[#2E271F] rounded-xs text-xs font-mono">
          {(['today', '7days', '30days', 'year'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 uppercase rounded-xs transition-colors ${
                timeRange === range
                  ? 'bg-[#C9A354] text-black font-semibold'
                  : 'text-[#8A7E6E] hover:text-white'
              }`}
            >
              {range === 'today'
                ? 'Today'
                : range === '7days'
                ? '7 Days'
                : range === '30days'
                ? '30 Days'
                : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 bg-[#171512] border border-[#2B251D] rounded-xs relative overflow-hidden group hover:border-[#C9A354]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#8A7E6E] mb-2 uppercase tracking-luxury font-medium">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-light tabular-nums">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-mono font-medium">+18.4%</span>
            <span className="text-[#696052]">vs last period</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="p-5 bg-[#171512] border border-[#2B251D] rounded-xs relative overflow-hidden group hover:border-[#C9A354]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#8A7E6E] mb-2 uppercase tracking-luxury font-medium">
            <span>Today's Sales</span>
            <div className="w-8 h-8 rounded-full bg-[#241F18] border border-[#3E3526] flex items-center justify-center text-[#C9A354]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-light tabular-nums">
            ₹{todaySales.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#8A7E6E]">
            <Clock className="w-3.5 h-3.5 text-[#C9A354]" />
            <span className="font-mono text-white">{todayOrders.length} orders</span>
            <span>logged today</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-[#171512] border border-[#2B251D] rounded-xs relative overflow-hidden group hover:border-[#C9A354]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#8A7E6E] mb-2 uppercase tracking-luxury font-medium">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-sky-950/40 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-light tabular-nums">
            {orders.length}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#8A7E6E]">
            <span className="text-amber-400 font-mono font-medium">{pendingOrders.length} pending</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono font-medium">{completedOrders.length} completed</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 bg-[#171512] border border-[#2B251D] rounded-xs relative overflow-hidden group hover:border-[#C9A354]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#8A7E6E] mb-2 uppercase tracking-luxury font-medium">
            <span>Active Customers</span>
            <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-light tabular-nums">
            {customers.length}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-mono font-medium">100% verified</span>
            <span className="text-[#696052]">pan-India</span>
          </div>
        </div>
      </div>

      {/* Secondary Stock & Operational Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-[#736857] font-medium mb-1">Catalog Size</div>
          <div className="text-lg font-mono text-white font-semibold">{products.length} Products</div>
        </div>
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-amber-400 font-medium mb-1">Low Stock</div>
          <div className="text-lg font-mono text-amber-300 font-semibold">{lowStockProducts.length} Items</div>
        </div>
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-red-400 font-medium mb-1">Out of Stock</div>
          <div className="text-lg font-mono text-red-300 font-semibold">{outOfStockProducts.length} Items</div>
        </div>
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-emerald-400 font-medium mb-1">Avg Order Value</div>
          <div className="text-lg font-mono text-white font-semibold">
            ₹{orders.length > 0 ? Math.round(totalSales / orders.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-sky-400 font-medium mb-1">Pending Dispatch</div>
          <div className="text-lg font-mono text-sky-300 font-semibold">{pendingOrders.length} Orders</div>
        </div>
        <div className="p-3.5 bg-[#191613] border border-[#29231B] rounded-xs">
          <div className="text-[10px] uppercase text-[#736857] font-medium mb-1">Cancelled Orders</div>
          <div className="text-lg font-mono text-[#8A7E6E] font-semibold">{cancelledOrders.length} Orders</div>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Graphic (Clean SVG Luxury Visual) */}
        <div className="lg:col-span-2 p-6 bg-[#171512] border border-[#2B251D] rounded-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-light text-white">Revenue Velocity (INR)</h3>
              <p className="text-xs text-[#8A7E6E]">Weekly dispatch volume across Indian metros</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A354]" />
                <span>Ready-to-Wear</span>
              </span>
            </div>
          </div>

          {/* SVG Area Chart Mock */}
          <div className="h-56 w-full flex flex-col justify-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C9A354" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C9A354" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#262119" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#262119" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#262119" strokeDasharray="3 3" />

              {/* Area */}
              <polygon
                points="0,130 60,110 120,95 180,105 240,70 300,55 360,65 420,35 500,20 500,140 0,140"
                fill="url(#goldGrad)"
              />
              {/* Stroke line */}
              <polyline
                points="0,130 60,110 120,95 180,105 240,70 300,55 360,65 420,35 500,20"
                fill="none"
                stroke="#C9A354"
                strokeWidth="2.5"
              />
              {/* Highlight points */}
              <circle cx="240" cy="70" r="4" fill="#C9A354" stroke="#171512" strokeWidth="2" />
              <circle cx="420" cy="35" r="4" fill="#C9A354" stroke="#171512" strokeWidth="2" />
              <circle cx="500" cy="20" r="4.5" fill="#FFF" stroke="#C9A354" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[11px] font-mono text-[#736857] pt-3 border-t border-[#26211A]">
              <span>Sep 01</span>
              <span>Sep 08</span>
              <span>Sep 15</span>
              <span>Sep 22</span>
              <span>Sep 29</span>
              <span>Oct 06 (Today)</span>
            </div>
          </div>
        </div>

        {/* Category Contribution */}
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-light text-white mb-1">Category Contribution</h3>
            <p className="text-xs text-[#8A7E6E] mb-6">Revenue split by apparel collection</p>

            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#DDD6C8] font-medium">{item.label}</span>
                    <span className="font-mono text-[#C9A354]">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#262119] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#736857] font-mono">
                    ₹{item.revenue.toLocaleString('en-IN')} gross
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#26211A] text-xs text-[#8A7E6E]">
            <span className="text-white font-medium">Insights:</span> Men's Heavyweight Tees & Linen Co-ords drive highest volume in Mumbai and Bengaluru.
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-[#171512] border border-[#2B251D] rounded-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-light text-white">Recent Store Orders</h3>
              <p className="text-xs text-[#8A7E6E]">Live customer transactions awaiting or undergoing dispatch</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab('orders')}
              className="text-xs text-[#C9A354] hover:underline flex items-center gap-1 font-mono uppercase"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#29231A] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#221C16]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.orderId} className="hover:bg-[#1F1A15] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-white">{order.orderId}</td>
                    <td className="py-3 px-3">
                      <div className="text-[#DDD6C8] font-medium">{order.address.fullName}</div>
                      <div className="text-[10px] text-[#736857]">{order.address.city}</div>
                    </td>
                    <td className="py-3 px-3 text-[#A89E8F] font-mono">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-white">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] uppercase text-[#9E9484]">
                      {order.address.paymentMethod}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium uppercase ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                            : order.orderStatus === 'Processing' || order.orderStatus === 'Packed'
                            ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Best Sellers (1 col) */}
        <div className="space-y-6">
          {/* Low Stock Box */}
          <div className="bg-[#171512] border border-[#2B251D] rounded-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-base font-light text-white">Critical Stock Alerts</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('inventory')}
                className="text-[11px] text-[#C9A354] hover:underline font-mono"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {lowStockProducts.concat(outOfStockProducts).slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="p-2.5 bg-[#1C1814] border border-[#2E271F] rounded-xs flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-white font-medium truncate">{prod.name}</div>
                    <div className="text-[10px] text-[#736857] font-mono">{prod.sku}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs ${
                        prod.stockQuantity === 0
                          ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {prod.stockQuantity === 0 ? '0 Left' : `${prod.stockQuantity} Left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Silhouettes */}
          <div className="bg-[#171512] border border-[#2B251D] rounded-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-base font-light text-white">Top Converting Apparel</h3>
              <button
                type="button"
                onClick={() => setCurrentTab('products')}
                className="text-[11px] text-[#C9A354] hover:underline font-mono"
              >
                Catalog
              </button>
            </div>

            <div className="space-y-3">
              {bestSellers.map((prod, i) => (
                <div key={prod.id} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#63594A] w-4">{i + 1}.</span>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-9 h-11 object-cover rounded-xs border border-[#292219]"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="text-white truncate font-medium">{prod.name}</div>
                    <div className="text-[11px] text-[#C9A354] font-mono">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#241F18] text-[#A89E8F] rounded-xs">
                    {prod.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
