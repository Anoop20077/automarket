'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompare } from '@/contexts/CompareContext';
import { listingAPI, getImageUrl } from '@/lib/api';
import { Listing } from '@/lib/types';

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (compareIds.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const promises = compareIds.map((id) => listingAPI.getListing(id));
        const results = await Promise.all(promises);
        setListings(results.map((r) => r.data.data).filter(Boolean));
      } catch (err) {
        console.error('Failed to load compare items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [compareIds]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading vehicles comparison...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl">⚖️</span>
        <h1 className="text-3xl font-extrabold mt-4 text-gray-900 dark:text-white">
          No Vehicles to Compare
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Select up to 3 vehicles across the marketplace using the compare button on listings.
        </p>
        <Link href="/listings" className="btn-primary mt-6 inline-block">
          Explore Vehicles
        </Link>
      </div>
    );
  }

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const specs = [
    { label: 'Type', key: 'type' },
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Year', key: 'year' },
    { label: 'Price', render: (l: Listing) => <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(l.price)}</span> },
    { label: 'Mileage', render: (l: Listing) => `${l.mileage.toLocaleString()} km` },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Condition', key: 'condition' },
    { label: 'Color', key: 'color' },
    { label: 'Owners', key: 'ownerCount' },
    { label: 'Location', key: 'location' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Vehicle Comparison
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Comparing {listings.length} of max 3 vehicles side by side
          </p>
        </div>
        <button onClick={clearCompare} className="btn-secondary text-sm">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="p-4 w-48 bg-gray-50 dark:bg-gray-700/50 text-sm font-semibold text-gray-500 dark:text-gray-400">
                Vehicle
              </th>
              {listings.map((l) => (
                <th key={l.id} className="p-4 min-w-[240px] align-top">
                  <div className="space-y-3">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      {l.images?.[0]?.url ? (
                        <img
                          src={getImageUrl(l.images[0].url)}
                          alt={l.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🚗</div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/listings/${l.id}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-primary-600 block line-clamp-1"
                      >
                        {l.title}
                      </Link>
                      <button
                        onClick={() => removeFromCompare(l.id)}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
              {listings.length < 3 && (
                <th className="p-4 min-w-[200px] text-center align-middle bg-gray-50/50 dark:bg-gray-900/30">
                  <Link href="/listings" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    + Add Another Vehicle
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {specs.map((spec, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/40 dark:bg-gray-750'}>
                <td className="p-4 font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                  {spec.label}
                </td>
                {listings.map((l) => (
                  <td key={l.id} className="p-4 text-gray-900 dark:text-white font-medium">
                    {spec.render ? spec.render(l) : (l as any)[spec.key!]}
                  </td>
                ))}
                {listings.length < 3 && <td className="p-4" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
