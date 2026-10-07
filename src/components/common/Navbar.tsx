import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronRight, Phone, Home, Grid, Sparkles, Truck, Package } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface NavbarProps {
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAccount }) => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    navigateToCategory,
    setActiveView,
    activeView,
    filters,
    rewardPoints,
    openAccountModal,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'about', category?: 'Men' | 'Women' | 'Kids' | 'All') => {
    setIsMobileMenuOpen(false);
    if (category) {
      navigateToCategory(category);
    } else {
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Luxury Announcement Ticker */}
      <div className="bg-[#171615] text-[#EDE6DC] text-[10px] tracking-luxury py-2 px-4 uppercase border-b border-[#2A2826]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-3">
            <span className="font-serif tracking-[0.25em] text-[#D8CFBC] font-medium">LUSI INDIA</span>
            <span className="text-[#6A6359]">/</span>
            <span className="tracking-widest text-[#B5ADA1]">HAUTE COUTURE READY-TO-WEAR</span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-3 text-center">
            <span>COMPLIMENTARY DOMESTIC DISPATCH OVER ₹1,999</span>
            <span className="hidden sm:inline text-[#6A6359]">·</span>
            <span className="hidden sm:inline">CODE <strong className="text-white font-semibold tracking-widest">LUSIFIRST</strong> FOR 10% PRIVILEGE</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#C4BCB0] hover:text-white transition-colors">
            <Phone className="w-2.5 h-2.5 text-[#A3806C]" />
            <a href="tel:+917248596540" className="tracking-wider hover:underline">+91-7248596540</a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar (Strict 3-zone contract) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/96 backdrop-blur-md shadow-xs border-b border-[#EAE3D8]'
            : 'bg-[#FAF8F5] border-b border-[#EFE8DD]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Brand Wordmark (Single text element in luxury display face) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#171615] hover:text-[#8A5A44] transition-colors"
                aria-label="Open luxury navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="group flex items-baseline text-left focus:outline-none"
              >
                <span className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-light tracking-[0.26em] text-[#171615] group-hover:text-[#8A5A44] transition-colors uppercase">
                  LUSI
                </span>
              </button>
            </div>

            {/* Zone 2: Navigation Links (Single-line, unboxed, delicate spacing) */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-luxury uppercase text-[#47423B]">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className={`py-1 transition-colors hover:text-[#171615] relative ${
                  activeView === 'home'
                    ? 'text-[#171615] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171615]'
                    : 'text-[#615B54]'
                }`}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Men')}
                className={`py-1 transition-colors hover:text-[#171615] relative ${
                  activeView === 'catalog' && filters.category === 'Men'
                    ? 'text-[#171615] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171615]'
                    : 'text-[#615B54]'
                }`}
              >
                Men
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Women')}
                className={`py-1 transition-colors hover:text-[#171615] relative ${
                  activeView === 'catalog' && filters.category === 'Women'
                    ? 'text-[#171615] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171615]'
                    : 'text-[#615B54]'
                }`}
              >
                Women
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Kids')}
                className={`py-1 transition-colors hover:text-[#171615] relative ${
                  activeView === 'catalog' && filters.category === 'Kids'
                    ? 'text-[#171615] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171615]'
                    : 'text-[#615B54]'
                }`}
              >
                Kids
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('All')}
                className="py-1 text-[#615B54] hover:text-[#171615] transition-colors"
              >
                New Arrivals
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('All')}
                className="py-1 text-[#615B54] hover:text-[#171615] transition-colors"
              >
                Collections
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className={`py-1 transition-colors hover:text-[#171615] relative ${
                  activeView === 'about'
                    ? 'text-[#171615] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171615]'
                    : 'text-[#615B54]'
                }`}
              >
                About
              </button>
            </nav>

            {/* Zone 3: Primary Utility Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-[#2B2723] hover:text-[#8A5A44] transition-colors"
                aria-label="Search clothing"
                title="Search"
              >
                <Search className="w-4.5 h-4.5 stroke-[1.5]" />
              </button>

              <button
                type="button"
                onClick={() => openAccountModal('rewards')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#8A5A44] hover:text-[#171615] bg-[#FAF8F5] border border-[#E8DFC8] rounded-xs transition-colors shadow-2xs"
                title="Lusi Rewards Loyalty Club"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A354]" />
                <span className="font-semibold">{rewardPoints} pts</span>
              </button>

              <button
                type="button"
                onClick={onOpenAccount}
                className="hidden sm:flex p-2.5 text-[#2B2723] hover:text-[#8A5A44] transition-colors"
                aria-label="User Account"
                title="Account & Orders"
              >
                <User className="w-4.5 h-4.5 stroke-[1.5]" />
              </button>

              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2.5 text-[#2B2723] hover:text-[#8A5A44] transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4.5 h-4.5 stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8A5A44] text-[9px] font-bold text-white tabular-nums">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-[#2B2723] hover:text-[#8A5A44] transition-colors ml-0.5"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#171615] text-[9px] font-bold text-white tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb Bar (Luxury One-Handed Shopping, <54px, <15% sticky cap) */}
      <aside
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/96 backdrop-blur-md border-t border-[#EAE3D8] h-13 px-4 flex items-center justify-around text-[#171615] shadow-xs"
      >
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] tracking-wider uppercase ${
            activeView === 'home' ? 'text-[#8A5A44] font-semibold' : 'text-[#666057]'
          }`}
        >
          <Home className="w-4 h-4 stroke-[1.5]" />
          <span className="mt-0.5">Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            navigateToCategory('All');
          }}
          className={`flex flex-col items-center justify-center py-1 text-[10px] tracking-wider uppercase ${
            activeView === 'catalog' ? 'text-[#8A5A44] font-semibold' : 'text-[#666057]'
          }`}
        >
          <Grid className="w-4 h-4 stroke-[1.5]" />
          <span className="mt-0.5">Shop</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[10px] tracking-wider uppercase text-[#666057] hover:text-[#171615]"
        >
          <Search className="w-4 h-4 stroke-[1.5]" />
          <span className="mt-0.5">Search</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-[10px] tracking-wider uppercase text-[#666057]"
        >
          <Heart className="w-4 h-4 stroke-[1.5]" />
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#8A5A44] text-[8px] font-bold text-white tabular-nums">
              {wishlist.length}
            </span>
          )}
          <span className="mt-0.5">Saved</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-[10px] tracking-wider uppercase text-[#666057]"
        >
          <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#171615] text-[8px] font-bold text-white tabular-nums">
              {cartCount}
            </span>
          )}
          <span className="mt-0.5">Bag</span>
        </button>
      </aside>

      {/* Luxury Full-Height Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF8F5] shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between p-6 border-b border-[#EAE3D8]">
              <div className="flex items-baseline">
                <span className="font-serif text-2xl font-light tracking-[0.25em] text-[#171615]">
                  LUSI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#524C44] hover:text-black"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
              <span className="text-[10px] uppercase tracking-luxury text-[#948D82] block mb-2 font-medium">
                Navigation
              </span>

              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Men')}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>Men's Collection</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Women')}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>Women's Collection</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('home', 'Kids')}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>Kids Collection</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToCategory('All');
                }}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>New Arrivals</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToCategory('All');
                }}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>Collections</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className="w-full flex items-center justify-between py-3.5 text-xs font-semibold tracking-luxury uppercase text-[#171615] border-b border-[#F0ECE1]"
              >
                <span>About LUSI</span>
                <ChevronRight className="w-4 h-4 text-[#A8A196]" />
              </button>

              <div className="pt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAccountModal('rewards');
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xs text-xs uppercase tracking-editorial text-[#171615] font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#C9A354]" />
                    <span className="font-semibold">Lusi Rewards Club</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#8A5A44]">
                    {rewardPoints} pts
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAccountModal('track');
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white border border-[#DDD5C8] rounded-xs text-xs uppercase tracking-editorial text-[#171615] font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#8A5A44]" />
                    <span>Track My Order</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A5A44] bg-[#FAF8F5] px-1.5 py-0.5 rounded-xs border border-[#E2D8CB]">
                    Live Telemetry
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAccountModal('history');
                  }}
                  className="w-full flex items-center gap-3 py-2 text-xs uppercase tracking-editorial text-[#4E4841] font-medium cursor-pointer"
                >
                  <Package className="w-4 h-4 stroke-[1.5]" />
                  <span>Purchase History</span>
                </button>
                <div className="pt-4 text-xs text-[#827A70] leading-relaxed border-t border-[#EAE3D8]">
                  <p className="text-[10px] uppercase tracking-luxury text-[#9E978C] mb-1">Concierge Assistance:</p>
                  <a href="tel:+917248596540" className="font-medium text-[#171615] block">
                    +91-7248596540
                  </a>
                  <a href="mailto:Help@lusi.in" className="text-[#8A5A44] block mt-0.5">
                    Help@lusi.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
