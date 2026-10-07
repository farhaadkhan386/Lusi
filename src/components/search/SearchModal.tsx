import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Tag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';

const POPULAR_SEARCHES = [
  'Oversized T-Shirt',
  'Linen Co-ord Set',
  'Cargo Pants',
  'Kids Casual Hoodie',
  'Midi Dress',
  'Pure Cotton',
  'Casual Shirt',
  'Relaxed Jeans',
];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openProductPage, setSelectedProductForModal } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const normalized = searchTerm.trim().toLowerCase();

  const results = normalized
    ? products.filter((p) => {
        const matchName = p.name.toLowerCase().includes(normalized);
        const matchCat = p.category.toLowerCase().includes(normalized);
        const matchSub = p.subcategory.toLowerCase().includes(normalized);
        const matchGender = p.genderTag.toLowerCase().includes(normalized);
        const matchAge = p.ageGroup?.toLowerCase().includes(normalized);
        const matchDesc = p.description.toLowerCase().includes(normalized);
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(normalized));
        return matchName || matchCat || matchSub || matchGender || matchAge || matchDesc || matchTags;
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="min-h-full flex flex-col items-center justify-start p-4 sm:p-6 pt-12 sm:pt-20 relative z-10">
        <div className="w-full max-w-4xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden">
          {/* Search Header Bar */}
          <div className="p-5 sm:p-7 bg-white border-b border-[#EAE3D8] flex items-center gap-3.5">
            <SearchIcon className="w-5 h-5 text-[#8A5A44] shrink-0 stroke-[1.5]" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Men, Women, Kids, Linen, Co-ord, T-Shirts, Age groups..."
              className="flex-1 text-base sm:text-lg bg-transparent text-[#171615] placeholder-[#9E978C] focus:outline-none font-light"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-[10px] uppercase tracking-luxury text-[#8A8378] hover:text-[#171615] px-2 py-1 font-semibold"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 text-[#666056] hover:text-[#171615] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          {!searchTerm && (
            <div className="p-7 bg-[#FAF8F5]">
              <span className="text-[10px] font-semibold uppercase tracking-luxury text-[#8A8378] block mb-3.5">
                Curated Lookups
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchTerm(term)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-white border border-[#DDD5C8] text-[#2C2925] hover:border-[#171615] hover:bg-[#F2EDE4] transition-colors font-light"
                  >
                    <Tag className="w-3 h-3 text-[#8A5A44]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Area */}
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto">
            {searchTerm ? (
              results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs text-[#7A746B] font-light">
                      Catalog matches: <strong className="text-[#171615] font-mono">{results.length}</strong> styles for "{searchTerm}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          openProductPage(product);
                        }}
                      >
                        <ProductCard
                          product={product}
                          onQuickView={(p) => {
                            setIsSearchOpen(false);
                            setSelectedProductForModal(p);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-[#787167]">
                  <p className="font-serif text-2xl font-light text-[#171615]">No matches found for "{searchTerm}"</p>
                  <p className="text-xs text-[#807970] mt-1.5 mb-8 font-light">
                    Try searching for "Men", "Linen", "Kids Hoodie", "Co-ord", or "Cargo Pants".
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchTerm(term)}
                        className="px-3.5 py-1.5 bg-white border border-[#DDD5C8] text-xs hover:border-[#171615] font-light"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
