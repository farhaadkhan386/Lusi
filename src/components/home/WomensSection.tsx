import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface WomensSectionProps {
  onQuickView: (product: any) => void;
}

const WOMEN_SUBCATEGORIES = [
  'Tops',
  'T-Shirts',
  'Dresses',
  'Shirts',
  'Jeans',
  'Trousers',
  'Co-ord Sets',
  'Hoodies',
  'Jackets',
];

export const WomensSection: React.FC<WomensSectionProps> = ({ onQuickView }) => {
  const { products, categories, navigateToCategory } = useShop();

  const womenCategory = categories?.find((c) => c.category === 'Women');
  const subcategories = womenCategory?.subcategories && womenCategory.subcategories.length > 0
    ? womenCategory.subcategories
    : WOMEN_SUBCATEGORIES;

  const bannerImg = womenCategory?.bannerImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80';

  const womenProducts = products.filter((p) => p.category === 'Women').slice(0, 4);

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Banner */}
        <div className="relative overflow-hidden bg-[#2C241E] text-white rounded-xs mb-14 sm:mb-18 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Banner Left Copy */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <span className="text-[10px] font-semibold tracking-luxury uppercase text-[#DEC2A8] mb-2.5 block">
                Women's Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4">
                YOUR STYLE. YOUR RULES.
              </h2>
              <p className="text-sm sm:text-base text-[#DCD4CA] max-w-md font-light leading-relaxed mb-8">
                {womenCategory?.description || 'Effortless silhouettes designed for modern women.'}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => navigateToCategory('Women')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#EAE4D9] transition-all duration-300"
                >
                  <span>SHOP WOMEN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner Right Image */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:h-[400px] overflow-hidden order-1 lg:order-2">
              <ImageWithFallback
                src={bannerImg}
                alt="Lusi Women collection editorial"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2C241E]/80 hidden lg:block" />
            </div>
          </div>
        </div>

        {/* Subcategory Navigation Scroller */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold tracking-luxury uppercase text-[#736C63]">
              Explore Women's Categories
            </h3>
            <button
              type="button"
              onClick={() => navigateToCategory('Women')}
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
                onClick={() => navigateToCategory('Women', sub)}
                className="px-4.5 py-2 text-xs font-medium bg-white text-[#2E2B27] border border-[#E4DCD0] whitespace-nowrap hover:bg-[#171615] hover:text-white hover:border-[#171615] transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Women's Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {womenProducts.map((product) => (
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
