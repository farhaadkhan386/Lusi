import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AdminProvider } from './context/AdminContext';
import { AdminPanel } from './components/admin/AdminPanel';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { ShopByCategory } from './components/home/ShopByCategory';
import { NewArrivals } from './components/home/NewArrivals';
import { MensSection } from './components/home/MensSection';
import { WomensSection } from './components/home/WomensSection';
import { KidsSection } from './components/home/KidsSection';
import { ShopByAgeKids } from './components/home/ShopByAgeKids';
import { BestSellers } from './components/home/BestSellers';
import { FamilyStyleSection } from './components/home/FamilyStyleSection';
import { PromotionalBanner } from './components/home/PromotionalBanner';
import { AboutLusiSection } from './components/home/AboutLusiSection';
import { WhyChooseLusi } from './components/home/WhyChooseLusi';
import { InstagramSection } from './components/home/InstagramSection';
import { Newsletter } from './components/home/Newsletter';
import { CategoryFilterView } from './components/catalog/CategoryFilterView';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { SearchModal } from './components/search/SearchModal';
import { WishlistDrawer } from './components/modals/WishlistDrawer';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { AccountModal } from './components/modals/AccountModal';
import { FaqModal } from './components/modals/FaqModal';
import { AboutView } from './components/about/AboutView';

const MainContent: React.FC = () => {
  const {
    activeView,
    selectedProductForModal,
    setSelectedProductForModal,
    setActiveView,
    isAccountOpen,
    setIsAccountOpen,
    accountInitialTab,
    openAccountModal,
  } = useShop();

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Check window.location.pathname or hash for /admin on load or popstate
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin') {
        setActiveView('admin');
      }
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, [setActiveView]);

  const handleQuickView = (product: any) => {
    setSelectedProductForModal(product);
  };

  // If Admin View is active, render the dedicated, separate Admin Panel
  if (activeView === 'admin') {
    return <AdminPanel onBackToStore={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171615]">
      {/* Sticky Navigation */}
      <Navbar onOpenAccount={() => openAccountModal('track')} />

      {/* Main Body Routing with mobile bottom clearance */}
      <main className="flex-1 pb-14 lg:pb-0">
        {activeView === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Shop By Category (Men, Women, Kids) */}
            <ShopByCategory />

            {/* 3. New Arrivals (Tabs: ALL | MEN | WOMEN | KIDS) */}
            <NewArrivals onQuickView={handleQuickView} />

            {/* 4. Men's Fashion Collection */}
            <MensSection onQuickView={handleQuickView} />

            {/* 5. Women's Fashion Collection */}
            <WomensSection onQuickView={handleQuickView} />

            {/* 6. Kids Fashion Collection */}
            <KidsSection onQuickView={handleQuickView} />

            {/* 7. Shop By Age — Kids */}
            <ShopByAgeKids />

            {/* 8. Best Sellers (MEN | WOMEN | KIDS + mobile horizontal scroll) */}
            <BestSellers onQuickView={handleQuickView} />

            {/* 9. Family Style Section */}
            <FamilyStyleSection />

            {/* 10. Promotional Banner */}
            <PromotionalBanner />

            {/* 11. About Lusi Brand Story */}
            <AboutLusiSection />

            {/* 12. Why Choose Lusi Feature Cards */}
            <WhyChooseLusi />

            {/* 13. Instagram Grid Section */}
            <InstagramSection />

            {/* 14. Newsletter Section */}
            <Newsletter />
          </>
        )}

        {activeView === 'catalog' && (
          <CategoryFilterView
            onQuickView={handleQuickView}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        )}

        {activeView === 'about' && <AboutView />}

        {activeView === 'pdp' && selectedProductForModal && (
          <div className="py-6 sm:py-10">
            <ProductDetailModal
              product={selectedProductForModal}
              onClose={() => setActiveView('home')}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <WishlistDrawer />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountInitialTab}
      />
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />

      {/* Quick View Modal (when triggered while in home or catalog) */}
      {selectedProductForModal && activeView !== 'pdp' && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenFAQs={() => setIsFaqOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <ShopProvider>
        <MainContent />
      </ShopProvider>
    </AdminProvider>
  );
}
