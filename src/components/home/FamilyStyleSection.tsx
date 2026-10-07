import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const FamilyStyleSection: React.FC = () => {
  const { navigateToCategory } = useShop();

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#F4EFEB] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xs bg-[#171615] text-white shadow-xl">
          <div className="relative min-h-[480px] sm:min-h-[560px] flex items-center">
            {/* Background Image with Calm Cinematic Scrim */}
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1800&q=80"
                alt="Family style by Lusi"
                className="w-full h-full object-cover opacity-65 transition-transform duration-1000 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
            </div>

            {/* Content Overlaid in Haute Editorial Style */}
            <div className="relative z-10 max-w-2xl px-8 py-14 sm:px-14 sm:py-20">
              <span className="text-[10px] font-semibold tracking-luxury uppercase text-[#DEC5AB] block mb-3">
                The Complete Family Wardrobe
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-5 leading-tight text-balance">
                ONE FAMILY. <span className="italic font-normal">ONE STYLE.</span>
              </h2>

              <p className="text-base sm:text-lg text-[#E0D9CE] leading-relaxed mb-10 max-w-lg font-light">
                From everyday essentials to special moments, discover styles made for everyone.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateToCategory('Men')}
                  className="px-6 py-3.5 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#F2EAE1] transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>SHOP MEN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateToCategory('Women')}
                  className="px-6 py-3.5 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#F2EAE1] transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>SHOP WOMEN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateToCategory('Kids')}
                  className="px-6 py-3.5 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#F2EAE1] transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>SHOP KIDS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
