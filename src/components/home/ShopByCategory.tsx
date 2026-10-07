import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const ShopByCategory: React.FC = () => {
  const { categories, navigateToCategory } = useShop();

  // Display active dynamic categories synchronized with Firestore
  const activeCategories = categories && categories.length > 0
    ? categories.filter((c) => c.isActive !== false)
    : [];

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white border-y border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Editorial Lineage */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
              Three Universes · One Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Shop By Category
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-[#666057] max-w-md font-light leading-relaxed">
            Thoughtfully tailored apparel designed to meet the rhythm of contemporary Indian families.
          </p>
        </div>

        {/* Three Large Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {activeCategories.map((cat) => (
            <div
              key={cat.id || cat.category}
              onClick={() => navigateToCategory(cat.category)}
              className="group relative flex flex-col overflow-hidden bg-[#FAF8F5] cursor-pointer rounded-xs border border-[#EAE3D8] transition-all duration-500 hover:shadow-xl hover:border-[#C4B7A5]"
            >
              {/* Image Container with Zoom */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE3D8]">
                <ImageWithFallback
                  src={cat.image}
                  alt={`${cat.title} collection`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300" />

                {/* Overlaid Content at Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col justify-end text-white">
                  <span className="text-[10px] tracking-luxury uppercase font-semibold text-[#D8CFBC] mb-1.5 block">
                    {cat.title}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-2 leading-snug drop-shadow-xs">
                    {cat.subheading}
                  </h3>
                  <p className="text-xs text-[#E5DDD0] leading-relaxed line-clamp-2 mb-5 font-light">
                    {cat.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-white group-hover:text-[#F4EFEB] pt-1">
                    <span className="border-b border-white/80 pb-0.5 group-hover:border-white">
                      {cat.buttonText || `SHOP ${cat.category.toUpperCase()}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
