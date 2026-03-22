// components/StatsSection.jsx
import React from "react";
import {
  Package,
  Users,
  ShoppingBag,
  Shield,
  Award,
  Headphones,
  TrendingUp,
  Building2,
  Truck,
} from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Package,
      label: "Products Listed",
      value: "98,500",
      suffix: "+",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Wide range of products",
    },
    {
      icon: Users,
      label: "Verified Suppliers",
      value: "12,500",
      suffix: "+",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Trusted sellers",
    },
    {
      icon: ShoppingBag,
      label: "Buyers Connected",
      value: "4,50,000",
      suffix: "+",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Active buyers",
    },
    {
      icon: TrendingUp,
      label: "Monthly Transactions",
      value: "₹50Cr",
      suffix: "+",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Growing rapidly",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% Protected",
      detailedDesc: "Your transactions are safe with us",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Trusted Products",
      detailedDesc: "Every product is verified",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always Available",
      detailedDesc: "We're here to help anytime",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Building2,
      title: "Business Network",
      description: "Pan India",
      detailedDesc: "Connected across India",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Stats Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Platform in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of businesses across India
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-full mb-4`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                  <span className="text-lg text-gray-500">{stat.suffix}</span>
                </div>
                <div className="text-gray-600 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {feature.description}
                </p>
                <p className="text-xs text-gray-400">{feature.detailedDesc}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <button className="bg-[hsl(24,100%,50%)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Business Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
