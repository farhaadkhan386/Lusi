import React, { useState } from 'react';
import {
  Store,
  Image as ImageIcon,
  Check,
  Eye,
  Save,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminStorefrontView: React.FC = () => {
  const { banners, updateBanner, settings, updateSettings, products } = useAdmin();
  const [activeTab, setActiveTab] = useState<'hero' | 'promo' | 'family' | 'ticker'>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hero Banner Editing
  const heroBanner = banners.find((b) => b.type === 'Homepage Hero') || banners[0];
  const promoBanner = banners.find((b) => b.type === 'Promotion Banner') || banners[1];
  const familyBanner = banners.find((b) => b.type === 'Category Banner') || banners[2];

  const [heroHeading, setHeroHeading] = useState(heroBanner?.heading || 'Style For Every Story.');
  const [heroDesc, setHeroDesc] = useState(
    heroBanner?.description || 'Modern fashion for Men, Women & Kids — designed for every moment.'
  );
  const [heroImage, setHeroImage] = useState(
    heroBanner?.image ||
      '/src/assets/images/indian_fashion_editorial_hero.jpg'
  );

  const [ticker1, setTicker1] = useState(settings.noticeBarText);
  const [ticker2, setTicker2] = useState(settings.secondaryNoticeText);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroBanner) {
      updateBanner(heroBanner.id, {
        heading: heroHeading,
        description: heroDesc,
        image: heroImage,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      noticeBarText: ticker1,
      secondaryNoticeText: ticker2,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Storefront CMS Management</h2>
          <p className="text-xs text-[#8A7E6E]">
            Edit homepage hero banners, promotional strips, and announcement bar without editing code.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xs flex items-center gap-1.5 font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Storefront updated successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#292219] pb-3 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3 py-1.5 rounded-xs uppercase transition-colors ${
            activeTab === 'hero' ? 'bg-[#C9A354] text-black font-semibold' : 'text-[#8A7E6E] hover:text-white'
          }`}
        >
          Hero Campaign
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ticker')}
          className={`px-3 py-1.5 rounded-xs uppercase transition-colors ${
            activeTab === 'ticker' ? 'bg-[#C9A354] text-black font-semibold' : 'text-[#8A7E6E] hover:text-white'
          }`}
        >
          Top Announcement Ticker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('promo')}
          className={`px-3 py-1.5 rounded-xs uppercase transition-colors ${
            activeTab === 'promo' ? 'bg-[#C9A354] text-black font-semibold' : 'text-[#8A7E6E] hover:text-white'
          }`}
        >
          Mid-Season Promo Banner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`px-3 py-1.5 rounded-xs uppercase transition-colors ${
            activeTab === 'family' ? 'bg-[#C9A354] text-black font-semibold' : 'text-[#8A7E6E] hover:text-white'
          }`}
        >
          Family Section ("One Family")
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSaveHero} className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs space-y-4">
            <h3 className="font-serif text-lg text-white font-light mb-2">Homepage Hero Configuration</h3>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">Hero Heading</label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                Hero Subheading / Description
              </label>
              <textarea
                rows={3}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
                Campaign Photograph URL (Apparel Only)
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-[#736857] mt-1 block">
                Must feature models wearing clothing. Never use shoes or footwear photography.
              </span>
            </div>

            <div className="pt-4 border-t border-[#262018] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black font-semibold text-xs rounded-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Live Hero Changes</span>
              </button>
            </div>
          </form>

          {/* Live Preview Box */}
          <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-[#8A7E6E] mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#C9A354]" />
                <span>Live Preview Rendering</span>
              </div>
              <div className="relative aspect-[16/10] rounded-xs overflow-hidden border border-[#2B2319] mb-4">
                <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#C9A354]">
                    LUSI AUTUMN WINTER
                  </span>
                  <h4 className="font-serif text-xl text-white font-light leading-tight">{heroHeading}</h4>
                  <p className="text-[11px] text-[#DDD6C8] line-clamp-2 mt-1">{heroDesc}</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#736857] italic">
              Changes saved will reflect on the live customer homepage immediately.
            </div>
          </div>
        </div>
      )}

      {/* Ticker Tab */}
      {activeTab === 'ticker' && (
        <form onSubmit={handleSaveTicker} className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs max-w-2xl space-y-4">
          <h3 className="font-serif text-lg text-white font-light mb-2">Top Announcement Bar Messages</h3>

          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
              Primary Notice Message
            </label>
            <input
              type="text"
              value={ticker1}
              onChange={(e) => setTicker1(e.target.value)}
              className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-[#8A7E6E] mb-1">
              Secondary Privilege Offer Code Message
            </label>
            <input
              type="text"
              value={ticker2}
              onChange={(e) => setTicker2(e.target.value)}
              className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-4 border-t border-[#262018] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black font-semibold text-xs rounded-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Announcement Bar</span>
            </button>
          </div>
        </form>
      )}

      {/* Promo Banner Tab */}
      {activeTab === 'promo' && (
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs max-w-2xl space-y-4">
          <h3 className="font-serif text-lg text-white font-light">Mid-Season Promotional Strip</h3>
          <p className="text-xs text-[#8A7E6E]">
            Displayed between Family Style and Brand Story sections on the customer homepage.
          </p>
          <div className="p-4 bg-[#1F1B16] rounded-xs border border-[#332A1F] space-y-2 text-xs">
            <div className="font-semibold text-white">{promoBanner.heading}</div>
            <div className="text-[#A89E8F] text-[11px]">{promoBanner.description}</div>
            <div className="text-[10px] text-[#C9A354] font-mono">Button: {promoBanner.buttonText}</div>
          </div>
        </div>
      )}

      {/* Family Section Tab */}
      {activeTab === 'family' && (
        <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs max-w-2xl space-y-4">
          <h3 className="font-serif text-lg text-white font-light">"ONE FAMILY. ONE STYLE." Campaign</h3>
          <p className="text-xs text-[#8A7E6E]">
            Showcases Men, Women & Kids coordinated aesthetic.
          </p>
          <div className="p-4 bg-[#1F1B16] rounded-xs border border-[#332A1F] space-y-2 text-xs">
            <div className="font-semibold text-white">{familyBanner.heading}</div>
            <div className="text-[#A89E8F] text-[11px]">{familyBanner.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};
