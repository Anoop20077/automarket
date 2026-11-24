'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompareContextType {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('compareIds');
    if (stored) {
      try {
        setCompareIds(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(compareIds));
  }, [compareIds]);

  const addToCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.length >= 3 || prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((i) => i !== id));
  };

  const clearCompare = () => setCompareIds([]);

  const isInCompare = (id: string) => compareIds.includes(id);

  return (
    <CompareContext.Provider value={{ compareIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
}
