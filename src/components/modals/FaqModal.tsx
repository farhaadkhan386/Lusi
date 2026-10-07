import React, { useState } from 'react';
import { X, ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: 'What is Lusi and where is the clothing manufactured?',
    a: 'Lusi is a homegrown Indian fashion clothing brand. Our collections for Men, Women and Kids are designed in India and responsibly produced in heritage textile hubs across Surat, Tirupur, and Jaipur using breathable natural fibers and premium combed cottons.',
  },
  {
    q: 'How long does shipping take across India?',
    a: 'All orders are dispatched within 24 to 48 hours. Metro deliveries (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata, Pune) take 2 to 4 business days. Other regions usually take 3 to 6 business days. Free shipping is provided on all orders above ₹1,999.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available across 99% of Indian pin codes. You can pay via cash or scan a dynamic UPI QR code with the delivery executive.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We offer an easy 7-day hassle-free return and exchange policy from the date of delivery. If you need a different size or color, our logistics partner will arrange a doorstep pickup.',
  },
  {
    q: 'How do kidswear sizes work?',
    a: 'Our kids clothing is categorized by age (0–2Y, 2–5Y, 6–9Y, 10–13Y, 14+Y). We incorporate growth features such as adjustable inner waistband elastic, soft ribbed collars, and tagless construction to prevent skin irritation.',
  },
  {
    q: 'How do I care for my Lusi garments?',
    a: 'We recommend gentle machine washing with cold water and similar colors. For linen and handloom fabrics, avoid harsh bleaching and line dry in the shade to preserve dye vibrancy.',
  },
];

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#EAE3D8] overflow-hidden my-auto max-h-[88vh] flex flex-col">
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE3D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#8C533E]" />
            <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
              Frequently Asked Questions & Help
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

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#EAE3D8] bg-white rounded-xs overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#1E1E1E]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C533E] transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-xs text-[#625C54] leading-relaxed border-t border-[#F2ECE1] pt-3">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          <div className="p-4 bg-[#F2EDE4] border border-[#DDD5C8] rounded-xs text-xs text-[#4A453F] mt-6">
            <h4 className="font-semibold text-[#1E1E1E] mb-1">Still have questions?</h4>
            <p className="mb-2">Our customer care team is available Monday to Saturday, 9:00 AM to 8:00 PM IST.</p>
            <div className="flex flex-wrap gap-4 font-medium">
              <a href="tel:+917248596540" className="flex items-center gap-1.5 text-[#1E1E1E] hover:underline">
                <Phone className="w-3.5 h-3.5 text-[#8C533E]" />
                <span>+91-7248596540</span>
              </a>
              <a href="mailto:Help@lusi.in" className="flex items-center gap-1.5 text-[#8C533E] hover:underline">
                <Mail className="w-3.5 h-3.5" />
                <span>Help@lusi.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
