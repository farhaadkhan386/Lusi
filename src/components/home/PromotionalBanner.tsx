import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const PromotionalBanner: React.FC = () => {
  const { navigateToCategory } = useShop();

  return (
    <section className="relative overflow-hidden bg-[#24211E] text-white py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="Lusi fashion banner"
          className="w-full h-full object-cover opacity-40 transition-transform duration-1000 hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#24211E] via-[#24211E]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="text-[10px] font-semibold tracking-luxury uppercase text-[#D5B898] block mb-3">
            Seasonal Campaign Lookbook
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-5 leading-tight text-balance">
            THE NEW <span className="italic font-normal">EVERYDAY</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D9D3CA] leading-relaxed mb-9 font-light">
            Discover versatile styles for every wardrobe.
          </p>
          <button
            type="button"
            onClick={() => navigateToCategory('All')}
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#EAE4D9] transition-all duration-300 shadow-md"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
