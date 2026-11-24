'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { listingAPI } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'CAR',
    brand: '',
    model: '',
    year: 2021,
    price: 500000,
    mileage: 20000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    condition: 'EXCELLENT',
    color: '',
    ownerCount: 1,
    location: '',
    description: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await listingAPI.getListing(id);
        if (res.data?.data) {
          const l = res.data.data;
          setFormData({
            title: l.title,
            type: l.type,
            brand: l.brand,
            model: l.model,
            year: l.year,
            price: l.price,
            mileage: l.mileage,
            fuelType: l.fuelType,
            transmission: l.transmission,
            condition: l.condition,
            color: l.color,
            ownerCount: l.ownerCount,
            location: l.location,
            description: l.description,
          });
        }
      } catch (err) {
        showToast('Failed to load listing', 'error');
        router.push('/my-listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['year', 'price', 'mileage', 'ownerCount'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await listingAPI.updateListing(id, formData);
      showToast('Listing updated successfully!', 'success');
      router.push(`/listings/${id}`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Vehicle Listing
          </h1>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading details...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    className="input-field"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    required
                    className="input-field"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    required
                    className="input-field"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    className="input-field"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    name="mileage"
                    required
                    className="input-field"
                    value={formData.mileage}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <select name="fuelType" className="input-field" value={formData.fuelType} onChange={handleChange}>
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Transmission</label>
                  <select name="transmission" className="input-field" value={formData.transmission} onChange={handleChange}>
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select name="condition" className="input-field" value={formData.condition} onChange={handleChange}>
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input type="text" name="color" className="input-field" value={formData.color} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner Count</label>
                  <input type="number" name="ownerCount" className="input-field" value={formData.ownerCount} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location / City</label>
                  <input type="text" name="location" required className="input-field" value={formData.location} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  className="input-field"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
