import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon,
  ArrowUpDown,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminProduct, Category, Subcategory, KidsAgeGroup, ProductStatus } from '../../../types';

export const AdminProductsView: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductStatus,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | Category>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ProductStatus>('All');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    category: Category;
    genderTag: 'Men' | 'Women' | 'Kids' | 'Unisex';
    subcategory: Subcategory;
    ageGroup: KidsAgeGroup;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    stockQuantity: number;
    lowStockThreshold: number;
    status: ProductStatus;
    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    description: string;
    fabric: string;
    fit: string;
    care: string;
    colors: { name: string; hex: string }[];
    sizes: string[];
    images: string[];
  }>({
    name: '',
    sku: '',
    category: 'Men',
    genderTag: 'Men',
    subcategory: 'T-Shirts',
    ageGroup: '6–9 Years',
    price: 1499,
    originalPrice: 1999,
    discountPercentage: 25,
    stockQuantity: 40,
    lowStockThreshold: 10,
    status: 'Active',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    description: '',
    fabric: '100% Combed Indian Cotton',
    fit: 'Relaxed Fit',
    care: 'Machine wash cold with like colors. Line dry in shade.',
    colors: [
      { name: 'Oatmeal Heather', hex: '#D8D1C5' },
      { name: 'Charcoal Black', hex: '#232323' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    ],
  });

  const [imageInput, setImageInput] = useState('');

  // Subcategories mapping dynamically by Gender/Category from Firestore categories
  const subcategoryOptions: Record<Category, string[]> = {
    Men: categories?.find((c) => c.category === 'Men')?.subcategories || [
      'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Cargo Pants', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Shorts',
    ],
    Women: categories?.find((c) => c.category === 'Women')?.subcategories || [
      'Tops', 'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Trousers', 'Hoodies', 'Jackets', 'Co-ord Sets',
    ],
    Kids: categories?.find((c) => c.category === 'Kids')?.subcategories || [
      'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Shorts', 'Hoodies', 'Co-ord Sets', 'Boys', 'Girls',
    ],
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `LUSI-MEN-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Men',
      genderTag: 'Men',
      subcategory: 'T-Shirts',
      ageGroup: '6–9 Years',
      price: 1499,
      originalPrice: 1999,
      discountPercentage: 25,
      stockQuantity: 45,
      lowStockThreshold: 10,
      status: 'Active',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      description: 'Handcrafted luxury apparel tailored from premium combed Indian cotton.',
      fabric: '100% Indian Combed Cotton (240 GSM)',
      fit: 'Relaxed Contemporary Fit',
      care: 'Cold gentle wash. Steam iron inside out.',
      colors: [
        { name: 'Warm Ecru', hex: '#EBE5DC' },
        { name: 'Noir Black', hex: '#1C1C1C' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      genderTag: p.genderTag,
      subcategory: p.subcategory,
      ageGroup: p.ageGroup || '6–9 Years',
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercentage: p.discountPercentage || 0,
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status,
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      description: p.description,
      fabric: p.fabric,
      fit: p.fit,
      care: p.care,
      colors: p.colors,
      sizes: p.sizes,
      images: p.images,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        inStock: formData.stockQuantity > 0 && formData.status === 'Active',
      });
    } else {
      addProduct({
        ...formData,
        rating: 4.9,
        reviewCount: 1,
        inStock: formData.stockQuantity > 0 && formData.status === 'Active',
        reviews: [],
        publishedAt: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(false);
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
    setImageInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">Apparel Products</h2>
          <p className="text-xs text-[#8A7E6E]">
            {products.length} garments in active catalog across Men, Women & Kids collections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-lg shadow-[#C9A354]/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#171512] border border-[#2B251D] rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736857]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by apparel title, SKU, or subcategory..."
            className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs pl-9 pr-3 py-2 text-xs text-white placeholder-[#63594B] focus:outline-none focus:border-[#C9A354] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-[#1F1B16] border border-[#332A1F] text-xs text-[#DDD6C8] px-3 py-2 rounded-xs focus:outline-none focus:border-[#C9A354]"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#1F1B16] border border-[#332A1F] text-xs text-[#DDD6C8] px-3 py-2 rounded-xs focus:outline-none focus:border-[#C9A354]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#171512] border border-[#2B251D] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292219] bg-[#1A1713] text-[#7A6F5E] uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU / Gender</th>
                <th className="py-3 px-4">Subcategory</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211B14]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#736857]">
                    No garments match your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C1814] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-13 object-cover rounded-xs border border-[#292219] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate max-w-xs">{p.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {p.isBestSeller && (
                              <span className="px-1.5 py-0.2 bg-[#C9A354]/20 text-[#C9A354] text-[9px] font-mono rounded-xs font-semibold">
                                Best Seller
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 text-[9px] font-mono rounded-xs">
                                New Arrival
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white">{p.sku}</div>
                      <div className="text-[10px] text-[#736857]">{p.category}</div>
                    </td>
                    <td className="py-3 px-4 text-[#DDD6C8]">{p.subcategory}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white font-semibold">₹{p.price.toLocaleString('en-IN')}</div>
                      {p.originalPrice > p.price && (
                        <div className="text-[10px] text-[#736857] line-through">
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`font-semibold ${
                          p.stockQuantity === 0
                            ? 'text-red-400'
                            : p.stockQuantity <= p.lowStockThreshold
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.stockQuantity} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleProductStatus(p.id)}
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium uppercase transition-colors cursor-pointer ${
                          p.status === 'Active'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            : p.status === 'Out of Stock'
                            ? 'bg-red-950/70 text-red-300 border border-red-800/60'
                            : p.status === 'Draft'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-[#292219] text-[#A89E8F]'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#8A7E6E] hover:text-white rounded-xs hover:bg-[#262018]"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1.5 text-[#8A7E6E] hover:text-[#C9A354] rounded-xs hover:bg-[#262018]"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-[#8A7E6E] hover:text-red-400 rounded-xs hover:bg-[#262018]"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#171512] border border-[#2E271F] rounded-xs shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#DDD6C8]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1C1814] border-b border-[#292219] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#C9A354] tracking-wider font-semibold">
                  {editingProduct ? 'EDIT GARMENT' : 'NEW APPAREL ENTRY'}
                </span>
                <h3 className="font-serif text-lg text-white font-light">
                  {editingProduct ? editingProduct.name : 'Add New Clothing Silhouette'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#8A7E6E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white focus:outline-none focus:border-[#C9A354]"
                    placeholder="e.g. Lusi Oxford Linen Shirt"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C9A354]"
                    placeholder="LUSI-MEN-201"
                  />
                </div>
              </div>

              {/* Dynamic Gender & Subcategory Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Gender Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as Category;
                      setFormData({
                        ...formData,
                        category: newCat,
                        genderTag: newCat,
                        subcategory: subcategoryOptions[newCat][0] as Subcategory,
                      });
                    }}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white focus:outline-none focus:border-[#C9A354]"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Subcategory (Dynamic) *
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as Subcategory })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white focus:outline-none focus:border-[#C9A354]"
                  >
                    {subcategoryOptions[formData.category].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category === 'Kids' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                      Kids Age Group *
                    </label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as KidsAgeGroup })}
                      className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white focus:outline-none focus:border-[#C9A354]"
                    >
                      <option value="0–2 Years">0–2 Years</option>
                      <option value="2–5 Years">2–5 Years</option>
                      <option value="6–9 Years">6–9 Years</option>
                      <option value="10–13 Years">10–13 Years</option>
                      <option value="14+ Years">14+ Years</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C9A354]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C9A354]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C9A354]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C9A354]"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#141210] border border-[#262018] rounded-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Product Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded-xs accent-[#C9A354]"
                  />
                  <label htmlFor="isBestSeller" className="text-xs text-[#DDD6C8] cursor-pointer">
                    Best Seller
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded-xs accent-[#C9A354]"
                  />
                  <label htmlFor="isNewArrival" className="text-xs text-[#DDD6C8] cursor-pointer">
                    New Arrival
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded-xs accent-[#C9A354]"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-[#DDD6C8] cursor-pointer">
                    Featured
                  </label>
                </div>
              </div>

              {/* Description & Technical Garment Spec */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                    Editorial Garment Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2.5 text-xs text-white focus:outline-none focus:border-[#C9A354]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                      Fit Profile
                    </label>
                    <input
                      type="text"
                      value={formData.fit}
                      onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                      className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-1 font-mono">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.care}
                      onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                      className="w-full bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images Management */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8A7E6E] mb-2 font-mono">
                  Garment Photography (Apparel Models Only)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste clothing editorial image URL..."
                    className="flex-1 bg-[#1F1B16] border border-[#332A1F] rounded-xs p-2 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#2E271F] hover:bg-[#3D3328] text-white text-xs uppercase font-medium rounded-xs"
                  >
                    Add Image
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-[3/4] rounded-xs overflow-hidden border border-[#2B251D] group">
                      <img src={img} alt="Product view" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-[#C9A354] text-black text-[8px] font-mono px-1 py-0.2 font-bold uppercase rounded-xs">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#262018] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-[#8A7E6E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A354] hover:bg-[#B38F44] text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Garment Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
