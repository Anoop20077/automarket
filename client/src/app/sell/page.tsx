'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { listingAPI } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function SellPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'CAR',
    brand: '',
    model: '',
    year: 2021,
    price: 450000,
    mileage: 25000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    condition: 'EXCELLENT',
    color: 'White',
    ownerCount: 1,
    location: 'Delhi',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['year', 'price', 'mileage', 'ownerCount'].includes(name) ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create listing
      const res = await listingAPI.createListing(formData);
      const newListing = res.data.data;

      // 2. Upload images if selected
      if (selectedFiles.length > 0 && newListing?.id) {
        const data = new FormData();
        selectedFiles.forEach((f) => data.append('images', f));
        await listingAPI.uploadImages(newListing.id, data);
      }

      showToast('Ad posted successfully! Awaiting review.', 'success');
      router.push('/my-listings');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to post vehicle ad', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sell Your Vehicle
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              List your car or bike to reach thousands of potential buyers across India.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Vehicle Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer font-bold transition-all ${
                  formData.type === 'CAR'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600'
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="CAR"
                    checked={formData.type === 'CAR'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>🚗 Car</span>
                </label>

                <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer font-bold transition-all ${
                  formData.type === 'BIKE'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600'
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="BIKE"
                    checked={formData.type === 'BIKE'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>🏍️ Bike</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Listing Title</label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                placeholder="e.g. 2021 Hyundai Creta SX - Single Owner"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  required
                  className="input-field"
                  placeholder="e.g. Hyundai / Royal Enfield"
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
                  placeholder="e.g. Creta SX / Classic 350"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Year, Price, Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  required
                  min={1990}
                  max={2026}
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
                  min={1000}
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
                  min={0}
                  className="input-field"
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Fuel, Transmission, Condition */}
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

            {/* Color, Owners, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input type="text" name="color" className="input-field" value={formData.color} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owners</label>
                <input type="number" name="ownerCount" min={1} max={10} className="input-field" value={formData.ownerCount} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City / Location</label>
                <input type="text" name="location" required className="input-field" placeholder="e.g. Mumbai" value={formData.location} onChange={handleChange} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                required
                className="input-field"
                placeholder="Mention features, service history, reason for selling..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Upload Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base font-semibold"
            >
              {loading ? 'Submitting Listing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
