'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { listingAPI } from '@/lib/api';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import FilterSidebar from '@/components/FilterSidebar';
import SkeletonCard from '@/components/SkeletonCard';

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
        sort,
      };

      const type = searchParams.get('type');
      if (type) params.type = type;

      const search = searchParams.get('search');
      if (search) params.search = search;

      const brand = searchParams.get('brand');
      if (brand) params.brand = brand;

      const minPrice = searchParams.get('minPrice');
      if (minPrice) params.minPrice = minPrice;

      const maxPrice = searchParams.get('maxPrice');
      if (maxPrice) params.maxPrice = maxPrice;

      const minYear = searchParams.get('minYear');
      if (minYear) params.minYear = minYear;

      const maxYear = searchParams.get('maxYear');
      if (maxYear) params.maxYear = maxYear;

      const fuelType = searchParams.get('fuelType');
      if (fuelType) params.fuelType = fuelType;

      const transmission = searchParams.get('transmission');
      if (transmission) params.transmission = transmission;

      const condition = searchParams.get('condition');
      if (condition) params.condition = condition;

      const location = searchParams.get('location');
      if (location) params.location = location;

      const res = await listingAPI.getListings(params);
      if (res.data) {
        setListings(res.data.data || []);
        if (res.data.meta) {
          setTotal(res.data.meta.total);
          setTotalPages(res.data.meta.totalPages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams, page, sort]);

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key])) {
        if (filters[key].length > 0) {
          params.set(key, filters[key].join(','));
        }
      } else if (filters[key]) {
        params.set(key, filters[key]);
      }
    });
    setPage(1);
    router.push(`/listings?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setPage(1);
    router.push('/listings');
    setMobileFilterOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {searchParams.get('type') === 'CAR'
              ? 'Cars for Sale'
              : searchParams.get('type') === 'BIKE'
              ? 'Bikes for Sale'
              : 'All Vehicles'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing {total} verified vehicles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden btn-secondary text-sm py-2 px-3 flex items-center gap-1"
          >
            <span>🔍</span> Filters
          </button>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="input-field py-2 text-sm w-auto cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest First</option>
            <option value="views_desc">Most Viewed</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-20">
          <FilterSidebar
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            initialFilters={{
              type: searchParams.get('type') || '',
              brand: searchParams.get('brand') || '',
              minPrice: searchParams.get('minPrice') || '',
              maxPrice: searchParams.get('maxPrice') || '',
              minYear: searchParams.get('minYear') || '',
              maxYear: searchParams.get('maxYear') || '',
              fuelType: searchParams.get('fuelType') ? searchParams.get('fuelType')!.split(',') : [],
              transmission: searchParams.get('transmission') ? searchParams.get('transmission')!.split(',') : [],
              condition: searchParams.get('condition') ? searchParams.get('condition')!.split(',') : [],
              location: searchParams.get('location') || '',
            }}
          />
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end md:hidden">
            <div className="w-80 max-w-full bg-white dark:bg-gray-800 h-full p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
              </div>
              <FilterSidebar
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                initialFilters={{
                  type: searchParams.get('type') || '',
                  brand: searchParams.get('brand') || '',
                  minPrice: searchParams.get('minPrice') || '',
                  maxPrice: searchParams.get('maxPrice') || '',
                  minYear: searchParams.get('minYear') || '',
                  maxYear: searchParams.get('maxYear') || '',
                  fuelType: searchParams.get('fuelType') ? searchParams.get('fuelType')!.split(',') : [],
                  transmission: searchParams.get('transmission') ? searchParams.get('transmission')!.split(',') : [],
                  condition: searchParams.get('condition') ? searchParams.get('condition')!.split(',') : [],
                  location: searchParams.get('location') || '',
                }}
              />
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium px-4 text-gray-600 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                No vehicles match your criteria
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try widening your search or removing some filters.
              </p>
              <button onClick={handleResetFilters} className="btn-primary mt-4">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
