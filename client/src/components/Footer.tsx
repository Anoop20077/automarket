import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About AutoMarket</h3>
            <p className="text-sm leading-relaxed">
              AutoMarket is India&apos;s trusted platform for buying and selling pre-owned cars and bikes.
              Find your perfect ride with verified listings and secure transactions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings?type=CAR" className="hover:text-white transition-colors">Buy Cars</Link></li>
              <li><Link href="/listings?type=BIKE" className="hover:text-white transition-colors">Buy Bikes</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell Your Vehicle</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare Vehicles</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 support@automarket.in</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          © 2024 AutoMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
