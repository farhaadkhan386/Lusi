import React from 'react';
import { Award, Compass, HeartHandshake, RotateCcw } from 'lucide-react';

const FEATURES = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'High-GSM combed cottons, durable seams, and wash-tested dyes designed to endure daily life.',
  },
  {
    icon: Compass,
    title: 'Designed in India',
    description: 'Conceived and tailored domestically for Indian silhouettes, climates, and occasions.',
  },
  {
    icon: HeartHandshake,
    title: 'Comfortable Everyday Styles',
    description: 'Fluid drape, tagless kidswear, and relaxed tailoring you will reach for every morning.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free 7-day doorstep pickup exchanges and instant refunds with dedicated care.',
  },
];

export const WhyChooseLusi: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-18">
          <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
            The LUSI Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight">
            Why Choose LUSI
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 bg-[#FAF8F5] border border-[#EAE3D8] rounded-xs transition-all duration-500 hover:border-[#171615] hover:shadow-xs group"
              >
                <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center text-[#171615] mb-5 border border-[#E2D8CC] shadow-2xs group-hover:bg-[#171615] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#171615] mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6860] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
