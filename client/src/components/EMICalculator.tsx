'use client';

import React, { useState, useMemo } from 'react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

interface EMICalculatorProps {
  price: number;
}

export default function EMICalculator({ price }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(Math.round(price * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure;
    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalAmount: Math.round(totalAmount) };
  }, [loanAmount, interestRate, tenure]);

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">📊 EMI Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Loan Amount (₹)</label>
          <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tenure (months)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="input-field text-sm" />
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Monthly EMI</span>
            <span className="font-bold text-primary-600">{formatCurrency(emi)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
