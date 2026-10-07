import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface KidsSectionProps {
  onQuickView: (product: any) => void;
}

const KIDS_SUBCATEGORIES = [
  'Boys',
  'Girls',
  'T-Shirts',
  'Shirts',
  'Dresses',
  'Jeans',
  'Shorts',
  'Hoodies',
  'Co-ord Sets',
];

export const KidsSection: React.FC<KidsSectionProps> = ({ onQuickView }) => {
  const { products, categories, navigateToCategory } = useShop();

  const kidsCategory = categories?.find((c) => c.category === 'Kids');
  const subcategories = kidsCategory?.subcategories && kidsCategory.subcategories.length > 0
    ? kidsCategory.subcategories
    : KIDS_SUBCATEGORIES;

  const bannerImg = kidsCategory?.bannerImage || 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1200&q=80';

  const kidsProducts = products.filter((p) => p.category === 'Kids').slice(0, 4);

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Banner */}
        <div className="relative overflow-hidden bg-[#1E2824] text-white rounded-xs mb-14 sm:mb-18 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Banner Left Image */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:h-[400px] overflow-hidden">
              <ImageWithFallback
                src={bannerImg}
                alt="Lusi Kids collection editorial"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1E2824]/80 hidden lg:block" />
            </div>

            {/* Banner Right Copy */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-[10px] font-semibold tracking-luxury uppercase text-[#B2CEBF] mb-2.5 block">
                Kids Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4">
                BIG STYLE FOR LITTLE PERSONALITIES.
              </h2>
              <p className="text-sm sm:text-base text-[#D4E0D9] max-w-md font-light leading-relaxed mb-8">
                {kidsCategory?.description || 'Comfortable, playful and stylish clothing made for every adventure.'}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => navigateToCategory('Kids')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#EAE4D9] transition-all duration-300"
                >
                  <span>SHOP KIDS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory Navigation Scroller */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold tracking-luxury uppercase text-[#736C63]">
              Explore Kids' Categories
            </h3>
            <button
              type="button"
              onClick={() => navigateToCategory('Kids')}
              className="text-xs text-[#8A5A44] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>See All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => navigateToCategory('Kids', sub)}
                className="px-4.5 py-2 text-xs font-medium bg-[#FAF8F5] text-[#2E2B27] border border-[#E4DCD0] whitespace-nowrap hover:bg-[#171615] hover:text-white hover:border-[#171615] transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Kids Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {kidsProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
