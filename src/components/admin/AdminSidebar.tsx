import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  Tags,
  Boxes,
  ShoppingBag,
  Users,
  TicketPercent,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Store,
  Settings,
  LogOut,
  ExternalLink,
  X,
  Shield,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStorefront: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  onViewStorefront,
}) => {
  const { currentTab, setCurrentTab, logout, adminUser, products, orders, reviews } = useAdmin();

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'New' || o.orderStatus === 'Processing'
  ).length;

  const lowStockCount = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  ).length;

  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Shirt, badge: products.length },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined, badgeColor: 'bg-amber-900/60 text-amber-200 border border-amber-700/50' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: TicketPercent },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'storefront', label: 'Storefront CMS', icon: Store },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141210] border-r border-[#26221C] text-[#DDD6C8] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 border-b border-[#24201A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-2xl tracking-[0.25em] text-white font-light">
              LUSI
            </span>
            <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-wider bg-[#262119] text-[#C9A354] border border-[#3E3526] rounded-xs font-semibold">
              Admin
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#8A8071] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Storefront Quick Link */}
        <div className="px-4 py-3 border-b border-[#201C16]">
          <button
            type="button"
            onClick={onViewStorefront}
            className="w-full py-2 px-3 bg-[#1C1915] hover:bg-[#25201A] border border-[#2E271F] rounded-xs text-[11px] font-medium uppercase tracking-wider text-[#C4B8A5] flex items-center justify-between transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#C9A354]" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[#736857] group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-luxury text-[#756A5B] font-semibold">
            Store Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xs transition-colors ${
                  isActive
                    ? 'bg-[#C9A354] text-[#141210] font-semibold shadow-xs'
                    : 'text-[#A89E8F] hover:bg-[#1F1B16] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 stroke-[1.75] ${
                      isActive ? 'text-[#141210]' : 'text-[#8A7E6E]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs tabular-nums ${
                      isActive
                        ? 'bg-black/20 text-[#141210]'
                        : item.badgeColor || 'bg-[#26211A] text-[#C9A354]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-[#24201A] bg-[#110F0D]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#241F18] border border-[#3A3225] flex items-center justify-center text-[#C9A354] font-semibold text-xs font-mono">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {adminUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-[#8C806F] truncate font-mono">
                {adminUser?.email || 'admin@lusi.in'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#1C1814] hover:bg-[#2B231A] text-red-400 hover:text-red-300 border border-[#332A1F] rounded-xs text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Admin Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
