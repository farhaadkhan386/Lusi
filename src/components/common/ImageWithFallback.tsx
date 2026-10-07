import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'LUSI',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFE9DF] text-[#786E64] p-4 select-none ${className}`}
        role="img"
        aria-label={alt || fallbackText}
      >
        <span className="font-serif tracking-widest text-lg font-medium text-[#4A433B]">
          LUSI
        </span>
        <span className="text-[11px] uppercase tracking-wider text-[#8A8175] mt-1 text-center line-clamp-1">
          {alt || fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F2EDE4] ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0ECE1] via-[#E8E1D5] to-[#F0ECE1] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
