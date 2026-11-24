'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { listingAPI, getImageUrl } from '@/lib/api';
import { Listing } from '@/lib/types';
import { useToast } from '@/contexts/ToastContext';

export default function MyListingsPage() {
  const { showToast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const res = await listingAPI.getMyListings();
      if (res.data?.data) {
        setListings(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load your listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleMarkSold = async (id: string) => {
    try {
      await listingAPI.markSold(id);
      showToast('Marked as sold', 'success');
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: 'SOLD' } : l))
      );
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingAPI.deleteListing(id);
      showToast('Listing deleted', 'success');
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">Active</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">Pending Review</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300">Rejected</span>;
      case 'SOLD':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Sold</span>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Listings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage, edit, or mark your posted vehicles as sold
            </p>
          </div>
          <Link href="/sell" className="btn-primary flex items-center gap-2">
            <span>+</span> Post New Ad
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {item.images?.[0]?.url ? (
                      <img
                        src={getImageUrl(item.images[0].url)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      <span className="text-xs text-gray-400">👁️ {item.views} views</span>
                    </div>
                    <Link
                      href={`/listings/${item.id}`}
                      className="font-bold text-lg text-gray-900 dark:text-white hover:text-primary-600 block mt-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-base font-extrabold text-primary-600 dark:text-primary-400 mt-0.5">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <Link
                    href={`/listings/${item.id}/edit`}
                    className="btn-secondary py-2 px-3 text-sm"
                  >
                    Edit
                  </Link>
                  {item.status !== 'SOLD' && (
                    <button
                      onClick={() => handleMarkSold(item.id)}
                      className="btn-secondary py-2 px-3 text-sm text-emerald-600 dark:text-emerald-400"
                    >
                      Mark Sold
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-danger py-2 px-3 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border p-8">
            <span className="text-5xl">🚗</span>
            <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">No listings posted yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start selling your car or bike on AutoMarket today.
            </p>
            <Link href="/sell" className="btn-primary mt-6 inline-block">
              Post Your First Ad
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
