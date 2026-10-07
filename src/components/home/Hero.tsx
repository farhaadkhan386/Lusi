import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const Hero: React.FC = () => {
  const { navigateToCategory } = useShop();

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 sm:pt-10 pb-16 sm:pb-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Editorial Haute Horlogerie / Fashion Lookbook */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 pt-2 lg:pt-0">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] mb-4">
              <span>Chapter I — The Indian Wardrobe</span>
              <span className="text-[#B5ADA1]" aria-hidden="true">/</span>
              <span className="text-[#7A7369]">Est. 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[70px] font-light tracking-tight text-[#171615] leading-[1.06] mb-6 text-balance">
              Style For Every <span className="italic font-normal">Story.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#554E46] max-w-xl font-light leading-relaxed mb-10">
              Modern fashion for Men, Women & Kids — designed for every moment.
            </p>

            {/* Tri-Button Action Suite in High-Fashion Style */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigateToCategory('Men')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase transition-all duration-300 hover:bg-[#34302C] active:scale-95 shadow-xs"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('Women')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-[#171615] border border-[#D5CCC0] text-[11px] font-semibold tracking-luxury uppercase transition-all duration-300 hover:bg-[#F2EDE4] hover:border-[#171615] active:scale-95 shadow-xs"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('Kids')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#F2EDE4] text-[#171615] text-[11px] font-semibold tracking-luxury uppercase transition-all duration-300 hover:bg-[#E5DDD0] active:scale-95"
              >
                <span>SHOP KIDS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quiet Luxury Value Highlights */}
            <div className="mt-12 pt-8 border-t border-[#EAE3D8] grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="text-[10px] font-semibold tracking-luxury uppercase text-[#171615]">Design Origin</p>
                <p className="text-xs text-[#7A7369] mt-1 font-light">Crafted in India</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-luxury uppercase text-[#171615]">Textile Weight</p>
                <p className="text-xs text-[#7A7369] mt-1 font-light">Pure long-staple cotton</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-luxury uppercase text-[#171615]">Family Universe</p>
                <p className="text-xs text-[#7A7369] mt-1 font-light">Men · Women · Kids</p>
              </div>
            </div>
          </div>

          {/* Right Image Feature Block */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {/* Main Lifestyle Hero Photography with Magazine Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[15/11] overflow-hidden rounded-xs shadow-lg bg-[#EAE3D5] border border-[#E0D7C9]">
                <ImageWithFallback
                  src="/src/assets/images/indian_fashion_editorial_hero.jpg"
                  alt="Modern Indian fashion editorial featuring stylish contemporary clothing in premium linen, silk, and raw cotton"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                {/* Editorial Plaque */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury font-medium text-[#DEC2A8] block mb-1">
                      Campaign 2026 Lookbook
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-normal drop-shadow-xs">
                      The Harmony of Shared Silhouettes
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-black/50 backdrop-blur-md px-3 py-1 border border-white/20">
                    EDITION 01
                  </span>
                </div>
              </div>

              {/* Editorial Quote Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-[#FAF8F5] p-4.5 border border-[#E0D7C9] shadow-sm max-w-[220px]">
                <p className="font-serif italic text-sm text-[#38332E] leading-snug">
                  "Effortless style for every story."
                </p>
                <span className="text-[9px] uppercase tracking-luxury text-[#9E978C] block mt-2">
                  Lusi Atelier India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
