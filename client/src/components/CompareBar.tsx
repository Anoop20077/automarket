'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/contexts/CompareContext';

export default function CompareBar() {
  const { compareIds, clearCompare } = useCompare();

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-600 text-white shadow-lg transform transition-transform duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-medium text-sm">
          {compareIds.length} vehicle{compareIds.length > 1 ? 's' : ''} selected for comparison
        </span>
        <div className="flex items-center gap-3">
          <button onClick={clearCompare} className="text-sm text-white/80 hover:text-white transition-colors">
            Clear
          </button>
          <Link
            href="/compare"
            className="bg-white text-primary-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Compare Now
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
