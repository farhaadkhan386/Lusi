import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden my-auto">
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE3D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
              Lusi Indian Sizing Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#666056] hover:text-[#1E1E1E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Category Tabs and Unit Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xs">
              {(['Men', 'Women', 'Kids'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    tab === t ? 'bg-[#1E1E1E] text-white shadow-xs' : 'text-[#58524B] hover:text-[#1E1E1E]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#787167]">Measurement Unit:</span>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-2 py-1 font-semibold ${unit === 'in' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-[#444]'}`}
              >
                Inches (")
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2 py-1 font-semibold ${unit === 'cm' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-[#444]'}`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-[#EAE3D8] bg-white">
            {tab === 'Men' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#1E1E1E] font-semibold border-b border-[#EAE3D8]">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Shoulder ({unit})</th>
                    <th className="p-3">Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1] text-[#4A453E] tabular-nums">
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XS (36)</td>
                    <td className="p-3">{unit === 'in' ? '36 - 38' : '91 - 96'}</td>
                    <td className="p-3">{unit === 'in' ? '28 - 30' : '71 - 76'}</td>
                    <td className="p-3">{unit === 'in' ? '17.0' : '43.2'}</td>
                    <td className="p-3">{unit === 'in' ? '27.0' : '68.5'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">S (38)</td>
                    <td className="p-3">{unit === 'in' ? '38 - 40' : '96 - 101'}</td>
                    <td className="p-3">{unit === 'in' ? '30 - 32' : '76 - 81'}</td>
                    <td className="p-3">{unit === 'in' ? '17.5' : '44.5'}</td>
                    <td className="p-3">{unit === 'in' ? '27.5' : '70.0'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">M (40)</td>
                    <td className="p-3">{unit === 'in' ? '40 - 42' : '101 - 106'}</td>
                    <td className="p-3">{unit === 'in' ? '32 - 34' : '81 - 86'}</td>
                    <td className="p-3">{unit === 'in' ? '18.2' : '46.2'}</td>
                    <td className="p-3">{unit === 'in' ? '28.5' : '72.4'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">L (42)</td>
                    <td className="p-3">{unit === 'in' ? '42 - 44' : '106 - 112'}</td>
                    <td className="p-3">{unit === 'in' ? '34 - 36' : '86 - 91'}</td>
                    <td className="p-3">{unit === 'in' ? '19.0' : '48.3'}</td>
                    <td className="p-3">{unit === 'in' ? '29.5' : '75.0'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XL (44)</td>
                    <td className="p-3">{unit === 'in' ? '44 - 46' : '112 - 117'}</td>
                    <td className="p-3">{unit === 'in' ? '36 - 38' : '91 - 96'}</td>
                    <td className="p-3">{unit === 'in' ? '19.8' : '50.3'}</td>
                    <td className="p-3">{unit === 'in' ? '30.5' : '77.5'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XXL (46)</td>
                    <td className="p-3">{unit === 'in' ? '46 - 48' : '117 - 122'}</td>
                    <td className="p-3">{unit === 'in' ? '38 - 40' : '96 - 102'}</td>
                    <td className="p-3">{unit === 'in' ? '20.5' : '52.1'}</td>
                    <td className="p-3">{unit === 'in' ? '31.5' : '80.0'}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {tab === 'Women' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#1E1E1E] font-semibold border-b border-[#EAE3D8]">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hip ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1] text-[#4A453E] tabular-nums">
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XS (UK 6 / IN 32)</td>
                    <td className="p-3">{unit === 'in' ? '32 - 33' : '81 - 84'}</td>
                    <td className="p-3">{unit === 'in' ? '25 - 26' : '63 - 66'}</td>
                    <td className="p-3">{unit === 'in' ? '35 - 36' : '89 - 91'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">S (UK 8 / IN 34)</td>
                    <td className="p-3">{unit === 'in' ? '34 - 35' : '86 - 89'}</td>
                    <td className="p-3">{unit === 'in' ? '27 - 28' : '68 - 71'}</td>
                    <td className="p-3">{unit === 'in' ? '37 - 38' : '94 - 96'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">M (UK 10 / IN 36)</td>
                    <td className="p-3">{unit === 'in' ? '36 - 37' : '91 - 94'}</td>
                    <td className="p-3">{unit === 'in' ? '29 - 30' : '73 - 76'}</td>
                    <td className="p-3">{unit === 'in' ? '39 - 40' : '99 - 102'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">L (UK 12 / IN 38)</td>
                    <td className="p-3">{unit === 'in' ? '38 - 39' : '96 - 99'}</td>
                    <td className="p-3">{unit === 'in' ? '31 - 32' : '78 - 81'}</td>
                    <td className="p-3">{unit === 'in' ? '41 - 42' : '104 - 107'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XL (UK 14 / IN 40)</td>
                    <td className="p-3">{unit === 'in' ? '40 - 42' : '101 - 106'}</td>
                    <td className="p-3">{unit === 'in' ? '33 - 35' : '83 - 88'}</td>
                    <td className="p-3">{unit === 'in' ? '43 - 45' : '109 - 114'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">XXL (UK 16 / IN 42)</td>
                    <td className="p-3">{unit === 'in' ? '43 - 45' : '109 - 114'}</td>
                    <td className="p-3">{unit === 'in' ? '36 - 38' : '91 - 96'}</td>
                    <td className="p-3">{unit === 'in' ? '46 - 48' : '116 - 122'}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {tab === 'Kids' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#1E1E1E] font-semibold border-b border-[#EAE3D8]">
                  <tr>
                    <th className="p-3">Age / Size</th>
                    <th className="p-3">Child Height ({unit})</th>
                    <th className="p-3">Chest ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1] text-[#4A453E] tabular-nums">
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">2Y (86–92 cm)</td>
                    <td className="p-3">{unit === 'in' ? '34 - 36' : '86 - 92'}</td>
                    <td className="p-3">{unit === 'in' ? '20.5' : '52'}</td>
                    <td className="p-3">{unit === 'in' ? '19.5' : '50'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">4Y (98–104 cm)</td>
                    <td className="p-3">{unit === 'in' ? '38 - 41' : '98 - 104'}</td>
                    <td className="p-3">{unit === 'in' ? '22.0' : '56'}</td>
                    <td className="p-3">{unit === 'in' ? '21.0' : '53'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">6Y (110–116 cm)</td>
                    <td className="p-3">{unit === 'in' ? '43 - 45' : '110 - 116'}</td>
                    <td className="p-3">{unit === 'in' ? '24.0' : '61'}</td>
                    <td className="p-3">{unit === 'in' ? '22.5' : '57'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">8Y (122–128 cm)</td>
                    <td className="p-3">{unit === 'in' ? '48 - 50' : '122 - 128'}</td>
                    <td className="p-3">{unit === 'in' ? '26.0' : '66'}</td>
                    <td className="p-3">{unit === 'in' ? '24.0' : '61'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">10Y (134–140 cm)</td>
                    <td className="p-3">{unit === 'in' ? '53 - 55' : '134 - 140'}</td>
                    <td className="p-3">{unit === 'in' ? '28.0' : '71'}</td>
                    <td className="p-3">{unit === 'in' ? '25.5' : '65'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">12Y (146–152 cm)</td>
                    <td className="p-3">{unit === 'in' ? '57 - 60' : '146 - 152'}</td>
                    <td className="p-3">{unit === 'in' ? '30.0' : '76'}</td>
                    <td className="p-3">{unit === 'in' ? '27.0' : '68'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#1E1E1E]">14Y (158–164 cm)</td>
                    <td className="p-3">{unit === 'in' ? '62 - 64' : '158 - 164'}</td>
                    <td className="p-3">{unit === 'in' ? '32.0' : '81'}</td>
                    <td className="p-3">{unit === 'in' ? '28.5' : '72'}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 p-3 bg-white border border-[#EBE4D8] text-xs text-[#7A746B]">
            <p><strong>Note for Indian customers:</strong> If you are between sizes, we recommend sizing up for relaxed fits and choosing your regular size for tailored pieces. Need fitting advice? Reach us at <a href="mailto:Help@lusi.in" className="text-[#8C533E] underline">Help@lusi.in</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
