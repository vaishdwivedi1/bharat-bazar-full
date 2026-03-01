// components/StatsSection.jsx
import React from "react";
import { Package, Users, ShoppingBag, FileText } from "lucide-react";

const StatsSection = () => {
  const stats = [
    { icon: Package, label: "Products Listed", value: "98,500" },
    { icon: Users, label: "Verified Suppliers", value: "12,500" },
    { icon: ShoppingBag, label: "Buyers Connected", value: "4,50,000" },
    { icon: FileText, label: "RFQs Fulfilled", value: "85,000" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(24,100%,90%)] rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-[hsl(24,100%,50%)]" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
