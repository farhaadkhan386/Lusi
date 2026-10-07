import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  X,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { OrderConfirmation, OrderStatus, PaymentStatus } from '../../../types';

export const AdminOrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderConfirmation | null>(null);
  const [timelineNote, setTimelineNote] = useState('');

  const orderStatuses: OrderStatus[] = [
    'New',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded',
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.address.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.address.email.toLowerCase().includes(search.toLowerCase()) ||
      o.address.phone.includes(search);
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status, timelineNote.trim() || undefined);
    setTimelineNote('');
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: status } : null));
    }
  };

  const getStatusBadge = (status?: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-950/70 text-blue-300 border border-blue-800/60';
      case 'Processing':
      case 'Packed':
      case 'Confirmed':
        return 'bg-amber-950/70 text-amber-300 border border-amber-800/60';
      case 'Cancelled':
      case 'Returned':
      case 'Refunded':
        return 'bg-red-950/70 text-red-300 border border-red-800/60';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Pan-India Orders & Dispatch</h2>
          <p className="text-xs text-[#8A7E6E]">
            {orders.length} total orders recorded. Process, track shipments, and update customer status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#736857] uppercase font-mono">Gross Order Value</div>
            <div className="text-lg font-serif text-[#C9A354] font-light">
              ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736857]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email or phone..."
            className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs pl-9 pr-3 py-2 text-xs text-white placeholder-[#63594B] focus:outline-none font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-[#1F1B16] border border-[#332A1F] text-xs text-[#DDD6C8] px-3 py-2 rounded-xs focus:outline-none"
        >
          <option value="All">All Order Statuses</option>
          {orderStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Clothing Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#736857]">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-[#1C1814] transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-semibold">{ord.orderId}</div>
                      <div className="text-[10px] text-[#736857]">{ord.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{ord.address.fullName}</div>
                      <div className="text-[10px] text-[#736857]">{ord.address.city}, {ord.address.pincode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#DDD6C8] font-medium">
                        {ord.items.length} product{ord.items.length > 1 ? 's' : ''} ({ord.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                      </div>
                      <div className="text-[10px] text-[#736857] truncate max-w-xs">
                        {ord.items.map((i) => i.product.name).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-semibold">₹{ord.total.toLocaleString('en-IN')}</div>
                      {ord.discount > 0 && (
                        <div className="text-[10px] text-emerald-400">
                          -₹{ord.discount.toLocaleString('en-IN')} privilege
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="uppercase text-[#DDD6C8]">{ord.address.paymentMethod}</div>
                      <span
                        className={`text-[9px] uppercase px-1 rounded-2xs font-semibold ${
                          ord.paymentStatus === 'Paid'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium uppercase ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus || 'Processing'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1.5 bg-[#201C16] hover:bg-[#2C261E] border border-[#332A1F] text-[#C9A354] hover:text-white text-xs rounded-xs font-mono transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#171512] border border-[#2E271F] rounded-xs shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#DDD6C8]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1C1814] border-b border-[#292219] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#C9A354] tracking-wider font-semibold">
                  ORDER DOSSIER
                </span>
                <h3 className="font-serif text-lg text-white font-light">
                  {selectedOrder.orderId} · {selectedOrder.date}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#8A7E6E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Order Status Controller */}
              <div className="p-4 bg-[#1F1B16] border border-[#332A1F] rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase font-mono text-[#8A7E6E]">
                    Current Status: <strong className="text-white">{selectedOrder.orderStatus}</strong>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedOrder.orderStatus || 'Processing'}
                    onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value as OrderStatus)}
                    className="bg-[#292219] border border-[#3D3325] text-xs text-white p-2 rounded-xs focus:outline-none"
                  >
                    {orderStatuses.map((st) => (
                      <option key={st} value={st}>
                        Update to: {st}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    placeholder="Optional tracking note or dispatch comment..."
                    className="flex-1 bg-[#141210] border border-[#2B2319] p-2 text-xs text-white placeholder-[#63594B]"
                  />
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-[10px] uppercase font-mono tracking-wider text-[#8A7E6E] mb-3">
                  Garments in this Shipment
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 bg-[#1B1814] border border-[#2B241B] rounded-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.name}
                          className="w-12 h-15 object-cover rounded-xs border border-[#2B241B]"
                        />
                        <div>
                          <div className="text-white font-medium">{it.product.name}</div>
                          <div className="text-[11px] text-[#8A7E6E] font-mono mt-0.5">
                            Color: <span className="text-white">{it.selectedColor.name}</span> · Size:{' '}
                            <span className="text-white">{it.selectedSize}</span> · Qty:{' '}
                            <span className="text-white">{it.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-white font-semibold">
                          ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#736857]">
                          ₹{it.product.price.toLocaleString('en-IN')} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer and Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#1B1814] border border-[#2B241B] rounded-xs text-xs space-y-1.5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#8A7E6E] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A354]" />
                    <span>Shipping Address</span>
                  </div>
                  <div className="text-white font-medium">{selectedOrder.address.fullName}</div>
                  <div className="text-[#A89E8F]">{selectedOrder.address.street}</div>
                  {selectedOrder.address.apartment && (
                    <div className="text-[#A89E8F]">{selectedOrder.address.apartment}</div>
                  )}
                  <div className="text-[#A89E8F]">
                    {selectedOrder.address.city}, {selectedOrder.address.state} — {selectedOrder.address.pincode}
                  </div>
                  <div className="text-[#C9A354] font-mono pt-1">
                    Phone: {selectedOrder.address.phone}
                  </div>
                  <div className="text-[#8A7E6E] font-mono">{selectedOrder.address.email}</div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-[#1B1814] border border-[#2B241B] rounded-xs text-xs space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#8A7E6E] mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#C9A354]" />
                    <span>Financial Breakdown</span>
                  </div>
                  <div className="flex justify-between text-[#8A7E6E]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#8A7E6E]">
                    <span>Shipping:</span>
                    <span className="font-mono text-white">
                      {selectedOrder.shipping === 0 ? 'Complimentary' : `₹${selectedOrder.shipping}`}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Privilege Discount:</span>
                      <span className="font-mono">-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#292219] flex justify-between text-white font-semibold text-sm">
                    <span>Total Paid / Payable:</span>
                    <span className="font-mono text-[#C9A354]">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[10px] text-[#736857] font-mono pt-1">
                    Method: {selectedOrder.address.paymentMethod.toUpperCase()} · Status:{' '}
                    {selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-[#8A7E6E] mb-3">
                    Fulfillment Activity Ledger
                  </h4>
                  <div className="space-y-2 border-l border-[#2E271F] ml-2 pl-4">
                    {selectedOrder.timeline.map((event, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C9A354]" />
                        <div className="font-mono text-white font-medium">{event.status}</div>
                        <div className="text-[10px] text-[#736857] font-mono">{event.timestamp}</div>
                        {event.note && <div className="text-[11px] text-[#A89E8F] mt-0.5">{event.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#1C1814] border-t border-[#292219] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#2B241C] text-white text-xs uppercase font-medium rounded-xs hover:bg-[#383025]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
