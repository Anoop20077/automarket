import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}
