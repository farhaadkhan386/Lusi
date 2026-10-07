import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Sparkles, ArrowRight, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenFAQs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onOpenFAQs }) => {
  const { navigateToCategory, rewardPoints, openAccountModal, openAdminPanel } = useShop();

  return (
    <footer className="bg-[#141312] text-[#EDE7DD] pt-16 pb-24 lg:pb-16 border-t border-[#242220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Lusi Rewards Loyalty Program Section */}
        <div className="mb-14 p-6 sm:p-8 bg-[#1B1A18] border border-[#2E2C28] rounded-xs relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#8A5A44]/12 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C9A354]" />
                <span className="text-[10px] font-mono tracking-widest text-[#C9A354] uppercase">
                  Lusi Rewards Club · India Atelier Privilege
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2 leading-tight">
                Style Rewarded. Every Story Celebrated.
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A095] font-light leading-relaxed">
                Earn 1 Point for every ₹10 spent on Men, Women & Kids collections. Redeem your earned points effortlessly for instant ₹150, ₹300, and ₹500 bag discounts.
              </p>

              {/* Privilege Perks Highlights */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] text-[#D6CEBF]">
                <span className="flex items-center gap-1.5 bg-[#252320] border border-[#34312C] px-2.5 py-1 rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A354]" />
                  250 Welcome Pts Credited
                </span>
                <span className="flex items-center gap-1.5 bg-[#252320] border border-[#34312C] px-2.5 py-1 rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A354]" />
                  1 Pt / ₹10 Spent
                </span>
                <span className="flex items-center gap-1.5 bg-[#252320] border border-[#34312C] px-2.5 py-1 rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A354]" />
                  Up to ₹500 Bag Discounts
                </span>
              </div>
            </div>

            {/* Live User Points Balance & Action */}
            <div className="bg-[#23211E] border border-[#3A3631] p-5 rounded-xs w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9E9689] block">
                  Your Loyalty Status
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-white font-mono">
                    {rewardPoints.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#C9A354] font-medium tracking-wide">
                    Points (~₹{Math.floor(rewardPoints / 2)} Bag Value)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAccountModal('rewards')}
                className="w-full sm:w-auto px-6 py-3 bg-[#FAF8F5] text-[#171615] text-[10px] font-semibold tracking-luxury uppercase hover:bg-[#C9A354] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer"
              >
                <span>VIEW POINTS & REDEEM DISCOUNTS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-16 border-b border-[#262422]">
          {/* Brand Column (takes 2 cols on lg) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <div className="flex items-baseline mb-4">
              <span className="font-serif text-3xl sm:text-4xl font-light tracking-[0.28em] text-white">
                LUSI
              </span>
            </div>

            <p className="text-sm text-[#A0988E] leading-relaxed mb-8 font-light max-w-sm">
              LUSI is a homegrown Indian fashion apparel brand creating modern, versatile and comfortable silhouettes for Men, Women and Kids.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#201E1C] flex items-center justify-center text-[#D6CEBF] hover:text-white hover:bg-[#8A5A44] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#201E1C] flex items-center justify-center text-[#D6CEBF] hover:text-white hover:bg-[#8A5A44] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#201E1C] flex items-center justify-center text-[#D6CEBF] hover:text-white hover:bg-[#8A5A44] transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-luxury text-white mb-5">
              SHOP
            </h4>
            <ul className="space-y-3 text-xs text-[#A8A095] font-light">
              <li>
                <button
                  type="button"
                  onClick={() => navigateToCategory('Men')}
                  className="hover:text-white transition-colors"
                >
                  Men
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToCategory('Women')}
                  className="hover:text-white transition-colors"
                >
                  Women
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToCategory('Kids')}
                  className="hover:text-white transition-colors"
                >
                  Kids
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToCategory('All')}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToCategory('All')}
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-luxury text-white mb-5">
              HELP
            </h4>
            <ul className="space-y-3 text-xs text-[#A8A095] font-light">
              <li>
                <a href="mailto:Help@lusi.in" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFAQs}
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFAQs}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFAQs}
                  className="hover:text-white transition-colors"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccountModal('track')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-white/90 font-medium cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#C9A354]" />
                  <span>Track My Order</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccountModal('history')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Purchase History</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccountModal('rewards')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#C9A354] font-medium pt-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>LUSI Rewards ({rewardPoints} pts)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-luxury text-white mb-5">
              COMPANY
            </h4>
            <ul className="space-y-3 text-xs text-[#A8A095] font-light">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  About LUSI
                </button>
              </li>
              <li>
                <a href="mailto:Help@lusi.in" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFAQs}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFAQs}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT Column */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-luxury text-white mb-5">
              CONTACT
            </h4>
            <ul className="space-y-3.5 text-xs text-[#A8A095] font-light">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                <a href="mailto:Help@lusi.in" className="hover:text-white transition-colors font-medium text-white">
                  Help@lusi.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                <a href="tel:+917248596540" className="hover:text-white transition-colors font-mono">
                  +91-7248596540
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                <span>Pan-India Delivery across all States & PIN codes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7369] gap-4 font-light">
          <p>© 2026 LUSI | All Rights Reserved</p>
          <div className="flex items-center gap-6 text-[11px] tracking-wider uppercase">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
            <button
              type="button"
              onClick={() => openAdminPanel()}
              className="text-[#C9A354] hover:text-white transition-colors font-mono font-medium flex items-center gap-1"
              title="Access Authorized Admin Panel"
            >
              <span>Admin Access (/admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
