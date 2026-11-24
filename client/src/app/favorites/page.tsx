'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { favoriteAPI } from '@/lib/api';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import SkeletonCard from '@/components/SkeletonCard';
import { useToast } from '@/contexts/ToastContext';

export default function FavoritesPage() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getFavorites();
      if (res.data?.data) {
        // Map favorites to listings
        const items = res.data.data.map((fav: any) => ({
          ...fav.listing,
          isFavorited: true,
        }));
        setFavorites(items);
      }
    } catch (err) {
      showToast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (listingId: string) => {
    try {
      await favoriteAPI.removeFavorite(listingId);
      setFavorites((prev) => prev.filter((item) => item.id !== listingId));
      showToast('Removed from favorites', 'info');
    } catch (err) {
      showToast('Failed to remove favorite', 'error');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Saved Vehicles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of vehicles you are interested in buying
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onFavoriteToggle={() => handleFavoriteToggle(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border p-8">
            <span className="text-5xl">❤️</span>
            <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">No saved vehicles yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click the heart icon on any vehicle to add it to your saved list.
            </p>
            <Link href="/listings" className="btn-primary mt-6 inline-block">
              Browse Vehicles
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
