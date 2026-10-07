import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const AboutLusiSection: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#FAF8F5] border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Lifestyle Image Left with Museum Matting Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-xs bg-[#EAE2D5] shadow-lg border border-[#E0D7C9]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                alt="About Lusi Indian fashion"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-103"
              />
            </div>
            {/* Elegant Floating Atelier Tag */}
            <div className="hidden sm:flex absolute -bottom-7 -right-7 bg-white p-6 shadow-xl border border-[#EDE5DA] max-w-xs items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#8A5A44] shrink-0 border border-[#E0D7CA]">
                <Sparkles className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-luxury text-[#171615]">Rooted in India</p>
                <p className="text-xs text-[#7A746B] mt-0.5 font-light">Woven with generational textile wisdom</p>
              </div>
            </div>
          </div>

          {/* Copy Right */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-3">
              The Atelier Story
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#171615] mb-6 text-balance leading-[1.08]">
              Made For Every <span className="italic font-normal">You.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#554E46] font-light leading-relaxed mb-6">
              LUSI is an Indian clothing brand creating modern, versatile and comfortable fashion for Men, Women and Kids. We believe great style should feel effortless, look timeless and fit naturally into everyday life.
            </p>
            <p className="text-sm text-[#736D65] leading-relaxed mb-9 font-light">
              Founded on the belief that everyday clothing should withstand Indian weather, endless commutes, and joyful family gatherings without sacrificing aesthetics. Every piece is cut from high-staple breathable cottons, fluid linens, and soft blends designed to be worn on repeat.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-all duration-300 shadow-xs active:scale-95"
              >
                <span>OUR STORY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
