import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Home,
  Clock,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { OrderConfirmation, OrderStatus } from '../../types';

interface OrderLifecycleProgressBarProps {
  order: OrderConfirmation;
  className?: string;
}

export interface LifecycleStageConfig {
  key: string;
  label: string;
  shortLabel: string;
  tagline: string;
  detail: string;
  type: 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
}

const LIFECYCLE_STAGES: LifecycleStageConfig[] = [
  {
    key: 'Confirmed',
    label: 'Order Confirmed',
    shortLabel: 'Confirmed',
    tagline: 'Order Verified & QA Booked',
    detail: 'Order received at Mumbai Atelier. Tailoring and garment fit check confirmed.',
    type: 'confirmed',
  },
  {
    key: 'Packed',
    label: 'Packed at Atelier',
    shortLabel: 'Packed',
    tagline: 'Eco-Luxe Craft Packaging',
    detail: 'Garments steamed, hand-folded, and packaged into sustainable luxury parcels.',
    type: 'packed',
  },
  {
    key: 'Shipped',
    label: 'Shipped & In Transit',
    shortLabel: 'Shipped',
    tagline: 'Dispatched via Air Courier',
    detail: 'Transferred to express logistics partner. Telemetry scans logged across transit hubs.',
    type: 'shipped',
  },
  {
    key: 'Out for Delivery',
    label: 'Out for Delivery',
    shortLabel: 'Out for Delivery',
    tagline: 'With Delivery Executive',
    detail: 'Arrived at destination sorting depot. Out for scheduled doorstep delivery today.',
    type: 'out_for_delivery',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    tagline: 'Safely Handed Over',
    detail: 'Package delivered to residence. 7-day complimentary return & fit exchange window starts.',
    type: 'delivered',
  },
];

function getStageIndex(status?: OrderStatus): number {
  switch (status) {
    case 'New':
      return 0;
    case 'Confirmed':
    case 'Processing':
      return 0;
    case 'Packed':
      return 1;
    case 'Shipped':
      return 2;
    case 'Out for Delivery':
      return 3;
    case 'Delivered':
      return 4;
    case 'Cancelled':
      return -1;
    default:
      return 0;
  }
}

