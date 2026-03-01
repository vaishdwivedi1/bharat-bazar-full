// components/WhyChooseUs.jsx
import React from "react";
import { Shield, CheckCircle, Award, Headphones } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% Protected",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      title: "Verified Suppliers",
      description: "GST Registered",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Trusted Products",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always Available",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-full mb-4`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
