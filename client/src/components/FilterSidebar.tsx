'use client';

import React, { useState } from 'react';

interface Filters {
  type?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  fuelType?: string[];
  transmission?: string[];
  condition?: string[];
  location?: string;
}

interface FilterSidebarProps {
  onApply: (filters: Filters) => void;
  onReset: () => void;
  initialFilters?: Filters;
}

const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'];
const transmissions = ['MANUAL', 'AUTOMATIC'];
const conditions = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'];

export default function FilterSidebar({ onApply, onReset, initialFilters }: FilterSidebarProps) {
  const [type, setType] = useState(initialFilters?.type || '');
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || '');
  const [minYear, setMinYear] = useState(initialFilters?.minYear || '');
  const [maxYear, setMaxYear] = useState(initialFilters?.maxYear || '');
  const [fuelType, setFuelType] = useState<string[]>(initialFilters?.fuelType || []);
  const [transmission, setTransmission] = useState<string[]>(initialFilters?.transmission || []);
  const [condition, setCondition] = useState<string[]>(initialFilters?.condition || []);
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleApply = () => {
    onApply({ type, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, condition, location });
    setMobileOpen(false);
  };

  const handleReset = () => {
    setType(''); setMinPrice(''); setMaxPrice(''); setMinYear(''); setMaxYear('');
    setFuelType([]); setTransmission([]); setCondition([]); setLocation('');
    onReset();
    setMobileOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Vehicle Type */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Vehicle Type</h4>
        <div className="space-y-1">
          {['', 'CAR', 'BIKE'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} className="text-primary-600" />
              {t || 'All'}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Price Range</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input-field text-sm py-2" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input-field text-sm py-2" />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Year Range</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minYear} onChange={(e) => setMinYear(e.target.value)} className="input-field text-sm py-2" />
          <input type="number" placeholder="Max" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} className="input-field text-sm py-2" />
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Fuel Type</h4>
        <div className="space-y-1">
          {fuelTypes.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={fuelType.includes(f)} onChange={() => setFuelType(toggleArray(fuelType, f))} className="text-primary-600 rounded" />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Transmission</h4>
        <div className="space-y-1">
          {transmissions.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={transmission.includes(t)} onChange={() => setTransmission(toggleArray(transmission, t))} className="text-primary-600 rounded" />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Condition</h4>
        <div className="space-y-1">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={condition.includes(c)} onChange={() => setCondition(toggleArray(condition, c))} className="text-primary-600 rounded" />
              {c.replace('_', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Location</h4>
        <input type="text" placeholder="City or area" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field text-sm py-2" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={handleApply} className="btn-primary flex-1 text-sm">Apply Filters</button>
        <button onClick={handleReset} className="btn-secondary flex-1 text-sm">Reset</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden btn-secondary flex items-center gap-2 text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        Filters
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 card p-5">{filterContent}</div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
