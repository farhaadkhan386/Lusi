import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { KidsAgeGroup, SortOption } from '../../types';

interface CategoryFilterViewProps {
  onQuickView: (product: any) => void;
  onOpenSizeGuide: () => void;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2Y', '4Y', '6Y', '8Y', '10Y', '12Y', '14Y'];

const KIDS_AGES: KidsAgeGroup[] = ['0–2 Years', '2–5 Years', '6–9 Years', '10–13 Years', '14+ Years'];

export const CategoryFilterView: React.FC<CategoryFilterViewProps> = ({ onQuickView, onOpenSizeGuide }) => {
  const { products, categories, filters, setFilters, resetFilters } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available subcategories depending on selected Category and Firestore taxonomy
  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    if (filters.category && filters.category !== 'All') {
      const catObj = categories?.find((c) => c.category === filters.category);
      if (catObj && catObj.subcategories.length > 0) {
        catObj.subcategories.forEach((s) => set.add(s));
      }
      products.filter((p) => p.category === filters.category).forEach((p) => set.add(p.subcategory));
    } else {
      categories?.forEach((c) => c.subcategories.forEach((s) => set.add(s)));
      products.forEach((p) => set.add(p.subcategory));
    }
    return Array.from(set);
  }, [products, categories, filters.category]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Exclude unpublished draft / archived products from public storefront
        if ((p as any).status === 'Draft' || (p as any).status === 'Archived') {
          return false;
        }
        // Category
        if (filters.category && filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }
        // Subcategory
        if (filters.subcategory && p.subcategory !== filters.subcategory) {
          return false;
        }
        // Size
        if (filters.size && !p.sizes.includes(filters.size)) {
          return false;
        }
        // Color
        if (filters.color) {
          const hasColor = p.colors.some((c) =>
            c.name.toLowerCase().includes(filters.color!.toLowerCase())
          );
          if (!hasColor) return false;
        }
        // Price
        if (p.price < filters.minPrice || p.price > filters.maxPrice) {
          return false;
        }
        // Kids Age Group
        if (filters.ageGroup && p.ageGroup && p.ageGroup !== filters.ageGroup) {
          return false;
        }
        // Availability
        if (filters.inStockOnly && !p.inStock) {
          return false;
        }
        // Rating
        if (filters.rating && p.rating < filters.rating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (filters.sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return b.rating - a.rating;
      });
  }, [products, filters]);

  // Active filter count
  const activeCount = [
    filters.category !== 'All' ? filters.category : null,
    filters.subcategory,
    filters.size,
    filters.color,
    filters.ageGroup,
    filters.inStockOnly ? 'In Stock' : null,
    filters.rating ? `${filters.rating}+ Stars` : null,
  ].filter(Boolean).length;

  const FilterSidebarContent = (
    <div className="space-y-6 text-xs text-[#2E2B27]">
      {/* Department */}
      <div>
        <h4 className="font-semibold uppercase tracking-luxury text-[10px] text-[#171615] mb-3">
          Department
        </h4>
        <div className="space-y-2">
          {(['All', 'Men', 'Women', 'Kids'] as const).map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer hover:text-[#171615] transition-colors"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, category: cat, subcategory: '', ageGroup: undefined }))
                }
                className="text-[#171615]"
              />
              <span className={filters.category === cat ? 'font-semibold text-[#171615]' : 'text-[#615C56]'}>
                {cat === 'All' ? 'All Collections' : `${cat}'s Fashion`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div className="pt-5 border-t border-[#EAE3D8]">
          <h4 className="font-semibold uppercase tracking-luxury text-[10px] text-[#171615] mb-3">
            Subcategory
          </h4>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="subcategory"
                checked={!filters.subcategory}
                onChange={() => setFilters((prev) => ({ ...prev, subcategory: '' }))}
              />
              <span className={!filters.subcategory ? 'font-semibold text-[#171615]' : 'text-[#615C56]'}>
                All Types
              </span>
            </label>
            {availableSubcategories.map((sub) => (
              <label key={sub} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="subcategory"
                  checked={filters.subcategory === sub}
                  onChange={() => setFilters((prev) => ({ ...prev, subcategory: sub }))}
                />
                <span className={filters.subcategory === sub ? 'font-semibold text-[#171615]' : 'text-[#615C56]'}>
                  {sub}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      <div className="pt-5 border-t border-[#EAE3D8]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold uppercase tracking-luxury text-[10px] text-[#171615]">
            Size
          </h4>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[11px] text-[#8A5A44] underline"
          >
            Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  size: prev.size === sz ? '' : sz,
                }))
              }
              className={`min-w-[34px] px-2.5 py-1 text-xs border rounded-xs transition-colors font-mono ${
                filters.size === sz
                  ? 'bg-[#171615] text-[#FAF8F5] border-[#171615]'
                  : 'bg-white border-[#D5CCC0] text-[#4A453F] hover:border-[#171615]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Kids Age Filter */}
      {(filters.category === 'Kids' || filters.category === 'All') && (
        <div className="pt-5 border-t border-[#EAE3D8]">
          <h4 className="font-semibold uppercase tracking-luxury text-[10px] text-[#171615] mb-3">
            Kids Age Group
          </h4>
          <div className="space-y-2">
            {KIDS_AGES.map((age) => (
              <label key={age} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ageGroup === age}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      ageGroup: prev.ageGroup === age ? undefined : age,
                    }))
                  }
                />
                <span className="text-[#615C56]">{age}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="pt-5 border-t border-[#EAE3D8]">
        <h4 className="font-semibold uppercase tracking-luxury text-[10px] text-[#171615] mb-2">
          Max Ceiling: ₹{filters.maxPrice.toLocaleString('en-IN')}
        </h4>
        <input
          type="range"
          min={1000}
          max={6000}
          step={200}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-[#171615] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#8A847A] mt-1 font-mono">
          <span>₹1,000</span>
          <span>₹6,000+</span>
        </div>
      </div>

      {/* Availability */}
      <div className="pt-5 border-t border-[#EAE3D8]">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
          />
          <span className="font-medium text-[#171615]">Ready In Atelier</span>
        </label>
      </div>

      {/* Reset Button */}
      {activeCount > 0 && (
        <div className="pt-5">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full py-2.5 bg-white border border-[#DDD5C8] text-[#171615] text-[10px] font-semibold uppercase tracking-luxury hover:bg-[#F2EDE4] flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-screen pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 pb-8 border-b border-[#EAE3D8]">
          <div className="text-xs text-[#7A746B] mb-3 flex items-center gap-2.5 font-light">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#171615] font-medium">
              {filters.category === 'All' ? 'All Collections' : `${filters.category}'s Fashion`}
            </span>
            {filters.subcategory && (
              <>
                <span>/</span>
                <span className="text-[#8A5A44] font-medium">{filters.subcategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
                {filters.category === 'All' ? 'Complete Collection' : `${filters.category}'s Collection`}
              </h1>
              <p className="text-xs text-[#7A746B] mt-1.5 font-light">
                Curated portfolio · <strong className="text-[#171615] font-mono">{filteredProducts.length}</strong> styles
              </p>
            </div>

            {/* Sort Dropdown & Mobile Filter Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDD5C8] text-[10px] font-semibold uppercase tracking-luxury text-[#171615] shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeCount > 0 ? `(${activeCount})` : ''}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-[#7A746B] uppercase font-semibold tracking-luxury text-[10px]">
                  Sort:
                </span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as SortOption,
                    }))
                  }
                  className="px-3.5 py-2.5 bg-white border border-[#DDD5C8] text-xs font-medium text-[#171615] focus:outline-none focus:border-[#171615] cursor-pointer"
                >
                  <option value="recommended">Curated / Recommended</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="best-selling">Patron Favorites</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 bg-white p-6 border border-[#EAE3D8] rounded-xs shadow-2xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F0ECE1] mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-luxury text-[#171615] flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Refine Catalog</span>
                </h3>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] text-[#8A5A44] hover:underline"
                  >
                    Clear ({activeCount})
                  </button>
                )}
              </div>
              {FilterSidebarContent}
            </div>
          </aside>

          {/* Product Grid Area with Generous Spacing */}
          <main className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white border border-[#EAE3D8] rounded-xs">
                <p className="font-serif text-2xl font-light text-[#171615]">No styles match your criteria</p>
                <p className="text-xs text-[#7A746B] mt-2 mb-8 font-light">
                  Try clearing some filter parameters or selecting a broader department.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-8 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C]"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FAF8F5] shadow-2xl flex flex-col">
              <div className="p-5 bg-white border-b border-[#EAE3D8] flex items-center justify-between">
                <span className="font-serif text-xl font-light text-[#171615]">Refine Catalog</span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#666056]"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{FilterSidebarContent}</div>
              <div className="p-5 bg-white border-t border-[#EAE3D8]">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3.5 bg-[#171615] text-white text-[11px] font-semibold tracking-luxury uppercase"
                >
                  SHOW {filteredProducts.length} STYLES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
