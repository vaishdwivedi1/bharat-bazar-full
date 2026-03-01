// components/BulkDeals.jsx
import React from "react";
import { Shield, CheckCircle, TrendingUp } from "lucide-react";

const BulkDeals = () => {
  const deals = [
    {
      name: "AAC Blocks for Construction",
      description: "600x200x200mm, Lightweight, Thermal Insulation",
      price: "48 - 55",
      unit: "pieces",
      moq: "1000",
      image: "🧱",
      verified: true,
      fulfilled: true,
    },
    {
      name: "Executive Office Chair Bulk",
      description: "Ergonomic, Adjustable, Mesh Back",
      price: "5,500 - 6,500",
      unit: "pieces",
      moq: "20",
      image: "🪑",
      verified: true,
      fulfilled: true,
    },
    {
      name: "LED Panel Light 40W",
      description: "40W, 4000 Lumens, Cool White",
      price: "520 - 650",
      unit: "pieces",
      moq: "100",
      image: "💡",
      verified: true,
      fulfilled: true,
    },
    {
      name: "Silk Sarees Wholesale Lot",
      description: "Pure Silk, Traditional Designs, Zari Work",
      price: "7,200 - 8,500",
      unit: "pieces",
      moq: "25",
      image: "👘",
      verified: true,
      fulfilled: true,
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-[hsl(24,100%,95%)] to-[hsl(24,100%,90%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bulk Deals</h2>
            <p className="text-gray-600 mt-2">
              Special wholesale prices on bulk orders
            </p>
          </div>
          <span className="bg-[hsl(24,100%,50%)] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={18} />
            Save up to 30%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-40 bg-gradient-to-br from-[hsl(24,100%,90%)] to-[hsl(24,100%,80%)] flex items-center justify-center relative">
                <span className="text-5xl">{deal.image}</span>
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  BULK
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {deal.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{deal.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-[hsl(24,100%,50%)]">
                      ₹{deal.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      / {deal.unit}
                    </span>
                  </div>
                  {deal.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  MOQ: {deal.moq} {deal.unit}
                </p>

                <div className="flex items-center justify-between mb-4">
                  {deal.fulfilled && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Shield className="w-4 h-4 mr-1 text-[hsl(24,100%,50%)]" />
                      Fulfilled by Platform
                    </div>
                  )}
                  {deal.verified && (
                    <span className="text-xs text-green-600 font-semibold">
                      Verified Supplier
                    </span>
                  )}
                </div>

                <button className="w-full bg-[hsl(24,100%,50%)] text-white py-2 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkDeals;
