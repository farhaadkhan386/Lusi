import React, { useState } from 'react';
import {
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminCollectionsView: React.FC = () => {
  const { collections, banners, products } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-light text-white">Collections & Campaign Banners</h2>
        <p className="text-xs text-[#8A7E6E]">
          Curate seasonal apparel edits (New Arrivals, Summer Drop, Everyday Essentials) and visual banners.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => {
          return (
            <div
              key={col.id}
              className="p-5 bg-[#171512] border border-[#2B251D] rounded-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-serif text-lg text-white font-light">{col.name}</div>
                  <span className="px-2 py-0.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 rounded-xs text-[10px] font-mono uppercase">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#A89E8F] mb-4">{col.description}</p>

                <div className="relative aspect-[16/9] rounded-xs overflow-hidden border border-[#2B2319] mb-4">
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                </div>

                <div className="text-xs text-[#736857] font-mono">
                  Contains {col.productIds.length} curated clothing silhouettes
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
