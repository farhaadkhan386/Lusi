import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    openProductPage,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#EAE3D8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8C533E] fill-[#8C533E]" />
              <h2 className="font-serif text-lg font-semibold text-[#1E1E1E]">
                Saved Styles ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-[#5F5850] hover:text-[#1E1E1E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#787167]">
                <Heart className="w-12 h-12 text-[#9A9388] stroke-1 mb-3" />
                <h3 className="font-serif text-xl font-medium text-[#1E1E1E]">Your wishlist is empty</h3>
                <p className="text-xs text-[#7A7369] max-w-xs mt-1">
                  Save items you love by tapping the heart icon on any product card.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-white border border-[#EBE4D8] rounded-xs shadow-2xs"
                >
                  <div
                    className="w-20 h-24 shrink-0 overflow-hidden bg-[#F2EDE4] cursor-pointer"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      openProductPage(product);
                    }}
                  >
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            openProductPage(product);
                          }}
                          className="text-xs font-medium text-[#1E1E1E] line-clamp-1 cursor-pointer hover:text-[#8C533E]"
                        >
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#9E978C] hover:text-[#1E1E1E] p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#7A746B] uppercase tracking-wider mt-0.5">
                        {product.category} · {product.subcategory}
                      </p>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xs font-semibold tabular-nums text-[#1E1E1E]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-[#9E978C] line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultColor = product.colors[0] || { name: 'Standard', hex: '#222' };
                          const defaultSize = product.sizes[0] || 'M';
                          addToCart(product, defaultColor, defaultSize, 1);
                        }}
                        className="w-full py-1.5 bg-[#1E1E1E] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#38332F] flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
