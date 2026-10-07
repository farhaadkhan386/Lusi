import React from 'react';
import { Instagram } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#EFE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-medium tracking-luxury uppercase text-[#8A5A44] block mb-2">
            Community & Culture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight mb-2">
            FOLLOW THE LUSI LOOK
          </h2>
          <p className="text-xs sm:text-sm text-[#6C665F] font-light">
            Discover everyday style with{' '}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#171615] font-semibold underline hover:text-[#8A5A44] transition-colors"
            >
              @lusi
            </a>
          </p>
        </div>

        {/* 6-Image Fashion Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden bg-[#EDE6DC] rounded-xs cursor-pointer shadow-2xs border border-[#EAE3D8]"
            >
              <ImageWithFallback
                src={post.image}
                alt={post.tag}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Hover overlay with Instagram icon and caption */}
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center">
                <Instagram className="w-5 h-5 mb-2 text-[#EAE4D9] stroke-[1.5]" />
                <span className="text-[9px] font-semibold uppercase tracking-luxury text-[#DEC5AB] mb-1">
                  {post.tag}
                </span>
                <p className="text-[11px] text-white/90 line-clamp-2 leading-tight font-light">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
