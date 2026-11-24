'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listingAPI } from '@/lib/api';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await listingAPI.getListings({ limit: 8, sort: 'newest' });
        if (res.data && res.data.data) {
          setFeaturedListings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/listings?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/listings');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-indigo-600 to-purple-700 text-white shadow-2xl py-20 px-6 sm:px-12 text-center">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Verified Vehicles • Direct Deals
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Perfect Ride on <span className="text-amber-300">AutoMarket</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto font-light">
            India's most trusted marketplace for certified used cars and premium motorbikes. Buy with confidence, sell in minutes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by brand, model, or keywords (e.g. Fortuner, Swift, Ninja)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-5 pr-4 py-4 rounded-xl text-gray-900 bg-white shadow-lg focus:ring-4 focus:ring-amber-300 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl shrink-0"
            >
              Search Vehicles
            </button>
          </form>
        </div>
      </section>

      {/* Category Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Explore by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/listings?type=CAR"
            className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-4xl">🚗</span>
              <h3 className="text-2xl font-bold group-hover:text-blue-200 transition-colors">Browse Cars</h3>
              <p className="text-blue-100 text-sm max-w-sm">Hatchbacks, Sedans, SUVs, and Electric cars from verified sellers across India.</p>
              <div className="pt-2 font-medium flex items-center text-amber-300">
                View All Cars &rarr;
              </div>
            </div>
          </Link>

          <Link
            href="/listings?type=BIKE"
            className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-4xl">🏍️</span>
              <h3 className="text-2xl font-bold group-hover:text-emerald-200 transition-colors">Browse Bikes</h3>
              <p className="text-emerald-100 text-sm max-w-sm">Cruisers, Sports bikes, Commuters, and Off-roaders ready for immediate purchase.</p>
              <div className="pt-2 font-medium flex items-center text-amber-300">
                View All Bikes &rarr;
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Listings</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Recently added and verified vehicles</p>
          </div>
          <Link
            href="/listings"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
            <p className="text-gray-500 dark:text-gray-400">No listings available at the moment.</p>
            <Link href="/sell" className="btn-primary mt-4 inline-block">
              Post an Ad
            </Link>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div>
            <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">1,000+</p>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Verified Listings</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">500+</p>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Happy Buyers & Sellers</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">50+</p>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">Cities Covered</p>
          </div>
        </div>
      </section>
    </div>
  );
}
