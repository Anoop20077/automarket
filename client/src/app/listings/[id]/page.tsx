'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingAPI, favoriteAPI, chatAPI, reportAPI } from '@/lib/api';
import { Listing } from '@/lib/types';
import ImageGallery from '@/components/ImageGallery';
import EMICalculator from '@/components/EMICalculator';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import { useToast } from '@/contexts/ToastContext';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, isAuthenticated } = useAuth();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { showToast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fraud / Suspicious');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await listingAPI.getListing(id);
        if (res.data && res.data.data) {
          setListing(res.data.data);
          setIsFavorited(!!res.data.data.isFavorited);
        }
      } catch (err: any) {
        showToast('Listing not found', 'error');
        router.push('/listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to favorite listings', 'info');
      router.push('/login');
      return;
    }
    try {
      if (isFavorited) {
        await favoriteAPI.removeFavorite(id);
        setIsFavorited(false);
        showToast('Removed from favorites', 'info');
      } else {
        await favoriteAPI.addFavorite(id);
        setIsFavorited(true);
        showToast('Added to favorites!', 'success');
      }
    } catch (err) {
      showToast('Failed to update favorite', 'error');
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to contact the seller', 'info');
      router.push('/login');
      return;
    }
    if (listing?.sellerId === user?.id) {
      showToast('This is your own listing', 'info');
      return;
    }
    try {
      const res = await chatAPI.createConversation({
        listingId: id,
        recipientId: listing!.sellerId,
      });
      router.push('/chat');
    } catch (err: any) {
      showToast('Could not open conversation', 'error');
    }
  };

  const handleMarkSold = async () => {
    try {
      await listingAPI.markSold(id);
      showToast('Listing marked as SOLD', 'success');
      setListing((prev) => (prev ? { ...prev, status: 'SOLD' } : null));
    } catch (err) {
      showToast('Failed to mark listing as sold', 'error');
    }
  };

  const handleDeleteListing = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingAPI.deleteListing(id);
      showToast('Listing deleted successfully', 'success');
      router.push('/my-listings');
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to report', 'info');
      return;
    }
    setSubmittingReport(true);
    try {
      await reportAPI.reportListing(id, {
        reason: reportReason,
        description: reportDescription,
      });
      showToast('Report submitted for review', 'success');
      setReportModalOpen(false);
      setReportDescription('');
    } catch (err) {
      showToast('Failed to submit report', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user?.id === listing.sellerId || user?.role === 'ADMIN';
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> &gt;{' '}
          <Link href={`/listings?type=${listing.type}`} className="hover:underline">
            {listing.type === 'CAR' ? 'Cars' : 'Bikes'}
          </Link> &gt;{' '}
          <span className="text-gray-900 dark:text-white font-medium">{listing.title}</span>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link href={`/listings/${id}/edit`} className="btn-secondary py-1.5 px-3 text-sm">
              ✏️ Edit
            </Link>
            {listing.status !== 'SOLD' && (
              <button onClick={handleMarkSold} className="btn-secondary py-1.5 px-3 text-sm">
                🏷️ Mark as Sold
              </button>
            )}
            <button onClick={handleDeleteListing} className="btn-danger py-1.5 px-3 text-sm">
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column (Gallery & Details) */}
        <div className="lg:col-span-7 space-y-8">
          <ImageGallery images={listing.images} />

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Seller's Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* EMI Calculator */}
          <EMICalculator price={listing.price} />
        </div>

        {/* Right column (Price, Specs, Seller) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price & Primary Action Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md uppercase mb-2 ${
                  listing.type === 'CAR' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                }`}>
                  {listing.type} • {listing.status}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                  {listing.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  📍 {listing.location} • 👁️ {listing.views} views
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isFavorited
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500'
                  }`}
                  title={isFavorited ? 'Remove Favorite' : 'Save Listing'}
                >
                  <span className="text-xl">{isFavorited ? '❤️' : '🤍'}</span>
                </button>
                <button
                  onClick={() => isInCompare(id) ? removeFromCompare(id) : addToCompare(id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isInCompare(id)
                      ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 text-primary-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary-600'
                  }`}
                  title="Compare"
                >
                  ⚖️
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 uppercase font-semibold">Total Price</span>
              <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                {formattedPrice}
              </div>
            </div>

            <button
              onClick={handleContactSeller}
              className="w-full btn-primary py-3.5 text-base font-semibold flex items-center justify-center gap-2"
            >
              💬 Contact Seller
            </button>
          </div>

          {/* Specifications Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Vehicle Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Brand & Model</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.brand} {listing.model}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Model Year</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.year}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Kilometers Run</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.mileage.toLocaleString()} km</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Fuel Type</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.fuelType}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Transmission</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.transmission}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Condition</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.condition}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">Color</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.color}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-xs text-gray-500 dark:text-gray-400">No. of Owners</span>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.ownerCount}</p>
              </div>
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Seller Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                {listing.seller?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{listing.seller?.name}</p>
                <p className="text-xs text-gray-500">AutoMarket Community Seller</p>
                {listing.seller?.phone && (
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                    📞 {listing.seller.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
              <span>Safety Tip: Always inspect the vehicle in person.</span>
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-red-500 hover:underline"
              >
                Report Ad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report this Listing</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="input-field"
                >
                  <option value="Fraud / Suspicious">Fraud / Suspicious</option>
                  <option value="Incorrect Information">Incorrect Information</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Already Sold">Already Sold</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="input-field"
                  placeholder="Describe the issue..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="btn-danger"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
