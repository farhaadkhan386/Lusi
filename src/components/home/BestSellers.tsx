import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

interface BestSellersProps {
  onQuickView: (product: any) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onQuickView }) => {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState<'Men' | 'Women' | 'Kids'>('Men');

  const bestSellers = products
    .filter((p) => p.category === activeTab && (p.isBestSeller || p.rating >= 4.8))
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Segmented Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
              Patron Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xs self-start sm:self-auto">
            {(['Men', 'Women', 'Kids'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4.5 py-2 text-[11px] font-semibold tracking-luxury uppercase transition-all ${
                  activeTab === tab
                    ? 'bg-[#171615] text-[#FAF8F5] shadow-xs'
                    : 'text-[#615B54] hover:text-[#171615]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products: Grid on Desktop, Horizontally Scrollable on Mobile with Peek Margin */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="w-[78vw] max-w-[280px] sm:w-auto sm:max-w-none snap-center shrink-0 sm:shrink"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
