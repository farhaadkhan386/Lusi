import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onViewStorefront: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  onViewStorefront,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
    currentTab,
  } = useAdmin();

  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    // Default route to products with search if matching
    setCurrentTab('products');
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview & Statistics';
      case 'products':
        return 'Apparel Catalog Management';
      case 'categories':
        return 'Men, Women & Kids Taxonomy';
      case 'inventory':
        return 'Stock Levels & Critical Thresholds';
      case 'orders':
        return 'Pan-India Fulfillment & Orders';
      case 'customers':
        return 'Customer Directory & VIP Tiers';
      case 'coupons':
        return 'Discounts, Privileges & Promos';
      case 'collections':
        return 'Curated Fashion Collections';
      case 'banners':
        return 'Campaign Banners & Visual Sliders';
      case 'reviews':
        return 'Verified Customer Reviews Moderation';
      case 'newsletter':
        return 'VIP Newsletter Subscriber Base';
      case 'storefront':
        return 'Storefront CMS & Editorial Sections';
      case 'settings':
        return 'Store Policies & Payment Gateways';
      default:
        return 'Management Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#141210]/95 backdrop-blur-md border-b border-[#24201A] px-4 sm:px-8 flex items-center justify-between text-[#E8E2D5]">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#A89E8F] hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[10px] uppercase tracking-luxury text-[#C9A354] font-medium font-mono">
            LUSI ATELIER CONTROL
          </div>
          <h1 className="text-base sm:text-lg font-serif font-light text-white capitalize">
            {getPageTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications & Storefront Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Global Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-[#736857]" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search SKUs, orders, customers..."
            className="w-48 lg:w-64 bg-[#1C1814] border border-[#2E271F] rounded-xs pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#63594B] focus:outline-none focus:border-[#C9A354] transition-all font-mono"
          />
        </form>

        {/* Live Storefront Button */}
        <button
          type="button"
          onClick={onViewStorefront}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F1B16] hover:bg-[#2A241D] border border-[#332A1F] rounded-xs text-xs font-medium uppercase tracking-wider text-[#C4B8A5] transition-colors"
          title="Open Live Customer Store"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-[#C9A354]" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#A89E8F] hover:text-white transition-colors rounded-xs hover:bg-[#1E1A15]"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A354] text-[9px] font-bold text-black font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#171512] border border-[#2E271F] rounded-xs shadow-2xl overflow-hidden z-50">
              <div className="p-3.5 bg-[#1C1814] border-b border-[#292219] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#C9A354]/20 text-[#C9A354] text-[10px] font-mono rounded-xs">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#A89E8F] hover:text-white"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#241F18] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#736857]">
                    No notifications at this time
                  </div>
                ) : (
                  notifications.map((notif) => {
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) setCurrentTab(notif.link);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-[#201C16] transition-colors cursor-pointer flex items-start gap-3 ${
                          !notif.isRead ? 'bg-[#1C1814]/70' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'order' && (
                            <ShoppingBag className="w-4 h-4 text-emerald-400" />
                          )}
                          {notif.type === 'low_stock' && (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          {notif.type === 'out_of_stock' && (
                            <Package className="w-4 h-4 text-red-400" />
                          )}
                          {notif.type === 'review' && (
                            <Sparkles className="w-4 h-4 text-[#C9A354]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-medium text-white truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-[#736857] font-mono shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A89E8F] leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
