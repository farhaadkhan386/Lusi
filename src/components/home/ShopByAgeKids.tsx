import React from 'react';
import { ArrowRight } from 'lucide-react';
import { KIDS_AGE_GROUPS } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { KidsAgeGroup } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const ShopByAgeKids: React.FC = () => {
  const { setFilters, setActiveView } = useShop();

  const handleAgeSelect = (age: KidsAgeGroup) => {
    setFilters((prev) => ({
      ...prev,
      category: 'Kids',
      subcategory: '',
      ageGroup: age,
    }));
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
              Sizing Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Shop By Age — Kids
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-sm text-[#666057] max-w-md font-light leading-relaxed">
            Engineered fit curves for each developmental stage, with growth-friendly cuffs and durable stretch.
          </p>
        </div>

        {/* 5 Age Group Cards with Luxury Framing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-6">
          {KIDS_AGE_GROUPS.map((group) => (
            <div
              key={group.label}
              onClick={() => handleAgeSelect(group.label)}
              className="group relative flex flex-col bg-white border border-[#E9E1D4] overflow-hidden rounded-xs cursor-pointer transition-all duration-500 hover:shadow-lg hover:border-[#171615]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE9DF]">
                <ImageWithFallback
                  src={group.image}
                  alt={group.label}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#171615]/85 backdrop-blur-xs px-2 py-0.5 border border-white/20">
                    {group.label}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#171615] group-hover:text-[#8A5A44] transition-colors leading-snug">
                    {group.range}
                  </h3>
                  <p className="text-xs text-[#7A746B] mt-1 line-clamp-2 font-light">
                    {group.desc}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#F0ECE1] flex items-center justify-between text-[10px] font-semibold uppercase tracking-luxury text-[#171615]">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
