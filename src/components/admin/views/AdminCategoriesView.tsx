import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { Category, CategoryData } from '../../../types';

export const AdminCategoriesView: React.FC = () => {
  const { products, categories, updateCategory } = useAdmin();
  const [activeGender, setActiveGender] = useState<Category>('Men');

  // Find active category from dynamic categories or fallback
  const activeCategory = categories.find((c) => c.category === activeGender) || categories[0];

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CategoryData>>({});
  const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleStartEdit = () => {
    if (!activeCategory) return;
    setFormData({
      title: activeCategory.title,
      subheading: activeCategory.subheading,
      description: activeCategory.description,
      buttonText: activeCategory.buttonText,
      image: activeCategory.image,
      bannerImage: activeCategory.bannerImage,
      subcategories: [...activeCategory.subcategories],
      isActive: activeCategory.isActive,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({});
    setNewSubcategoryInput('');
  };

  const handleAddSubcategory = () => {
    const trimmed = newSubcategoryInput.trim();
    if (!trimmed) return;
    const currentSubs = formData.subcategories || activeCategory.subcategories || [];
    if (currentSubs.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      subcategories: [...currentSubs, trimmed],
    }));
    setNewSubcategoryInput('');
  };

  const handleRemoveSubcategory = (subToRemove: string) => {
    const currentSubs = formData.subcategories || activeCategory.subcategories || [];
    setFormData((prev) => ({
      ...prev,
      subcategories: currentSubs.filter((s) => s !== subToRemove),
    }));
  };

  const handleSaveCategory = () => {
    if (!activeCategory) return;
    updateCategory(activeCategory.id, formData);
    setIsEditing(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3500);
  };

  // Quick remove subcategory even in view mode
  const handleDirectRemoveSub = (subToRemove: string) => {
    if (!activeCategory) return;
    const nextSubs = activeCategory.subcategories.filter((s) => s !== subToRemove);
    updateCategory(activeCategory.id, { subcategories: nextSubs });
  };

  // Quick add subcategory even in view mode
  const handleDirectAddSub = () => {
    const trimmed = newSubcategoryInput.trim();
    if (!trimmed || !activeCategory) return;
    if (activeCategory.subcategories.includes(trimmed)) return;
    const nextSubs = [...activeCategory.subcategories, trimmed];
    updateCategory(activeCategory.id, { subcategories: nextSubs });
    setNewSubcategoryInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-light text-white">Category & Taxonomy Management</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Firestore Live
            </span>
          </div>
          <p className="text-xs text-[#8A7E6E] mt-1">
            Dynamic Firestore collections for Men, Women & Kids departments. Updates instantly synchronize with the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccessNotice && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xs animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Synchronized with Firestore</span>
            </div>
          )}

          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A354] hover:bg-[#D4B26F] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Department</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-2 bg-[#25211B] hover:bg-[#322C24] text-xs text-[#A89F91] hover:text-white rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A354] hover:bg-[#D4B26F] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Firestore</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Department Selector */}
      <div className="flex items-center gap-2 border-b border-[#292219] pb-3 text-xs font-mono">
        {(['Men', 'Women', 'Kids'] as Category[]).map((gender) => {
          const count = products.filter((p) => p.category === gender).length;
          const isSelected = activeGender === gender;
          return (
            <button
              key={gender}
              type="button"
              onClick={() => {
                setActiveGender(gender);
                if (isEditing) setIsEditing(false);
              }}
              className={`px-4 py-2 rounded-xs uppercase transition-colors flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#C9A354] text-black font-semibold'
                  : 'text-[#8A7E6E] hover:text-white bg-[#191613]'
              }`}
            >
              <span>{gender}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-xs bg-black/20">
                {count} styles
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Category Details & Editor */}
      {activeCategory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Media & Meta */}
          <div className="lg:col-span-5 space-y-6">
            {/* Department Card Showcase */}
            <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#262017] pb-3">
                <span className="text-[10px] uppercase font-mono text-[#C9A354] tracking-wider">
                  STOREFRONT CARD & HERO BANNER
                </span>
                <span className="text-[10px] font-mono text-[#736857]">
                  ID: {activeCategory.id}
                </span>
              </div>

              {!isEditing ? (
                <div>
                  <h3 className="font-serif text-2xl text-white font-light">
                    {activeCategory.title}
                  </h3>
                  <div className="text-xs text-[#C9A354] font-medium mt-0.5">
                    {activeCategory.subheading}
                  </div>
                  <p className="text-xs text-[#A89E8F] mt-2 leading-relaxed">
                    {activeCategory.description}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] text-[#786C5B] uppercase font-mono block mb-1">
                        Category Card Image
                      </span>
                      <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-[#2A231A]">
                        <img
                          src={activeCategory.image}
                          alt={activeCategory.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#786C5B] uppercase font-mono block mb-1">
                        Editorial Department Banner
                      </span>
                      <div className="relative aspect-[16/9] rounded-xs overflow-hidden border border-[#2A231A]">
                        <img
                          src={activeCategory.bannerImage}
                          alt={`${activeCategory.title} banner`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Editable Form */
                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Department Display Title
                    </label>
                    <input
                      type="text"
                      value={formData.title ?? activeCategory.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Subheading / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.subheading ?? activeCategory.subheading}
                      onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description ?? activeCategory.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText ?? activeCategory.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Department Card Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image ?? activeCategory.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354] font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#A89E8F] mb-1">
                      Editorial Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.bannerImage ?? activeCategory.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#201C17] border border-[#342D23] rounded-xs text-white focus:outline-none focus:border-[#C9A354] font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Taxonomy & Subcategories */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-[#171512] border border-[#2B251D] rounded-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#262017]">
                <div>
                  <h4 className="font-serif text-lg text-white font-light">
                    Active Subcategories for {activeGender}
                  </h4>
                  <p className="text-xs text-[#8A7E6E] mt-0.5">
                    Subcategories dynamically drive filter pills, category carousels, and product tagging.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#C9A354] px-2.5 py-1 rounded-xs bg-[#241F18] border border-[#382F24] self-start sm:self-auto">
                  {(isEditing ? formData.subcategories : activeCategory.subcategories)?.length || 0} Subcategories
                </span>
              </div>

              {/* Add New Subcategory Input Strip */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder={`Add subcategory to ${activeGender} (e.g. Polos, Kurtas, Linen Trousers)...`}
                  value={newSubcategoryInput}
                  onChange={(e) => setNewSubcategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      isEditing ? handleAddSubcategory() : handleDirectAddSub();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#1E1A15] border border-[#322A20] rounded-xs text-xs text-white placeholder-[#685D4E] focus:outline-none focus:border-[#C9A354]"
                />
                <button
                  type="button"
                  onClick={isEditing ? handleAddSubcategory : handleDirectAddSub}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C9A354] hover:bg-[#D4B26F] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(isEditing
                  ? formData.subcategories || []
                  : activeCategory.subcategories
                ).map((sub) => {
                  const count = products.filter(
                    (p) => p.category === activeGender && p.subcategory === sub
                  ).length;

                  return (
                    <div
                      key={sub}
                      className="p-3 bg-[#1F1B16] border border-[#2E271F] rounded-xs flex items-center justify-between hover:border-[#C9A354]/40 transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-white truncate">{sub}</div>
                        <div className="text-[10px] text-[#736857] font-mono mt-0.5">
                          {count} {count === 1 ? 'item' : 'items'} live
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            isEditing ? handleRemoveSubcategory(sub) : handleDirectRemoveSub(sub)
                          }
                          className="opacity-0 group-hover:opacity-100 text-[#8A7E6E] hover:text-rose-400 p-1 transition-all"
                          title="Remove subcategory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active on Store" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Live Storefront Integration Note */}
            <div className="p-4 bg-[#141210] border border-[#262017] rounded-xs flex items-start gap-3 text-xs text-[#8A7E6E]">
              <Sparkles className="w-4 h-4 text-[#C9A354] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">Automatic Storefront Sync:</span> Any modification made to {activeGender} category name, banners, or subcategories updates the Firestore document instantly. The customer homepage hero cards, department banners, and filter drawer read directly from this collection.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
