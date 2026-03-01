// components/HeroSection.jsx
import React from "react";
import { Search } from "lucide-react";

const HeroSection = () => {
  const popularSearches = [
    "Cotton Fabric",
    "LED Lights",
    "Office Furniture",
    "Basmati Rice",
  ];

  return (
    <div className="bg-gradient-to-r from-[hsl(24,100%,95%)] to-[hsl(24,100%,90%)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            India's Largest B2B Marketplace
            <span className="block text-[hsl(24,100%,50%)]">
              for Wholesale Buying
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified suppliers, get bulk pricing, and grow your
            business
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <input
              type="text"
              placeholder="Search products, suppliers, or categories..."
              className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-full focus:border-[hsl(24,100%,50%)] focus:ring-4 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all shadow-lg"
            />
            <button className="absolute right-3 top-3 bg-[hsl(24,100%,50%)] text-white p-2 rounded-full hover:bg-[hsl(24,100%,40%)] transition-colors">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
