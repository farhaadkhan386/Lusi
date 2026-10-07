import React from 'react';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
} from 'lucide-react';
import { OrderConfirmation } from '../../types';
import { downloadInvoicePdf, numberToWordsIndian } from '../../utils/generateInvoicePdf';

interface InvoiceModalProps {
  order: OrderConfirmation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-LUSI-${order.orderId.replace(/[^0-9A-Z]/g, '') || '8941'}`;
  const awbNumber =
    order.trackingNumber ||
    `BLU-${order.orderId.replace(/[^0-9]/g, '') || '98210398'}`;
  const amountInWords = numberToWordsIndian(order.total);
  const approxGst = Math.round((order.total * 0.05) / 1.05);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadInvoicePdf(order);
  };

  return (
    <div className="fixed inset-0 z-80 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#DDD5C8] overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Toolbar (Screen only) */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-[#EAE3D8] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD5C8] flex items-center justify-center text-[#8A5A44]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-semibold text-[#171615] block">
                Tax Invoice Preview
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#787167]">
                Ref: {invoiceNumber} · Order #{order.orderId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171615] hover:bg-[#8A5A44] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs"
              title="Download PDF File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#F2EDE4] border border-[#DDD5C8] text-[#171615] text-xs font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#787167] hover:text-[#171615] hover:bg-[#F2EDE4] rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white font-sans text-xs text-[#2A2622] space-y-6">
          {/* Top Decorative Stripe */}
          <div className="h-1 bg-gradient-to-r from-[#171615] via-[#8A5A44] to-[#C9A354] rounded-full" />

          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#EAE3D8]">
            <div className="space-y-1">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#171615] block">
                LUSI
              </span>
              <span className="text-[10px] tracking-luxury uppercase font-semibold text-[#8A5A44] block">
                MODERN INDIAN ATELIER
              </span>
              <div className="text-[11px] text-[#635B51] space-y-0.5 pt-1">
                <p>Registered Office: 42, Kala Ghoda Arts Enclave, Fort, Mumbai 400001</p>
                <p>GSTIN: 27AABCL1234F1Z8 | CIN: U17299MH2026PTC384729</p>
                <p>Contact: +91-7248596540 | Email: Help@lusi.in | www.lusi.in</p>
              </div>
            </div>

            <div className="sm:text-right space-y-1 bg-[#FAF8F5] p-3.5 rounded-xs border border-[#EAE3D8] sm:min-w-[220px]">
              <span className="px-2 py-0.5 bg-[#171615] text-[#FAF8F5] text-[9px] font-mono font-semibold uppercase tracking-wider rounded-xs inline-block mb-1">
                Tax Invoice / Bill of Supply
              </span>
              <p className="font-mono text-sm font-bold text-[#171615]">{invoiceNumber}</p>
              <p className="text-[11px] text-[#635B51]">
                Invoice Date: <strong className="text-[#171615]">{order.date}</strong>
              </p>
              <p className="text-[11px] text-[#635B51]">
                Order ID: <strong className="font-mono text-[#171615]">#{order.orderId}</strong>
              </p>
            </div>
          </div>

          {/* Billed To & Logistics Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A5A44] font-semibold block">
                BILLED & SHIPPED TO:
              </span>
              <p className="font-semibold text-sm text-[#171615]">{order.address.fullName}</p>
              <p className="text-[#524B43]">{order.address.street}</p>
              {order.address.apartment && (
                <p className="text-[#524B43]">{order.address.apartment}</p>
              )}
              <p className="text-[#524B43]">
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-[11px] text-[#787167] pt-0.5">
                Phone: +91 {order.address.phone}
              </p>
              <p className="text-[10px] font-mono text-[#8F887D]">
                Place of Supply: {order.address.state} (State Code 27)
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A5A44] font-semibold block">
                PAYMENT & DISPATCH DETAILS:
              </span>
              <div className="space-y-1 text-[#524B43]">
                <div className="flex justify-between">
                  <span className="text-[#787167]">Payment Mode:</span>
                  <span className="font-mono uppercase font-semibold text-[#171615]">
                    {order.address.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787167]">Settlement Status:</span>
                  <span className="font-medium text-emerald-800">
                    {order.paymentStatus || 'Verified & Settled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787167]">Courier Partner:</span>
                  <span className="text-[#171615]">{order.courier || 'Blue Dart Express Air'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787167]">AWB Tracking No:</span>
                  <span className="font-mono text-[#171615] font-semibold">{awbNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787167]">Scheduled Arrival:</span>
                  <span className="text-[#171615]">{order.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Garment Ledger Table */}
          <div className="border border-[#EAE3D8] rounded-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE4] border-b border-[#EAE3D8] text-[10px] font-mono font-semibold uppercase text-[#524B43]">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-2 text-center">HSN</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Tax (5%)</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {order.items.map((item, idx) => {
                  const itemSubtotal = item.product.price * item.quantity;
                  const itemGst = Math.round(itemSubtotal * 0.05);

                  return (
                    <tr key={idx} className="hover:bg-[#FAF8F5]/50">
                      <td className="py-2.5 px-3 font-mono text-[#8F887D]">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-serif font-medium text-xs text-[#171615]">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-[#787167] mt-0.5">
                          {item.selectedColor.name} · Size: {item.selectedSize} · {item.product.category}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-center text-[#787167]">6204</td>
                      <td className="py-2.5 px-2 font-mono text-center font-semibold text-[#171615]">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-[#524B43]">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-[#787167]">
                        ₹{itemGst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-semibold text-[#171615]">
                        ₹{itemSubtotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Amount In Words & Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A5A44] font-semibold block">
                  AMOUNT CHARGEABLE (IN WORDS):
                </span>
                <p className="font-serif font-semibold text-xs text-[#171615] leading-relaxed">
                  {amountInWords}
                </p>
              </div>

              <div className="text-[11px] text-[#787167] space-y-1">
                <p className="font-semibold text-[#171615]">Terms & Conditions:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10.5px]">
                  <li>All luxury garments crafted with certified handlooms and natural dyes.</li>
                  <li>Complimentary 7 days doorstep returns and exchanges guaranteed.</li>
                  <li>This is a computer-generated simulated tax invoice under GST Rules 2017.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs space-y-2">
              <div className="flex justify-between text-xs text-[#635B51]">
                <span>Gross Subtotal:</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-[#635B51]">
                <span>Domestic Air Shipping:</span>
                <span className="font-mono text-emerald-800">
                  {order.shipping === 0 ? 'COMPLIMENTARY' : `₹${order.shipping}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-[#2C6228]">
                  <span>Privilege Voucher Discount:</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#787167]">
                <span>Integrated GST (5% Included):</span>
                <span className="font-mono">₹{approxGst.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-[#DDD5C8] flex justify-between items-baseline font-bold text-sm text-[#171615]">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-base text-[#8A5A44]">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Digital Signatory Stamp & Footer */}
          <div className="pt-4 border-t border-[#EAE3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10.5px] text-[#787167]">
            <div>
              <p className="font-semibold text-[#171615]">LUSI Atelier Private Limited</p>
              <p>Certified Sustainable Indian Luxury Fashion</p>
            </div>

            <div className="border border-[#DDD5C8] bg-[#FAF8F5] p-3 rounded-xs text-center sm:text-right space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-[#8A5A44] font-semibold block">
                Digitally Verified & Authenticated
              </span>
              <p className="font-serif font-semibold text-xs text-[#171615]">
                Authorised Signatory
              </p>
              <p className="text-[10px] text-[#787167]">Atelier Accounts & Finance Division, Mumbai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
