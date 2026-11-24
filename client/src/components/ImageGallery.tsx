'use client';

import React, { useState } from 'react';
import { ListingImage } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface ImageGalleryProps {
  images: ListingImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="text-6xl">📷</span>
          <p className="mt-2">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="w-full h-80 md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
        <img
          src={getImageUrl(images[activeIndex].url)}
          alt={`Image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={getImageUrl(img.url)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