export const OrderLifecycleProgressBar: React.FC<OrderLifecycleProgressBarProps> = ({
  order,
  className = '',
}) => {
  const currentStageIdx = getStageIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const [selectedStageIdx, setSelectedStageIdx] = useState<number | null>(null);

  // Calculate percentage for progress fill
  const progressPercent = isCancelled
    ? 0
    : currentStageIdx === 0
    ? 15
    : currentStageIdx === 1
    ? 38
    : currentStageIdx === 2
    ? 65
    : currentStageIdx === 3
    ? 88
    : 100;

  // Render stage icon based on type
  const renderStageIcon = (type: LifecycleStageConfig['type'], isCompleted: boolean) => {
    if (isCompleted) {
      return <Check className="w-3.5 h-3.5 stroke-[2.8]" />;
    }
    switch (type) {
      case 'confirmed':
        return <FileCheck2 className="w-3.5 h-3.5 stroke-[1.8]" />;
      case 'packed':
        return <Package className="w-3.5 h-3.5 stroke-[1.8]" />;
      case 'shipped':
        return <Truck className="w-3.5 h-3.5 stroke-[1.8]" />;
      case 'out_for_delivery':
        return <MapPin className="w-3.5 h-3.5 stroke-[1.8]" />;
      case 'delivered':
        return <Home className="w-3.5 h-3.5 stroke-[1.8]" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />;
    }
  };

  // Find timeline timestamp for each stage if available
  const getStageTimestamp = (stage: LifecycleStageConfig, idx: number) => {
    if (!order.timeline || order.timeline.length === 0) {
      if (idx === 0) return order.date;
      if (idx <= currentStageIdx) return 'Logged';
      return null;
    }

    const matchedEntry = order.timeline.find((t) => {
      if (stage.key === 'Confirmed') return t.status === 'Confirmed' || t.status === 'New' || t.status === 'Processing';
      if (stage.key === 'Packed') return t.status === 'Packed';
      if (stage.key === 'Shipped') return t.status === 'Shipped';
      if (stage.key === 'Out for Delivery') return t.status === 'Out for Delivery';
      if (stage.key === 'Delivered') return t.status === 'Delivered';
      return false;
    });

    if (matchedEntry) return matchedEntry.timestamp;
    if (idx < currentStageIdx) return 'Completed';
    if (idx === currentStageIdx) return 'In Progress';
    return null;
  };

  const activeStage = LIFECYCLE_STAGES[Math.max(0, currentStageIdx)];
  const inspectedStage = selectedStageIdx !== null ? LIFECYCLE_STAGES[selectedStageIdx] : null;

  return (
    <div
      className={`p-4 sm:p-5 bg-gradient-to-b from-[#FAF8F5] to-white border border-[#EAE3D8] rounded-xs space-y-4 ${className}`}
    >
      {/* 1. Progress Bar Header: Stage Overview & Progress Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A5A44] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C9A354]" />
              <span>Order Lifecycle Status</span>
            </span>
            <span className="text-[#C4B7A5]">·</span>
            <span className="text-[11px] font-mono text-[#524B43]">
              Stage {Math.max(1, currentStageIdx + 1)} of 5
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-medium text-[#171615] mt-0.5">
            {isCancelled ? (
              <span className="text-rose-700">Order Cancelled</span>
            ) : currentStageIdx === 4 ? (
              <span className="text-emerald-800">Delivered Safely to Doorstep</span>
            ) : (
              <span>{activeStage.label}</span>
            )}
          </h4>
        </div>

        <div className="flex items-center gap-2 sm:self-auto self-start">
          <div className="px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C8] rounded-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8A5A44] animate-pulse" />
            <span className="font-mono text-xs font-semibold text-[#171615]">
              {progressPercent}% Complete
            </span>
            <span className="text-[10px] text-[#787167] font-light hidden sm:inline">
              · {currentStageIdx === 4 ? 'Fulfilled' : 'On Schedule'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Bar Track & Nodes */}
      <div className="pt-2 pb-1">
        <div className="relative px-2 sm:px-6">
          {/* Background Track Line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-[#EAE3D8] rounded-full -z-0" />

          {/* Active Gradient Filled Progress Bar */}
          <div
            className="absolute top-4 left-6 h-1 bg-gradient-to-r from-[#171615] via-[#8A5A44] to-[#C9A354] rounded-full transition-all duration-700 -z-0 shadow-xs"
            style={{ width: `calc(${progressPercent}% - 3rem)` }}
          />

          {/* Lifecycle Milestone Nodes */}
          <div className="relative z-10 flex justify-between items-start text-center">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const isPending = idx > currentStageIdx;
              const isInspected = selectedStageIdx === idx;
              const timestamp = getStageTimestamp(stage, idx);

              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => setSelectedStageIdx(isInspected ? null : idx)}
                  className="flex flex-col items-center max-w-[62px] sm:max-w-[100px] cursor-pointer group focus:outline-none"
                  title={`${stage.label}: Click to inspect stage details`}
                >
                  {/* Node Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 relative ${
                      isCompleted
                        ? 'bg-[#171615] text-[#FAF8F5] shadow-xs'
                        : isCurrent
                        ? 'bg-[#8A5A44] text-white ring-4 ring-[#8A5A44]/25 shadow-md scale-105'
                        : 'bg-white border border-[#D9D1C5] text-[#A69E92] group-hover:border-[#8A5A44] group-hover:text-[#171615]'
                    } ${isInspected ? 'ring-2 ring-[#171615]' : ''}`}
                  >
                    {renderStageIcon(stage.type, isCompleted)}

                    {/* Active pulse glow dot */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-ping" />
                    )}
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`mt-2 text-[10.5px] leading-tight font-medium transition-colors ${
                      isCurrent
                        ? 'text-[#171615] font-bold'
                        : isCompleted
                        ? 'text-[#3E3831] font-semibold'
                        : 'text-[#A0988D] group-hover:text-[#171615]'
                    }`}
                  >
                    {stage.shortLabel}
                  </span>

                  {/* Desktop Subtitle / Tagline */}
                  <span className="hidden sm:block text-[9px] text-[#8C8478] mt-0.5 leading-tight font-light truncate max-w-[90px]">
                    {stage.tagline}
                  </span>

                  {/* Timestamp Badge */}
                  {timestamp && (
                    <span
                      className={`text-[8.5px] font-mono mt-1 px-1.5 py-0.2 rounded-xs tracking-tight ${
                        isCurrent
                          ? 'bg-[#8A5A44]/10 text-[#8A5A44] font-semibold'
                          : isCompleted
                          ? 'text-[#635B51]'
                          : 'text-[#A8A196]'
                      }`}
                    >
                      {timestamp.length > 11 ? timestamp.split(' ')[0] : timestamp}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Detailed Stage Inspector (Interactive Drawer / Panel) */}
      {inspectedStage ? (
        <div className="p-3.5 bg-white border border-[#DDD5C8] rounded-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#171615] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8A5A44]" />
                <span>{inspectedStage.label} Checkpoint</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E2D8CB] text-[#8A5A44] rounded-xs">
                {selectedStageIdx! <= currentStageIdx ? 'Completed / In Progress' : 'Upcoming'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedStageIdx(null)}
              className="text-[10px] text-[#787167] hover:text-[#171615] uppercase font-mono cursor-pointer"
            >
              Close Details ✕
            </button>
          </div>
          <p className="text-xs text-[#524B43] leading-relaxed font-light">
            {inspectedStage.detail}
          </p>
        </div>
      ) : (
        /* Default Quick Lifecycle Summary Banner */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white border border-[#F0ECE1] rounded-xs text-xs text-[#524B43]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
            <div>
              <span className="font-semibold text-[#171615]">Estimated Delivery: </span>
              <span>{order.estimatedDelivery}</span>
              <span className="text-[11px] text-[#787167] font-light">
                {' '}
                to {order.address.city}, {order.address.state}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] text-[#787167]">
            <Calendar className="w-3 h-3 text-[#8A5A44]" />
            <span>Target Courier: {order.courier || 'Blue Dart Express Air'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
