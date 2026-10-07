import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-[#EFE8DD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF8F5] text-[#171615] mb-5 border border-[#E9E1D4]">
          <Mail className="w-5 h-5 text-[#8A5A44] stroke-[1.5]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#171615] tracking-tight mb-3">
          JOIN THE LUSI FAMILY
        </h2>

        <p className="text-sm sm:text-base text-[#6E6860] max-w-lg mx-auto mb-9 font-light leading-relaxed">
          Be the first to know about new collections, exclusive offers and fresh styles.
        </p>

        {submitted ? (
          <div className="p-6 bg-[#F6F4EF] border border-[#E5DDD0] max-w-md mx-auto text-center rounded-xs animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-[#587352] mx-auto mb-2 stroke-[1.5]" />
            <h3 className="font-serif text-lg font-medium text-[#171615]">Welcome to Lusi</h3>
            <p className="text-xs text-[#6B655D] mt-1 font-light">
              Thank you for subscribing. We have dispatched your 10% welcome voucher to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4.5 py-4 bg-[#FAF8F5] border border-[#D5CCC0] text-xs text-[#171615] placeholder-[#9E978C] focus:outline-none focus:border-[#171615] focus:ring-1 focus:ring-[#171615]"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#171615] text-[#FAF8F5] text-[11px] font-semibold tracking-luxury uppercase hover:bg-[#34302C] transition-colors whitespace-nowrap active:scale-95 shadow-xs"
              >
                SUBSCRIBE
              </button>
            </div>
            {error && <p className="text-xs text-[#A83232] mt-2 text-left">{error}</p>}
            <p className="text-[11px] text-[#9A9388] mt-3.5 font-light">
              We respect your privacy. No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
