import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';

interface NewArrivalsProps {
  onQuickView: (product: any) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ onQuickView }) => {
  const { products, navigateToCategory } = useShop();
  const [activeTab, setActiveTab] = useState<'ALL' | 'MEN' | 'WOMEN' | 'KIDS'>('ALL');

  // Filter products based on tab
  const filteredProducts = products.filter((p) => {
    if ((p as any).status === 'Draft' || (p as any).status === 'Archived') return false;
    if (activeTab === 'ALL') return true;
    if (activeTab === 'MEN') return p.category === 'Men';
    if (activeTab === 'WOMEN') return p.category === 'Women';
    if (activeTab === 'KIDS') return p.category === 'Kids';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Luxury Segmented Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
              Fresh Off The Looms
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
              New Arrivals
            </h2>
          </div>

          {/* Category Tabs (Segmented Control - compliant with frontend design skill) */}
          <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xs self-start md:self-auto overflow-x-auto max-w-full">
            {(['ALL', 'MEN', 'WOMEN', 'KIDS'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4.5 py-2 text-[11px] font-semibold tracking-luxury uppercase transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#171615] text-[#FAF8F5] shadow-xs'
                    : 'text-[#615B54] hover:text-[#171615] hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Button in High-Fashion Style */}
        <div className="mt-14 sm:mt-18 text-center">
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'ALL') navigateToCategory('All');
              else if (activeTab === 'MEN') navigateToCategory('Men');
              else if (activeTab === 'WOMEN') navigateToCategory('Women');
              else navigateToCategory('Kids');
            }}
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-transparent border border-[#171615] text-[#171615] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#171615] hover:text-[#FAF8F5] transition-all duration-300 active:scale-95"
          >
            <span>View All {activeTab === 'ALL' ? 'New Arrivals' : `${activeTab}'s New Arrivals`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
