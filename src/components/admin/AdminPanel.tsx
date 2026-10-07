import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminLogin } from './AdminLogin';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminProductsView } from './views/AdminProductsView';
import { AdminInventoryView } from './views/AdminInventoryView';
import { AdminOrdersView } from './views/AdminOrdersView';
import { AdminCustomersView } from './views/AdminCustomersView';
import { AdminCouponsView } from './views/AdminCouponsView';
import { AdminStorefrontView } from './views/AdminStorefrontView';
import { AdminReviewsView } from './views/AdminReviewsView';
import { AdminNewsletterView } from './views/AdminNewsletterView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminCategoriesView } from './views/AdminCategoriesView';
import { AdminCollectionsView } from './views/AdminCollectionsView';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore }) => {
  const { isAuthenticated, currentTab } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check: Unauthenticated users MUST see the Login screen
  if (!isAuthenticated) {
    return <AdminLogin onBackToStore={onBackToStore} />;
  }

  // Active View Render
  const renderView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboardView />;
      case 'products':
        return <AdminProductsView />;
      case 'categories':
        return <AdminCategoriesView />;
      case 'inventory':
        return <AdminInventoryView />;
      case 'orders':
        return <AdminOrdersView />;
      case 'customers':
        return <AdminCustomersView />;
      case 'coupons':
        return <AdminCouponsView />;
      case 'collections':
      case 'banners':
        return <AdminCollectionsView />;
      case 'reviews':
        return <AdminReviewsView />;
      case 'newsletter':
        return <AdminNewsletterView />;
      case 'storefront':
        return <AdminStorefrontView />;
      case 'settings':
        return <AdminSettingsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#E0D8CB] flex font-sans selection:bg-[#C9A354] selection:text-black">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onViewStorefront={onBackToStore}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onViewStorefront={onBackToStore}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>

        <footer className="px-6 py-4 border-t border-[#24201A] text-xs text-[#736857] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LUSI India Atelier Operational Architecture · Super Admin Mode</span>
          <span className="font-mono text-[10px]">Secure Session active · v2.4.0</span>
        </footer>
      </div>
    </div>
  );
};
