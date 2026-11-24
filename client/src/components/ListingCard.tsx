'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { getImageUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import { favoriteAPI } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export default function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { showToast } = useToast();
  const inCompare = isInCompare(listing.id);

  const imageUrl = listing.images?.[0]?.url
    ? getImageUrl(listing.images[0].url)
    : '';

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to add favorites', 'info');
      return;
    }
    try {
      if (listing.isFavorited) {
        await favoriteAPI.removeFavorite(listing.id);
        showToast('Removed from favorites', 'success');
      } else {
        await favoriteAPI.addFavorite(listing.id);
        showToast('Added to favorites', 'success');
      }
      onFavoriteToggle?.(listing.id, !listing.isFavorited);
    } catch {
      showToast('Failed to update favorites', 'error');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(listing.id);
    } else {
      addToCompare(listing.id);
    }
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="card overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
              <span className="text-4xl">{listing.type === 'CAR' ? '🚗' : '🏍️'}</span>
            </div>
          )}

          {/* Type badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${listing.type === 'CAR' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
            {listing.type}
          </span>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <svg className={`w-5 h-5 ${listing.isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Compare checkbox */}
          <button
            onClick={handleCompare}
            className={`absolute bottom-3 right-3 p-1.5 rounded-md text-xs font-medium transition-colors ${inCompare ? 'bg-primary-600 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'}`}
          >
            {inCompare ? '✓ Compare' : '+ Compare'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{listing.title}</h3>
          <p className="text-xl font-bold text-primary-600 mt-1">{formatPrice(listing.price)}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{listing.year}</span>
            <span>•</span>
            <span>{listing.mileage?.toLocaleString()} km</span>
            <span>•</span>
            <span>{listing.fuelType}</span>
            <span>•</span>
            <span>{listing.transmission}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {listing.location}
          </div>
        </div>
      </div>
    </Link>
  );
}
