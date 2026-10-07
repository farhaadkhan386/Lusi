import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Users } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const AboutView: React.FC = () => {
  const { navigateToCategory } = useShop();

  return (
    <div className="bg-[#FAF8F5] py-16 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Brand Kicker */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-3">
            The Atelier Philosophy
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#171615] tracking-tight mb-6">
            Made For Every <span className="italic font-normal">You.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#554E46] font-light leading-relaxed">
            LUSI is an Indian clothing brand creating modern, versatile and comfortable fashion for Men, Women and Kids. We believe great style should feel effortless, look timeless and fit naturally into everyday life.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-xs overflow-hidden shadow-xl bg-[#EDE6DC] border border-[#EAE3D8]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
                alt="LUSI family togetherness"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-103"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-sm text-[#544F48] leading-relaxed font-light">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#171615]">
              From Heritage Fiber to Everyday Modernity
            </h2>
            <p>
              Growing up in India, clothing was never just fabric—it was the tactile memory of soft cotton kurtas on blistering summer afternoons, linen shirts worn on coastal train journeys, and durable shorts that endured endless gullies and playgrounds.
            </p>
            <p>
              Yet, modern fast fashion often ignored the reality of our lives: tropical humidity, long days of commutes, and the need for clothes that look refined at 9 AM and remain comfortable at 9 PM.
            </p>
            <p>
              LUSI was founded to bridge that divide. We obsess over the weight of cotton, the breathability of linen, the drop of an armhole, and tagless softness for our children. No fussy labels, no disposable gimmicks. Just timeless silhouettes you reach for instinctively.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-y border-[#EAE3D8] mb-20">
          <div className="p-8 bg-white border border-[#EBE4D8] rounded-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#8A5A44] mb-5 border border-[#DDD5C8]">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#171615] mb-2.5">
              Generational Indian Craft
            </h3>
            <p className="text-xs text-[#6A645C] leading-relaxed font-light">
              We partner with responsible mills in Tirupur, Surat, and Ahmedabad to ensure ethical wages, safe dyeing practices, and authentic long-staple Indian yarns.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#EBE4D8] rounded-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#8A5A44] mb-5 border border-[#DDD5C8]">
              <Users className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#171615] mb-2.5">
              For The Whole Family
            </h3>
            <p className="text-xs text-[#6A645C] leading-relaxed font-light">
              Why should parents shop at three different stores? Lusi creates a cohesive design vocabulary so Men, Women, and Kids can experience matched quality.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#EBE4D8] rounded-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#8A5A44] mb-5 border border-[#DDD5C8]">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#171615] mb-2.5">
              Honest Everyday Pricing
            </h3>
            <p className="text-xs text-[#6A645C] leading-relaxed font-light">
              By designing in-house and shipping direct to Indian doorsteps, we offer luxury-grade fabrics in ₹ without middleman markups.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <h3 className="font-serif text-3xl font-light text-[#171615] mb-6">
            Ready to experience Lusi?
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigateToCategory('Men')}
              className="px-7 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-all"
            >
              Shop Men
            </button>
            <button
              type="button"
              onClick={() => navigateToCategory('Women')}
              className="px-7 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-all"
            >
              Shop Women
            </button>
            <button
              type="button"
              onClick={() => navigateToCategory('Kids')}
              className="px-7 py-3.5 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-all"
            >
              Shop Kids
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
