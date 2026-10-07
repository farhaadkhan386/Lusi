import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Package,
  User,
  CheckCircle2,
  Sparkles,
  Gift,
  Award,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ShoppingBag,
  Clock,
  ChevronRight,
  TrendingUp,
  Truck,
  Search,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Calendar,
  FileText,
  Phone,
  Mail,
  RefreshCw,
  Share2,
  XCircle,
  AlertOctagon,
  Ban,
  Download,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { RewardVoucher, OrderConfirmation, OrderStatus } from '../../types';
import { INITIAL_ADMIN_ORDERS } from '../../data/adminMockData';
import { fetchOrderFromFirestore } from '../../services/firestoreData';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { OrderLifecycleProgressBar } from './OrderLifecycleProgressBar';
import { downloadInvoicePdf } from '../../utils/generateInvoicePdf';
import { InvoiceModal } from './InvoiceModal';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'track' | 'history' | 'orders' | 'profile' | 'rewards';
  orderToTrackId?: string | null;
}

function getStatusBadgeConfig(status?: OrderStatus) {
  switch (status) {
    case 'Delivered':
      return {
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        label: 'Delivered',
        sub: 'Successfully received at doorstep',
      };
    case 'Shipped':
      return {
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dotClass: 'bg-blue-500 animate-pulse',
        label: 'In Transit',
        sub: 'Dispatched via Express Air',
      };
    case 'Out for Delivery':
      return {
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500 animate-pulse',
        label: 'Out for Delivery',
        sub: 'Arriving with delivery associate today',
      };
    case 'Packed':
      return {
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
        dotClass: 'bg-purple-500',
        label: 'Packed at Atelier',
        sub: 'Boxed & awaiting courier pickup',
      };
    case 'Processing':
    case 'Confirmed':
      return {
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
        dotClass: 'bg-orange-500',
        label: 'Processing',
        sub: 'Tailoring batch verification in progress',
      };
    case 'Cancelled':
      return {
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        dotClass: 'bg-rose-500',
        label: 'Cancelled',
        sub: 'Order cancelled and refund logged',
      };
    default:
      return {
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        label: 'Order Placed',
        sub: 'Order registered in Atelier database',
      };
  }
}

const REWARD_VOUCHERS: RewardVoucher[] = [
  {
    id: 'vouch-150',
    code: 'LUSIREWARD150',
    rupeeDiscount: 150,
    pointsCost: 300,
    title: '₹150 Privilege Discount',
    minSpend: 1499,
  },
  {
    id: 'vouch-300',
    code: 'LUSIREWARD300',
    rupeeDiscount: 300,
    pointsCost: 600,
    title: '₹300 Signature Discount',
    minSpend: 2499,
  },
  {
    id: 'vouch-500',
    code: 'LUSIREWARD500',
    rupeeDiscount: 500,
    pointsCost: 1000,
    title: '₹500 VIP Atelier Discount',
    minSpend: 3499,
  },
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'track',
  orderToTrackId,
}) => {
  const {
    recentOrders,
    rewardPoints,
    rewardHistory,
    redeemRewardVoucher,
    couponCode,
    setIsCartOpen,
    addToCart,
    trackingOrderId,
    setTrackingOrderId,
    cancelOrder,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'track' | 'history' | 'rewards' | 'profile'>(
    initialTab === 'orders' || initialTab === 'history' ? 'history' : (initialTab as any) || 'track'
  );
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; success: boolean } | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Track My Order State
  const [trackedOrder, setTrackedOrder] = useState<OrderConfirmation | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isSearchingOrder, setIsSearchingOrder] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | 'in_transit' | 'delivered'>('all');

  // Cancel Order State
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderBeingCancelled, setOrderBeingCancelled] = useState<OrderConfirmation | null>(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [cancelCustomNote, setCancelCustomNote] = useState('');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [cancelSuccessNotice, setCancelSuccessNotice] = useState<string | null>(null);
  const [cancelErrorNotice, setCancelErrorNotice] = useState<string | null>(null);

  // Purchase History State
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [expandedReceiptOrderId, setExpandedReceiptOrderId] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<{ orderId: string; message: string } | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderConfirmation | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceNotice, setInvoiceNotice] = useState<{ orderId: string; message: string } | null>(null);

  // Unified Order List (recent placed orders + sample orders for instant testing)
  const displayOrders = useMemo(() => {
    const list = [...recentOrders];
    INITIAL_ADMIN_ORDERS.forEach((demo) => {
      if (!list.some((o) => o.orderId === demo.orderId)) {
        list.push(demo);
      }
    });
    return list;
  }, [recentOrders]);

  // Filtered orders for Purchase History tab
  const filteredHistoryOrders = useMemo(() => {
    return displayOrders.filter((ord) => {
      if (orderFilter === 'in_transit') {
        if (ord.orderStatus === 'Delivered' || ord.orderStatus === 'Cancelled') return false;
      } else if (orderFilter === 'delivered') {
        if (ord.orderStatus !== 'Delivered') return false;
      }

      if (historySearchQuery.trim()) {
        const q = historySearchQuery.toLowerCase().trim();
        const matchesId = ord.orderId.toLowerCase().includes(q);
        const matchesDate = ord.date.toLowerCase().includes(q);
        const matchesCity = ord.address.city.toLowerCase().includes(q);
        const matchesProducts = ord.items.some((item) =>
          item.product.name.toLowerCase().includes(q) ||
          item.product.category.toLowerCase().includes(q) ||
          item.product.subcategory.toLowerCase().includes(q) ||
          item.selectedColor.name.toLowerCase().includes(q)
        );
        return matchesId || matchesDate || matchesCity || matchesProducts;
      }

      return true;
    });
  }, [displayOrders, orderFilter, historySearchQuery]);

  const handleReorderItems = (order: OrderConfirmation) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.selectedColor, item.selectedSize, item.quantity);
    });
    setReorderNotice({
      orderId: order.orderId,
      message: `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'} added to your bag.`,
    });
    setTimeout(() => setReorderNotice(null), 4000);
  };

  const handleDownloadInvoice = (order: OrderConfirmation) => {
    downloadInvoicePdf(order);
    setInvoiceNotice({
      orderId: order.orderId,
      message: `Tax Invoice for Order #${order.orderId} generated and downloaded as PDF.`,
    });
    setTimeout(() => setInvoiceNotice(null), 5000);
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  // Sync initialTab and target order when opened
  useEffect(() => {
    if (!isOpen) return;

    if (initialTab) {
      setActiveTab(
        initialTab === 'orders' || initialTab === 'history' ? 'history' : (initialTab as any)
      );
    }

    const targetId = orderToTrackId || trackingOrderId;
    if (targetId) {
      const match = displayOrders.find(
        (o) => o.orderId.toLowerCase() === targetId.toLowerCase()
      );
      if (match) {
        setTrackedOrder(match);
        setActiveTab('track');
        return;
      }
    }

    // Default to latest order if none chosen and on track tab
    if (!trackedOrder && displayOrders.length > 0) {
      setTrackedOrder(displayOrders[0]);
    }
  }, [isOpen, initialTab, orderToTrackId, trackingOrderId, displayOrders]);

  const handleSearchOrder = async (queryTerm?: string) => {
    const rawTerm = (queryTerm ?? orderSearchQuery).trim();
    if (!rawTerm) return;

    setIsSearchingOrder(true);
    setSearchError(null);

    // 1. Check local order list first
    const cleanTerm = rawTerm.toLowerCase();
    const localMatch = displayOrders.find(
      (o) =>
        o.orderId.toLowerCase() === cleanTerm ||
        o.orderId.toLowerCase().includes(cleanTerm) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(cleanTerm))
    );

    if (localMatch) {
      setTrackedOrder(localMatch);
      setActiveTab('track');
      setIsSearchingOrder(false);
      return;
    }

    // 2. Query live Firestore database directly
    try {
      const remoteOrder = await fetchOrderFromFirestore(rawTerm);
      if (remoteOrder) {
        setTrackedOrder(remoteOrder);
        setActiveTab('track');
      } else {
        setSearchError(
          `No order matching "${rawTerm}" was found. Please check your order ID or select one of the recent purchases below.`
        );
      }
    } catch {
      setSearchError('Unable to connect to order tracking service. Please try again.');
    } finally {
      setIsSearchingOrder(false);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2500);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshingTelemetry(true);
    setTimeout(() => {
      setIsRefreshingTelemetry(false);
      setRefreshNotice('Telemetry synced with carrier partner just now.');
      setTimeout(() => setRefreshNotice(null), 3000);
    }, 800);
  };

  const handleSelectRecentPurchaseToTrack = (order: OrderConfirmation) => {
    setTrackedOrder(order);
    if (setTrackingOrderId) setTrackingOrderId(order.orderId);
    setActiveTab('track');
    setSearchError(null);
  };

  const handleInitiateCancel = (order: OrderConfirmation) => {
    setOrderBeingCancelled(order);
    setCancelReason('Changed my mind');
    setCancelCustomNote('');
    setCancelErrorNotice(null);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    const targetOrder = orderBeingCancelled || trackedOrder;
    if (!targetOrder) return;

    setIsCancellingOrder(true);
    setCancelErrorNotice(null);

    try {
      const fullReason = cancelCustomNote.trim()
        ? `${cancelReason}: ${cancelCustomNote.trim()}`
        : cancelReason;

      const res = await cancelOrder(targetOrder.orderId, fullReason);

      if (res.success) {
        const cancellationTimestamp = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        const newTimelineEntry = {
          status: 'Cancelled' as const,
          timestamp: cancellationTimestamp,
          note: `Customer cancellation: ${fullReason}`,
        };

        if (trackedOrder?.orderId === targetOrder.orderId) {
          setTrackedOrder((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              orderStatus: 'Cancelled',
              paymentStatus: prev.paymentStatus === 'Paid' ? 'Refunded' : prev.paymentStatus,
              timeline: prev.timeline ? [...prev.timeline, newTimelineEntry] : [newTimelineEntry],
            };
          });
        }

        setCancelSuccessNotice(res.message);
        setIsCancelDialogOpen(false);
        setOrderBeingCancelled(null);
        setCancelCustomNote('');
      } else {
        setCancelErrorNotice(res.message);
      }
    } catch (err: any) {
      setCancelErrorNotice(err?.message || 'Failed to cancel order. Please contact concierge support.');
    } finally {
      setIsCancellingOrder(false);
    }
  };

  if (!isOpen) return null;

  // Tier calculation
  const isGoldTier = rewardPoints >= 1000;
  const isPlatinumTier = rewardPoints >= 2500;
  const tierName = isPlatinumTier
    ? 'Platinum Atelier'
    : isGoldTier
    ? 'Gold Privilege'
    : 'Silver Member';

  const nextTierPoints = isGoldTier ? 2500 : 1000;
  const prevTierThreshold = isGoldTier ? 1000 : 0;
  const progressPercent = Math.min(
    100,
    Math.max(5, ((rewardPoints - prevTierThreshold) / (nextTierPoints - prevTierThreshold)) * 100)
  );

  const handleRedeem = (voucher: RewardVoucher) => {
    const result = redeemRewardVoucher(
      voucher.pointsCost,
      voucher.rupeeDiscount,
      voucher.code,
      voucher.title
    );
    setFeedbackMessage({ text: result.message, success: result.success });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE3D8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#DDD5C8] flex items-center justify-center text-[#8A5A44]">
              <Truck className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-medium text-[#171615] block">
                  LUSI Customer Portal
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-[#FAF8F5] border border-[#E2D8CB] text-[10px] font-mono uppercase tracking-wider text-[#8A5A44] rounded-xs font-semibold">
                  Atelier Concierge
                </span>
              </div>
              <span className="text-[11px] text-[#787167] tracking-wider uppercase block">
                Track My Order & Privilege Account
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Account Modal"
            className="p-1.5 text-[#666056] hover:text-[#171615] hover:bg-[#F2EDE4] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.6]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE3D8] bg-[#F2EDE4] px-3 sm:px-6 text-xs font-semibold uppercase tracking-wider shrink-0 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`py-3.5 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'track'
                ? 'border-[#171615] text-[#171615] bg-[#FAF8F5]'
                : 'border-transparent text-[#787167] hover:text-[#171615]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#8A5A44]" />
            <span>Track My Order</span>
            <span className="px-1.5 py-0.5 bg-[#8A5A44] text-white text-[9px] font-mono rounded-xs">
              Live
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#171615] text-[#171615] bg-[#FAF8F5]'
                : 'border-transparent text-[#787167] hover:text-[#171615]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Purchase History ({displayOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`py-3.5 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-[#171615] text-[#171615] bg-[#FAF8F5]'
                : 'border-transparent text-[#787167] hover:text-[#171615]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8A5A44]" />
            <span>Rewards ({rewardPoints} pts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#171615] text-[#171615] bg-[#FAF8F5]'
                : 'border-transparent text-[#787167] hover:text-[#171615]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Care</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TRACK MY ORDER (DEDICATED TELEMETRY DASHBOARD) */}
          {activeTab === 'track' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* 1. Recent Purchases Quick-Select Rail */}
              {displayOrders.length > 0 && (
                <div className="p-3.5 sm:p-4 bg-white border border-[#EAE3D8] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#8A5A44]" />
                      <h4 className="text-[11px] font-semibold uppercase tracking-luxury text-[#171615]">
                        YOUR RECENT PURCHASES
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#787167] uppercase font-mono">
                      Select to View Live Progress
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {displayOrders.slice(0, 3).map((ord) => {
                      const isSelected = trackedOrder?.orderId === ord.orderId;
                      const statusCfg = getStatusBadgeConfig(ord.orderStatus);

                      return (
                        <button
                          key={ord.orderId}
                          type="button"
                          onClick={() => handleSelectRecentPurchaseToTrack(ord)}
                          className={`p-2.5 text-left rounded-xs border transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF8F5] border-[#8A5A44] shadow-xs ring-1 ring-[#8A5A44]'
                              : 'bg-white border-[#EAE3D8] hover:border-[#8A5A44] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {/* First Item Thumbnail */}
                          <div className="w-10 h-12 bg-[#FAF8F5] border border-[#DDD5C8] rounded-xs overflow-hidden shrink-0">
                            {ord.items[0]?.product?.images?.[0] ? (
                              <ImageWithFallback
                                src={ord.items[0].product.images[0]}
                                alt={ord.items[0].product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#A69E92]">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-[#171615] truncate">
                                #{ord.orderId}
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-[#8A5A44]" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-xs border ${statusCfg.badgeClass}`}
                              >
                                {statusCfg.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#787167] font-mono mt-0.5 truncate">
                              ₹{ord.total.toLocaleString('en-IN')} · {ord.items.length}{' '}
                              {ord.items.length === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Order Search & Test ID Lookup */}
              <div className="p-3.5 sm:p-4 bg-white border border-[#EAE3D8] rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#8A5A44]" />
                    <h4 className="text-[11px] font-semibold uppercase tracking-luxury text-[#171615]">
                      TRACK BY ORDER ID OR AWB NUMBER
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#8F887D] font-mono uppercase">
                    Pan-India Telemetry
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchOrder();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#998E80] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => {
                        setOrderSearchQuery(e.target.value);
                        if (searchError) setSearchError(null);
                      }}
                      placeholder="Enter Order ID (e.g. LUSI-ORD-8939) or Courier AWB..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD5C8] rounded-xs text-xs text-[#171615] placeholder-[#998E80] focus:outline-none focus:border-[#171615]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingOrder}
                    className="px-5 py-2.5 bg-[#171615] hover:bg-[#8A5A44] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isSearchingOrder ? 'Searching...' : 'Track'}
                  </button>
                </form>

                {searchError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{searchError}</span>
                  </div>
                )}

                {/* Quick Test Chips for Verification */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#787167]">
                  <span className="text-[10px] uppercase font-mono text-[#8A5A44] font-medium">
                    Try Sample Orders:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSearchOrder('LUSI-ORD-8939')}
                    className="px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#EAE3D8] border border-[#D9D1C5] rounded-xs text-[10px] font-mono transition-colors text-[#171615] cursor-pointer"
                  >
                    #LUSI-ORD-8939 (In Transit)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchOrder('LUSI-ORD-8941')}
                    className="px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#EAE3D8] border border-[#D9D1C5] rounded-xs text-[10px] font-mono transition-colors text-[#171615] cursor-pointer"
                  >
                    #LUSI-ORD-8941 (Tailoring QA)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchOrder('LUSI-ORD-8938')}
                    className="px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#EAE3D8] border border-[#D9D1C5] rounded-xs text-[10px] font-mono transition-colors text-[#171615] cursor-pointer"
                  >
                    #LUSI-ORD-8938 (Delivered)
                  </button>
                </div>
              </div>

              {/* 3. The Active Order Tracking Telemetry Dashboard */}
              {trackedOrder ? (
                <div className="space-y-4">
                  {(() => {
                    const statusConfig = getStatusBadgeConfig(trackedOrder.orderStatus);
                    const awbNumber =
                      trackedOrder.trackingNumber ||
                      `BLU-${trackedOrder.orderId.replace(/[^0-9]/g, '') || '98210398'}`;

                    return (
                      <div className="p-5 bg-white border border-[#EAE3D8] rounded-xs space-y-5">
                        {/* Status Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE1]">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-mono text-lg font-bold text-[#171615]">
                                Order #{trackedOrder.orderId}
                              </h3>
                              <button
                                type="button"
                                onClick={() => handleCopyOrderId(trackedOrder.orderId)}
                                title="Copy Order ID"
                                className="text-[#8A5A44] hover:text-[#171615] transition-colors p-1"
                              >
                                {copiedOrderId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold border rounded-xs uppercase tracking-wider ${statusConfig.badgeClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-[#787167] mt-1 font-light">
                              Booked on {trackedOrder.date} · Expected Delivery by{' '}
                              <strong className="text-[#171615] font-semibold">
                                {trackedOrder.estimatedDelivery}
                              </strong>
                            </p>
                          </div>

                          {/* Courier & AWB Telemetry Pill */}
                          <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs text-xs space-y-1 sm:text-right">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-[#8A5A44] font-medium flex items-center sm:justify-end gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{trackedOrder.courier || 'Blue Dart Express Air'}</span>
                            </div>
                            <div className="flex items-center sm:justify-end gap-2 font-mono text-[11px] text-[#171615]">
                              <span>AWB: {awbNumber}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyTracking(awbNumber)}
                                title="Copy Tracking Number"
                                className="text-[#8A5A44] hover:text-[#171615] transition-colors cursor-pointer"
                              >
                                {copiedTracking ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Success Notice if Order was Cancelled */}
                        {cancelSuccessNotice && (
                          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xs flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{cancelSuccessNotice}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCancelSuccessNotice(null)}
                              className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Order Cancellation & Dispatch Status Banner */}
                        {(() => {
                          const isShippedOrBeyond =
                            trackedOrder.orderStatus === 'Shipped' ||
                            trackedOrder.orderStatus === 'Out for Delivery' ||
                            trackedOrder.orderStatus === 'Delivered';
                          const isCancelled = trackedOrder.orderStatus === 'Cancelled';
                          const canCancel = !isShippedOrBeyond && !isCancelled;

                          if (isCancelled) {
                            return (
                              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xs flex items-center justify-between gap-3 text-xs text-rose-800 animate-in fade-in">
                                <div className="flex items-center gap-2.5">
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <div>
                                    <span className="font-semibold text-rose-900">Order Cancelled</span>
                                    <p className="text-[11px] text-rose-700 mt-0.5">
                                      This purchase was cancelled prior to dispatch. Any collected payment is scheduled for 100% refund.
                                    </p>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 bg-rose-200/70 border border-rose-300 text-rose-900 text-[10px] font-mono font-semibold uppercase rounded-xs shrink-0">
                                  Cancelled
                                </span>
                              </div>
                            );
                          }

                          if (canCancel) {
                            return (
                              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-start sm:items-center gap-2.5 text-[#524B43]">
                                  <AlertCircle className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5 sm:mt-0" />
                                  <div>
                                    <span className="font-semibold text-[#171615]">Pending Dispatch:</span>{' '}
                                    <span className="text-[#635B51]">
                                      This order is currently being prepared at the Atelier and can be cancelled online before courier handover.
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleInitiateCancel(trackedOrder)}
                                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 hover:text-rose-800 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Cancel Order</span>
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#635B51]">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                                <span>
                                  {trackedOrder.orderStatus === 'Delivered'
                                    ? 'Package successfully delivered. Covered under our 7-day doorstep return and exchange policy.'
                                    : 'Package has been dispatched via air courier. Online cancellation is closed once an order is marked as Shipped.'}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono uppercase text-[#8F887D] self-end sm:self-auto font-medium">
                                {trackedOrder.orderStatus === 'Delivered' ? 'Fulfilled' : 'Dispatched'}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Location Notice & Telemetry Refresh */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs text-xs">
                          <div className="flex items-center gap-2 text-[#524B43]">
                            <MapPin className="w-4 h-4 text-[#8A5A44] shrink-0" />
                            <div>
                              <span className="font-medium text-[#171615]">Current Location: </span>
                              <span>
                                {trackedOrder.currentLocation ||
                                  (trackedOrder.orderStatus === 'Delivered'
                                    ? `Delivered at ${trackedOrder.address.city} Residence`
                                    : trackedOrder.orderStatus === 'Shipped'
                                    ? `In Transit to ${trackedOrder.address.city} Central Hub`
                                    : 'Atelier Mumbai Dispatch Facility')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {refreshNotice && (
                              <span className="text-[10px] text-emerald-700 font-medium animate-in fade-in">
                                {refreshNotice}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={handleRefreshTelemetry}
                              disabled={isRefreshingTelemetry}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#F2EDE4] border border-[#DDD5C8] rounded-xs text-[10px] uppercase font-mono tracking-wider text-[#635B51] hover:text-[#171615] transition-all cursor-pointer"
                            >
                              <RefreshCw
                                className={`w-3 h-3 text-[#8A5A44] ${
                                  isRefreshingTelemetry ? 'animate-spin' : ''
                                }`}
                              />
                              <span>{isRefreshingTelemetry ? 'Pinging...' : 'Sync Live'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Visual Lifecycle Progress Bar Component */}
                        <OrderLifecycleProgressBar order={trackedOrder} />

                        {/* Activity Timeline Ledger */}
                        <div className="pt-2 border-t border-[#F0ECE1]">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-semibold uppercase font-mono tracking-wider text-[#8A5A44]">
                              ACTIVITY TIMELINE
                            </h4>
                            <span className="text-[10px] text-[#8F887D]">
                              Chronological Courier Scans
                            </span>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            {(trackedOrder.timeline && trackedOrder.timeline.length > 0
                              ? trackedOrder.timeline
                              : [
                                  {
                                    status: trackedOrder.orderStatus || 'New',
                                    timestamp: trackedOrder.date,
                                    note: `Order registered and dispatched via ${
                                      trackedOrder.courier || 'Blue Dart Air'
                                    }`,
                                  },
                                ]
                            ).map((entry, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 p-2.5 bg-[#FAF8F5] border border-[#F0ECE1] rounded-xs"
                              >
                                <div className="w-2 h-2 rounded-full bg-[#8A5A44] shrink-0 mt-1.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <span className="font-semibold text-[#171615]">
                                      {entry.status}
                                    </span>
                                    <span className="text-[10px] text-[#8F887D] font-mono">
                                      {entry.timestamp}
                                    </span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-[11px] text-[#6E675E] mt-0.5">
                                      {entry.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Package Garment Items */}
                        <div className="pt-2 border-t border-[#F0ECE1]">
                          <h4 className="text-[10px] font-semibold uppercase font-mono tracking-wider text-[#8A5A44] mb-3">
                            PACKAGE ITEMS ({trackedOrder.items.length})
                          </h4>
                          <div className="divide-y divide-[#F2ECE1]">
                            {trackedOrder.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-14 bg-[#EAE3D8] rounded-xs overflow-hidden shrink-0 border border-[#DDD5C8]">
                                    <ImageWithFallback
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-[#171615] text-xs">
                                      {item.product.name}
                                    </h5>
                                    <div className="text-[11px] text-[#787167] flex items-center gap-2 mt-0.5">
                                      <span className="flex items-center gap-1">
                                        <span
                                          className="w-2 h-2 rounded-full inline-block border border-black/20"
                                          style={{ backgroundColor: item.selectedColor.hex }}
                                        />
                                        {item.selectedColor.name}
                                      </span>
                                      <span>·</span>
                                      <span>Size: {item.selectedSize}</span>
                                      <span>·</span>
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                                <span className="font-mono font-medium text-xs text-[#171615]">
                                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Address & Financial Summary Grid */}
                        <div className="pt-2 border-t border-[#F0ECE1] grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1] rounded-xs">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A5A44] block mb-1.5 font-medium">
                              DELIVERY ADDRESS
                            </span>
                            <div className="text-xs text-[#524B43] space-y-0.5">
                              <p className="font-semibold text-[#171615]">
                                {trackedOrder.address.fullName}
                              </p>
                              <p>{trackedOrder.address.street}</p>
                              {trackedOrder.address.apartment && (
                                <p>{trackedOrder.address.apartment}</p>
                              )}
                              <p>
                                {trackedOrder.address.city}, {trackedOrder.address.state} —{' '}
                                {trackedOrder.address.pincode}
                              </p>
                              <p className="text-[11px] text-[#787167] pt-1">
                                Phone: +91 {trackedOrder.address.phone}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1] rounded-xs">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A5A44] block mb-1.5 font-medium">
                              PAYMENT & INVOICE SUMMARY
                            </span>
                            <div className="text-xs text-[#524B43] space-y-1">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-mono">
                                  ₹{trackedOrder.subtotal.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Domestic Dispatch:</span>
                                <span className="font-mono text-emerald-800">
                                  {trackedOrder.shipping === 0
                                    ? 'COMPLIMENTARY'
                                    : `₹${trackedOrder.shipping}`}
                                </span>
                              </div>
                              {trackedOrder.discount > 0 && (
                                <div className="flex justify-between text-[#2C6228]">
                                  <span>Privilege Discount:</span>
                                  <span className="font-mono">
                                    -₹{trackedOrder.discount.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-[#171615] pt-1 border-t border-[#EAE3D8]">
                                <span>Total Payable:</span>
                                <span className="font-mono text-sm">
                                  ₹{trackedOrder.total.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="pt-1 text-[11px] text-[#787167] flex items-center justify-between">
                                <span>
                                  Payment:{' '}
                                  {trackedOrder.address.paymentMethod.toUpperCase()}
                                </span>
                                <span className="text-emerald-700 font-medium">
                                  {trackedOrder.paymentStatus || 'Verified'}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-[#EAE3D8] flex items-center justify-between">
                                <span className="text-[10px] text-[#787167]">Tax Invoice (PDF)</span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(trackedOrder)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#F2EDE4] border border-[#DDD5C8] text-[#171615] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3 h-3 text-[#8A5A44]" />
                                  <span>Download Invoice</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Customer Support Footer Bar */}
                        <div className="pt-2 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#787167]">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#8A5A44]" />
                              <span>+91-7248596540</span>
                            </span>
                            <span>·</span>
                            <a
                              href={`mailto:Help@lusi.in?subject=Tracking%20Query%20Order%20${trackedOrder.orderId}`}
                              className="text-[#8A5A44] hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Help@lusi.in</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#8A5A44] font-medium">
                              7 Days Doorstep Return & Exchange Guaranteed
                            </span>
                            {trackedOrder.orderStatus !== 'Shipped' &&
                              trackedOrder.orderStatus !== 'Out for Delivery' &&
                              trackedOrder.orderStatus !== 'Delivered' &&
                              trackedOrder.orderStatus !== 'Cancelled' && (
                                <>
                                  <span>·</span>
                                  <button
                                    type="button"
                                    onClick={() => handleInitiateCancel(trackedOrder)}
                                    className="text-[11px] text-rose-700 hover:text-rose-900 font-medium underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    <span>Cancel this order</span>
                                  </button>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-8 bg-white border border-[#EAE3D8] rounded-xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#DDD5C8] flex items-center justify-center text-[#8A5A44] mx-auto">
                    <Truck className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif text-base font-medium text-[#171615]">
                    No Order Selected for Tracking
                  </h4>
                  <p className="text-xs text-[#787167] max-w-sm mx-auto font-light">
                    Select one of your recent purchases above or enter an Order ID / Courier AWB
                    number to view live status.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PURCHASE HISTORY (ORDER DATES, PRODUCT NAMES, TOTAL AMOUNTS) */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Lifetime Purchases Summary Strip */}
              <div className="p-4 bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#EAE3D8] rounded-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8A5A44]" />
                    <h3 className="font-serif text-base font-semibold text-[#171615]">
                      Purchase History
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#DDD5C8] text-[#8A5A44] rounded-xs font-semibold">
                      {displayOrders.length} {displayOrders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                  </div>
                  <p className="text-xs text-[#787167] mt-0.5 font-light">
                    Past orders placed with LUSI, itemized garments, settled totals, and verified receipts.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-[#787167] uppercase block">Lifetime Value</span>
                    <strong className="text-sm font-bold text-[#171615]">
                      ₹{displayOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="h-8 w-px bg-[#EAE3D8]" />
                  <div className="text-right">
                    <span className="text-[10px] text-[#787167] uppercase block">Total Garments</span>
                    <strong className="text-sm font-bold text-[#8A5A44]">
                      {displayOrders.reduce(
                        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
                        0
                      )}{' '}
                      Pcs
                    </strong>
                  </div>
                </div>
              </div>

              {/* Reorder Toast Notice */}
              {reorderNotice && (
                <div className="p-3 bg-[#EBF3EA] border border-[#B7DEB2] text-[#2C6228] text-xs rounded-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{reorderNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCartOpen(true);
                    }}
                    className="underline font-semibold hover:text-black whitespace-nowrap cursor-pointer"
                  >
                    View Shopping Bag →
                  </button>
                </div>
              )}

              {/* Invoice Download Toast Notice */}
              {invoiceNotice && (
                <div className="p-3 bg-[#EBF3EA] border border-[#B7DEB2] text-[#2C6228] text-xs rounded-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{invoiceNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="underline font-semibold hover:text-black whitespace-nowrap cursor-pointer"
                  >
                    View Invoice Preview →
                  </button>
                </div>
              )}

              {/* Filter Pills & Product Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                      orderFilter === 'all'
                        ? 'bg-[#171615] text-[#FAF8F5]'
                        : 'bg-white text-[#787167] border border-[#EAE3D8] hover:text-[#171615]'
                    }`}
                  >
                    All Purchases ({displayOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('in_transit')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                      orderFilter === 'in_transit'
                        ? 'bg-[#171615] text-[#FAF8F5]'
                        : 'bg-white text-[#787167] border border-[#EAE3D8] hover:text-[#171615]'
                    }`}
                  >
                    In Transit / Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                      orderFilter === 'delivered'
                        ? 'bg-[#171615] text-[#FAF8F5]'
                        : 'bg-white text-[#787167] border border-[#EAE3D8] hover:text-[#171615]'
                    }`}
                  >
                    Delivered
                  </button>
                </div>

                {/* Search input for past purchases */}
                <div className="relative min-w-[220px] sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#998E80] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search product names, Order ID..."
                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DDD5C8] rounded-xs text-xs text-[#171615] placeholder-[#998E80] focus:outline-none focus:border-[#171615]"
                  />
                  {historySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHistorySearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#998E80] hover:text-[#171615] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {filteredHistoryOrders.length === 0 ? (
                  <div className="p-8 bg-white border border-[#EAE3D8] rounded-xs text-center space-y-2">
                    <p className="text-xs text-[#787167]">
                      No purchases match your criteria &quot;{historySearchQuery}&quot;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHistorySearchQuery('');
                        setOrderFilter('all');
                      }}
                      className="text-xs text-[#8A5A44] font-medium underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredHistoryOrders.map((ord) => {
                    const statusConfig = getStatusBadgeConfig(ord.orderStatus);
                    const isReceiptOpen = expandedReceiptOrderId === ord.orderId;

                    return (
                      <div
                        key={ord.orderId}
                        className="bg-white border border-[#EAE3D8] rounded-xs shadow-2xs hover:border-[#C4B7A5] transition-all overflow-hidden"
                      >
                        {/* 1. Order Header: Date, ID, Status Badge */}
                        <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border-b border-[#EAE3D8] flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs sm:text-sm font-bold text-[#171615]">
                                Order #{ord.orderId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyOrderId(ord.orderId)}
                                title="Copy Order ID"
                                className="text-[#8A5A44] hover:text-[#171615] transition-colors p-0.5 cursor-pointer"
                              >
                                {copiedOrderId === ord.orderId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {/* ORDER DATE */}
                            <div className="flex items-center gap-1.5 text-xs text-[#635B51]">
                              <Calendar className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                              <span>
                                Order Date:{' '}
                                <strong className="text-[#171615] font-semibold">{ord.date}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold border rounded-xs uppercase tracking-wider ${statusConfig.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* 2. PRODUCT NAMES & ITEMS LIST */}
                        <div className="p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A5A44] font-semibold">
                              ORDERED PRODUCTS ({ord.items.length}{' '}
                              {ord.items.length === 1 ? 'Item' : 'Items'})
                            </span>
                            <span className="text-[10px] text-[#787167] font-mono">
                              Delivery to {ord.address.city}
                            </span>
                          </div>

                          <div className="divide-y divide-[#F2ECE1]">
                            {ord.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {/* Product Thumbnail */}
                                  <div className="w-12 h-14 bg-[#FAF8F5] border border-[#DDD5C8] rounded-xs overflow-hidden shrink-0">
                                    <ImageWithFallback
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    {/* PRODUCT NAME */}
                                    <h4 className="font-serif text-sm font-medium text-[#171615] leading-snug">
                                      {item.product.name}
                                    </h4>

                                    {/* Product Details (Category, Color, Size, Quantity) */}
                                    <div className="text-[11px] text-[#787167] flex flex-wrap items-center gap-2 mt-0.5">
                                      <span className="text-[#8A5A44] font-medium">
                                        {item.product.category}
                                      </span>
                                      <span>·</span>
                                      <span className="flex items-center gap-1">
                                        <span
                                          className="w-2 h-2 rounded-full inline-block border border-black/20"
                                          style={{ backgroundColor: item.selectedColor.hex }}
                                        />
                                        {item.selectedColor.name}
                                      </span>
                                      <span>·</span>
                                      <span>
                                        Size: <strong className="text-[#171615]">{item.selectedSize}</strong>
                                      </span>
                                      <span>·</span>
                                      <span>
                                        Qty: <strong className="text-[#171615]">{item.quantity}</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Item Price Subtotal & Item-Level Download Invoice Action */}
                                <div className="text-right sm:self-center self-end shrink-0 flex flex-col items-end gap-1">
                                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#171615] block">
                                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-[10px] text-[#8F887D] font-mono block">
                                      (₹{item.product.price.toLocaleString('en-IN')} each)
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadInvoice(ord)}
                                    className="inline-flex items-center gap-1 text-[10px] text-[#8A5A44] hover:text-[#171615] hover:underline transition-colors cursor-pointer font-medium"
                                    title={`Download Invoice for ${item.product.name}`}
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download Invoice</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. TOTAL AMOUNT & ORDER SUMMARY BAR */}
                        <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border-t border-[#EAE3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[11px] uppercase tracking-wider text-[#787167] font-medium">
                                Total Amount:
                              </span>
                              {/* TOTAL AMOUNT */}
                              <span className="font-serif text-base sm:text-lg font-bold text-[#171615] font-mono">
                                ₹{ord.total.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[11px] text-[#787167] font-mono">
                                (All taxes & delivery included)
                              </span>
                            </div>
                            <p className="text-[11px] text-[#635B51] font-light">
                              Settled via{' '}
                              <span className="uppercase font-medium text-[#171615]">
                                {ord.address.paymentMethod}
                              </span>{' '}
                              · Target Delivery: {ord.estimatedDelivery}
                            </p>
                          </div>

                          {/* Quick Actions: Track, Reorder, Receipt, Download Invoice, Cancel */}
                          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleSelectRecentPurchaseToTrack(ord)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171615] hover:bg-[#8A5A44] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Order</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(ord)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#DDD5C8] hover:border-[#8A5A44] text-[#171615] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs"
                              title="Download Simulated PDF Tax Invoice"
                            >
                              <Download className="w-3.5 h-3.5 text-[#8A5A44]" />
                              <span>Download Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorderItems(ord)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#DDD5C8] text-[#171615] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                              title="Add all garments from this order to your bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#8A5A44]" />
                              <span>Reorder</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedReceiptOrderId(isReceiptOpen ? null : ord.orderId)
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#DDD5C8] text-[#635B51] hover:text-[#171615] text-[10px] font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isReceiptOpen ? 'Hide Receipt' : 'Receipt'}</span>
                            </button>

                            {ord.orderStatus !== 'Shipped' &&
                              ord.orderStatus !== 'Out for Delivery' &&
                              ord.orderStatus !== 'Delivered' &&
                              ord.orderStatus !== 'Cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => handleInitiateCancel(ord)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 hover:text-rose-800 text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                                  title="Cancel this order before courier dispatch"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Cancel</span>
                                </button>
                              )}
                          </div>
                        </div>

                        {/* 4. EXPANDABLE ITEMIZED RECEIPT DRAWER */}
                        {isReceiptOpen && (
                          <div className="p-4 bg-white border-t border-[#DDD5C8] text-xs space-y-3 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                              <span className="font-mono text-[11px] font-semibold text-[#171615] uppercase tracking-wider">
                                Order Receipt & Delivery Breakdown
                              </span>
                              <span className="font-mono text-[10px] text-[#787167]">
                                Ref: {ord.orderId}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-2.5 bg-[#FAF8F5] border border-[#F0ECE1] rounded-xs space-y-1">
                                <span className="text-[10px] font-mono uppercase text-[#8A5A44] font-semibold block">
                                  Shipping Address
                                </span>
                                <p className="font-semibold text-[#171615]">
                                  {ord.address.fullName}
                                </p>
                                <p className="text-[11px] text-[#635B51]">{ord.address.street}</p>
                                {ord.address.apartment && (
                                  <p className="text-[11px] text-[#635B51]">{ord.address.apartment}</p>
                                )}
                                <p className="text-[11px] text-[#635B51]">
                                  {ord.address.city}, {ord.address.state} — {ord.address.pincode}
                                </p>
                                <p className="text-[11px] text-[#787167]">
                                  Phone: +91 {ord.address.phone}
                                </p>
                              </div>

                              <div className="p-2.5 bg-[#FAF8F5] border border-[#F0ECE1] rounded-xs space-y-1">
                                <span className="text-[10px] font-mono uppercase text-[#8A5A44] font-semibold block">
                                  Price Breakdown
                                </span>
                                <div className="flex justify-between text-[11px] text-[#635B51]">
                                  <span>Subtotal:</span>
                                  <span className="font-mono">
                                    ₹{ord.subtotal.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[11px] text-[#635B51]">
                                  <span>Domestic Dispatch:</span>
                                  <span className="font-mono text-emerald-800">
                                    {ord.shipping === 0 ? 'COMPLIMENTARY' : `₹${ord.shipping}`}
                                  </span>
                                </div>
                                {ord.discount > 0 && (
                                  <div className="flex justify-between text-[11px] text-[#2C6228]">
                                    <span>Privilege Discount:</span>
                                    <span className="font-mono">
                                      -₹{ord.discount.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold text-[#171615] pt-1 border-t border-[#EAE3D8]">
                                  <span>Total Settled:</span>
                                  <span className="font-mono">
                                    ₹{ord.total.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0ECE1]">
                              <span className="text-[10px] text-[#787167]">
                                Official GST Tax Invoice with itemized HSN codes & digital verification stamp.
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoice(ord)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#171615] hover:bg-[#8A5A44] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Tax Invoice (PDF)</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LUSI REWARDS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Rewards Summary Luxury Card */}
              <div className="bg-gradient-to-br from-[#1E1C1A] to-[#121110] text-[#EDE7DD] p-5 sm:p-6 rounded-xs shadow-md border border-[#2E2B27] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-[#8A5A44]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2C2926]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-[#C9A354]" />
                      <span className="text-[10px] font-mono tracking-widest text-[#D6CEBF] uppercase">
                        {tierName}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                      {rewardPoints.toLocaleString('en-IN')}{' '}
                      <span className="text-sm font-sans tracking-wide text-[#A8A095]">
                        Points Earned
                      </span>
                    </h3>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-[#A0988E] block uppercase tracking-wider">
                      Redeemable Value
                    </span>
                    <span className="font-serif text-xl sm:text-2xl text-[#C9A354] font-medium font-mono">
                      ₹{Math.floor(rewardPoints / 2).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#8C8478] block">
                      (100 Points = ₹50 Instant Bag Discount)
                    </span>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="pt-4">
                  <div className="flex justify-between text-[11px] text-[#A8A095] mb-1.5 font-light">
                    <span>Current: {tierName}</span>
                    <span>
                      {rewardPoints >= 2500
                        ? 'Highest Tier Achieved'
                        : `${nextTierPoints - rewardPoints} points to ${
                            isGoldTier ? 'Platinum' : 'Gold'
                          }`}
                    </span>
                  </div>
                  <div className="w-full bg-[#2E2B27] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8A5A44] to-[#C9A354] h-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Alert Banner */}
              {feedbackMessage && (
                <div
                  className={`p-3.5 rounded-xs text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 border ${
                    feedbackMessage.success
                      ? 'bg-[#EBF3EA] border-[#B7DEB2] text-[#2C6228]'
                      : 'bg-[#FDF2F2] border-[#F4C7C7] text-[#9E2A2B]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {feedbackMessage.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2C6228]" />
                    ) : (
                      <X className="w-4 h-4 shrink-0 text-[#9E2A2B]" />
                    )}
                    <span className="font-medium">{feedbackMessage.text}</span>
                  </div>
                  {feedbackMessage.success && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setIsCartOpen(true);
                      }}
                      className="underline font-semibold hover:text-black whitespace-nowrap ml-2 cursor-pointer"
                    >
                      View in Bag →
                    </button>
                  )}
                </div>
              )}

              {/* How to Redeem for Discounts Section */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-luxury text-[#171615]">
                    REDEEM POINTS FOR DISCOUNTS
                  </h4>
                  <span className="text-[11px] text-[#7A746B]">
                    Instant Bag Deduction
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {REWARD_VOUCHERS.map((voucher) => {
                    const canAfford = rewardPoints >= voucher.pointsCost;
                    const isCurrentlyApplied = couponCode === voucher.code;

                    return (
                      <div
                        key={voucher.id}
                        className={`p-4 rounded-xs border transition-all flex flex-col justify-between relative bg-white ${
                          isCurrentlyApplied
                            ? 'border-[#2C6228] shadow-sm ring-1 ring-[#2C6228]'
                            : canAfford
                            ? 'border-[#DDD5C8] hover:border-[#8A5A44] shadow-2xs'
                            : 'border-[#EAE3D8] opacity-75'
                        }`}
                      >
                        {isCurrentlyApplied && (
                          <div className="absolute -top-2.5 right-3 bg-[#2C6228] text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-xs">
                            Active in Bag
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#8A5A44]">
                              {voucher.pointsCost} PTS
                            </span>
                            <span className="text-[10px] text-[#8C8478]">
                              Min ₹{voucher.minSpend}
                            </span>
                          </div>

                          <h5 className="font-serif font-medium text-sm text-[#171615] mb-1">
                            {voucher.title}
                          </h5>
                          <p className="text-[11px] text-[#787167] mb-3 font-light">
                            Deducts ₹{voucher.rupeeDiscount} off your current order total.
                          </p>

                          <div className="p-2 bg-[#FAF8F5] border border-[#EDE5DA] rounded-xs flex items-center justify-between text-[11px] font-mono text-[#38332D] mb-3">
                            <span className="font-bold">{voucher.code}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(voucher.code)}
                              className="text-[#8A5A44] hover:text-[#171615] transition-colors p-0.5 cursor-pointer"
                              title="Copy code"
                            >
                              {copiedCode === voucher.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRedeem(voucher)}
                          disabled={!canAfford || isCurrentlyApplied}
                          className={`w-full py-2 text-[10px] font-semibold tracking-wider uppercase rounded-xs transition-colors cursor-pointer ${
                            isCurrentlyApplied
                              ? 'bg-[#EBF3EA] text-[#2C6228] border border-[#B7DEB2] cursor-default'
                              : canAfford
                              ? 'bg-[#171615] text-[#FAF8F5] hover:bg-[#8A5A44]'
                              : 'bg-[#EDE7DE] text-[#A69E92] cursor-not-allowed'
                          }`}
                        >
                          {isCurrentlyApplied
                            ? 'Applied to Bag'
                            : canAfford
                            ? 'Redeem & Apply'
                            : `Need ${voucher.pointsCost - rewardPoints} More Pts`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ways to Earn Points */}
              <div className="bg-white p-4 sm:p-5 border border-[#EAE3D8] rounded-xs space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-luxury text-[#171615]">
                  WAYS TO EARN REWARDS POINTS
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5F5850]">
                  <div className="flex items-start gap-2.5 p-2 bg-[#FAF8F5] border border-[#F0ECE1]">
                    <ShoppingBag className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block">Shop at Lusi</strong>
                      <span className="text-[11px] text-[#7A746B]">
                        Earn 1 Point for every ₹10 spent across Men, Women & Kids.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-[#FAF8F5] border border-[#F0ECE1]">
                    <Gift className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block">Welcome Privilege</strong>
                      <span className="text-[11px] text-[#7A746B]">
                        250 Points credited upon joining the Lusi family.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-[#FAF8F5] border border-[#F0ECE1]">
                    <Sparkles className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block">Birthday Treat</strong>
                      <span className="text-[11px] text-[#7A746B]">
                        200 Bonus points during your anniversary month.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-[#FAF8F5] border border-[#F0ECE1]">
                    <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block">Verified Reviews</strong>
                      <span className="text-[11px] text-[#7A746B]">
                        50 Points for every verified fit and style review.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points History Ledger */}
              <div className="bg-white p-4 sm:p-5 border border-[#EAE3D8] rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-luxury text-[#171615]">
                    POINTS ACTIVITY LEDGER
                  </h4>
                  <span className="text-[10px] text-[#8F887D] uppercase tracking-wider">
                    Recent Transactions
                  </span>
                </div>

                <div className="divide-y divide-[#F2ECE1] text-xs">
                  {rewardHistory.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            item.type === 'earned'
                              ? 'bg-[#EBF3EA] text-[#2C6228]'
                              : 'bg-[#FBEAEA] text-[#A63B3B]'
                          }`}
                        >
                          {item.type === 'earned' ? '+' : '-'}
                        </div>
                        <div>
                          <span className="font-medium text-[#171615] block">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#8F887D]">{item.date}</span>
                        </div>
                      </div>

                      <span
                        className={`font-mono font-semibold ${
                          item.type === 'earned' ? 'text-[#2C6228]' : 'text-[#A63B3B]'
                        }`}
                      >
                        {item.type === 'earned' ? `+${item.points}` : `-${item.points}`} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER PROFILE & CONCIERGE CARE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 border border-[#EAE3D8] rounded-xs space-y-5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F0ECE1]">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#DDD5C8] flex items-center justify-center text-[#171615]">
                  <User className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#171615]">
                    Lusi Family Member
                  </h4>
                  <p className="text-[11px] text-[#787167]">
                    Member since 2026 · {tierName} · Verified Customer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5F5850]">
                <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1]">
                  <span className="font-semibold uppercase tracking-wider text-[#171615] block mb-1">
                    Customer Care Hotline
                  </span>
                  <p className="font-mono">+91-7248596540</p>
                  <p className="text-[11px] text-[#8F887D] mt-0.5">Mon–Sat, 9AM–8PM IST</p>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1]">
                  <span className="font-semibold uppercase tracking-wider text-[#171615] block mb-1">
                    Direct Concierge Email
                  </span>
                  <a href="mailto:Help@lusi.in" className="text-[#8A5A44] underline">
                    Help@lusi.in
                  </a>
                  <p className="text-[11px] text-[#8F887D] mt-0.5">Average response: &lt; 2 hours</p>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1]">
                  <span className="font-semibold uppercase tracking-wider text-[#171615] block mb-1">
                    Default Currency & Shipping
                  </span>
                  <p>INR (₹) · Pan-India Dispatch</p>
                  <p className="text-[11px] text-[#8F887D] mt-0.5">Free delivery on orders ₹1,999+</p>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#F0ECE1]">
                  <span className="font-semibold uppercase tracking-wider text-[#171615] block mb-1">
                    Complimentary Exchange
                  </span>
                  <p>7 Days Doorstep Pickup</p>
                  <p className="text-[11px] text-[#8F887D] mt-0.5">Zero hassle instant replacement</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancel Order Confirmation Modal Overlay */}
        {isCancelDialogOpen && (orderBeingCancelled || trackedOrder) && (() => {
          const target = orderBeingCancelled || trackedOrder!;
          return (
            <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
              <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#D9D1C5] overflow-hidden p-5 sm:p-6 space-y-4 animate-in zoom-in-95">
                <div className="flex items-start justify-between pb-3 border-b border-[#EAE3D8]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                      <XCircle className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#171615]">
                        Cancel Order #{target.orderId}
                      </h4>
                      <p className="text-[11px] text-[#787167]">
                        Order is currently in Atelier preparation
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCancellingOrder) {
                        setIsCancelDialogOpen(false);
                        setOrderBeingCancelled(null);
                      }
                    }}
                    className="p-1 text-[#787167] hover:text-[#171615] rounded-full hover:bg-[#EAE3D8] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Order Summary Snapshot */}
                <div className="p-3 bg-white border border-[#EAE3D8] rounded-xs space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#787167]">
                    <span>Items to Cancel:</span>
                    <span className="font-medium text-[#171615]">
                      {target.items.length} {target.items.length === 1 ? 'Garment' : 'Garments'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#787167]">
                    <span>Total Amount:</span>
                    <span className="font-mono font-bold text-sm text-[#171615]">
                      ₹{target.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#787167]">
                    <span>Payment Method:</span>
                    <span className="font-mono uppercase font-semibold text-[#171615]">
                      {target.address.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Garments Preview */}
                <div className="max-h-28 overflow-y-auto divide-y divide-[#F0ECE1] bg-white border border-[#EAE3D8] rounded-xs px-3">
                  {target.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[#8A5A44] font-semibold">{it.quantity}x</span>
                        <span className="truncate text-[#171615]">{it.product.name}</span>
                        <span className="text-[#8F887D] text-[10px]">({it.selectedSize})</span>
                      </div>
                      <span className="font-mono text-[#171615] shrink-0">
                        ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reason Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#171615] block">
                    Reason for Cancellation <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C8] rounded-xs text-xs text-[#171615] focus:outline-none focus:border-[#171615]"
                  >
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Ordered incorrect size or color">Ordered incorrect size or color</option>
                    <option value="Delivery timeframe exceeds schedule">Delivery timeframe is too long</option>
                    <option value="Found an alternative outfit on LUSI">Found an alternative outfit on LUSI</option>
                    <option value="Duplicate order placed by accident">Duplicate order placed by accident</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                </div>

                {/* Optional Custom Note */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#787167] block">
                    Additional Feedback (Optional)
                  </label>
                  <textarea
                    value={cancelCustomNote}
                    onChange={(e) => setCancelCustomNote(e.target.value)}
                    placeholder="Tell us what went wrong so we can refine our service..."
                    rows={2}
                    className="w-full p-2.5 bg-white border border-[#DDD5C8] rounded-xs text-xs text-[#171615] placeholder-[#998E80] focus:outline-none focus:border-[#171615] resize-none"
                  />
                </div>

                {/* Refund & Policy Assurance */}
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs text-[11px] text-[#635B51] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#171615] block">
                      Refund Policy Notice:
                    </span>
                    <p className="mt-0.5">
                      {target.address.paymentMethod === 'cod'
                        ? 'This is a Cash on Delivery order; no payment was charged.'
                        : 'Your full payment of ₹' +
                          target.total.toLocaleString('en-IN') +
                          ' will be automatically refunded to your original payment method within 24–48 banking hours.'}
                    </p>
                  </div>
                </div>

                {cancelErrorNotice && (
                  <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{cancelErrorNotice}</span>
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EAE3D8]">
                  <button
                    type="button"
                    disabled={isCancellingOrder}
                    onClick={() => {
                      setIsCancelDialogOpen(false);
                      setOrderBeingCancelled(null);
                    }}
                    className="px-4 py-2.5 bg-white hover:bg-[#F2EDE4] border border-[#DDD5C8] rounded-xs text-xs text-[#171615] font-medium transition-colors cursor-pointer"
                  >
                    Keep Order
                  </button>
                  <button
                    type="button"
                    disabled={isCancellingOrder}
                    onClick={handleConfirmCancel}
                    className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isCancellingOrder ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Confirm Cancellation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Simulated PDF Tax Invoice Preview Modal */}
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </div>
    </div>
  );
};
