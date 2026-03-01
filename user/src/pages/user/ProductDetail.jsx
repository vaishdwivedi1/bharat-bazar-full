// pages/ProductDetail.jsx
import React, { useState } from "react";
import {
  Star,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Check,
  Truck,
  Package,
  RotateCcw,
  MapPin,
  Building2,
  Eye,
  Phone,
  Award,
  Clock,
  RefreshCw,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
  BadgeCheck,
  Store,
  Users,
  Calendar,
  FileText,
  Scale,
  Globe,
  Headphones,
  ThumbsUp,
} from "lucide-react";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(100);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [platformAvailability, setPlatformAvailability] = useState("in-stock");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const product = {
    name: "Samsung Galaxy A54 5G Bulk Pack",
    description: "Samsung Galaxy A54 5G - 8GB RAM, 256GB Storage",
    longDescription:
      "Brand new Samsung Galaxy A54 5G smartphone in bulk. Perfect for retailers and distributors. All units come with manufacturer warranty and GST invoice.",
    rating: 4.0,
    totalReviews: 128,
    positiveRating: "87%",
    price: "27,000",
    minPrice: "27,000",
    maxPrice: "28,500",
    moq: 50,
    images: ["📱", "📱", "📱", "📱"],
    highlights: [
      "8GB RAM for seamless multitasking",
      "256GB internal storage",
      "5G connectivity",
      "50MP main camera",
      "5000mAh battery",
      "Super AMOLED display",
    ],
    specifications: {
      Brand: "Samsung",
      Model: "Galaxy A54 5G",
      RAM: "8GB",
      Storage: "256GB",
      Color: "Awesome Black",
      Warranty: "1 Year Manufacturer",
      "Country of Origin": "India",
    },
    seller: {
      name: "JummaBaba Marketplace Pvt Ltd",
      gst: "27AABCU9603R1ZM",
      pan: "AABCU9603R",
      location: "Mumbai, Maharashtra",
      address: "123 Business Hub, Andheri East, Mumbai - 400069",
      rating: 4.5,
      totalProducts: 1250,
      yearEstablished: 2015,
      employees: "50-100",
      verified: true,
      responseTime: "< 2 hours",
      businessType: "Manufacturer & Exporter",
      annualRevenue: "₹50-100 Cr",
      certifications: ["ISO 9001:2015", "MSME", "GST Compliant"],
      paymentMethods: ["Bank Transfer", "Letter of Credit", "Cheque"],
      deliveryAreas: ["Pan India", "International"],
      socialMedia: {
        website: "www.jummababa.com",
        linkedin: "jummababa",
        facebook: "jummababa",
      },
      description:
        "Leading B2B marketplace in India with over 8 years of experience in electronics wholesale. We provide genuine products with manufacturer warranty and best bulk pricing.",
      returnPolicy: "7 days replacement for defective products",
      shippingPolicy:
        "Free shipping on orders above ₹50,000. Express delivery available.",
      teamSize: 75,
      exportCountries: ["UAE", "Singapore", "Nepal", "Bangladesh"],
      memberSince: "2015",
      lastActive: "Online now",
      totalTransactions: 15420,
      happyCustomers: 8920,
    },
  };

  const pricingTiers = [
    { range: "0-99 pieces", price: "28,000" },
    { range: "100-499 pieces", price: "27,800" },
    { range: "500+ pieces", price: "27,000" },
  ];

  const relatedProducts = [
    {
      name: "LED Panel Light 40W",
      description: "450W LED Lumen, Cool White",
      price: "520",
      mrp: "650",
      unit: "piece",
      image: "💡",
      verified: true,
    },
    {
      name: "FullHD 1080p Monitor",
      description: "24 inch, IPS Panel",
      price: "2,000",
      mrp: "2,500",
      unit: "piece",
      image: "🖥️",
      verified: true,
    },
    {
      name: "4K Ultra HD Monitor",
      description: "27 inch, HDR Support",
      price: "2,500",
      mrp: "3,200",
      unit: "piece",
      image: "🖥️",
      verified: true,
    },
    {
      name: "Premium Wireless Mouse",
      description: "Ergonomic Design",
      price: "1,800",
      mrp: "2,200",
      unit: "piece",
      image: "🖱️",
      verified: true,
    },
  ];

  const incrementQuantity = () => setQuantity((prev) => prev + 10);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > product.moq ? prev - 10 : product.moq));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="flex md:flex-row fleex-col gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="w-full">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-[hsl(24,100%,90%)] to-[hsl(24,100%,80%)] rounded-xl flex items-center justify-center mb-4 relative group">
                <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
                  {product.images[selectedImage]}
                </span>
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart
                    size={20}
                    className={
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl transition-all duration-300 ${
                      selectedImage === idx
                        ? "ring-2 ring-[hsl(24,100%,50%)] scale-105 shadow-md"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Product Details */}

          <div className="bg-white rounded-xl p-6 shadow-sm w-full">
            {/* Title & Rating */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                {product.totalReviews} reviews
              </span>
              <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full">
                {product.positiveRating} Positive
              </span>
              <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                <Shield size={12} />
                Verified
              </span>
            </div>

            {/* Quantity Guided Pricing */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Quantity-Guided Pricing
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Quantity Range
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Price per piece
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pricingTiers.map((tier, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {tier.range}
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-[hsl(24,100%,50%)]">
                          ₹{tier.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (MOQ: {product.moq} pieces)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                  >
                    <ChevronDown size={20} />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[80px] text-center border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">pieces</span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[hsl(24,100%,95%)] p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-[hsl(24,100%,50%)]">
                  ₹
                  {(
                    parseInt(quantity) *
                    parseInt(pricingTiers[2].price.replace(",", ""))
                  ).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Action Buttons Desktop */}
            <div className="hidden lg:flex flex-col gap-3">
              <button className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <ShoppingCart size={20} />
                Buy Now
              </button>
              <button className="w-full border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors flex items-center justify-center gap-2">
                <Package size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Improved Action Buttons Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-[hsl(24,100%,95%)] text-[hsl(24,100%,50%)] rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-all transform hover:-translate-y-0.5 shadow-sm">
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Request Quote</span>
              <span className="sm:hidden">Quote</span>
            </button>

            <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all transform hover:-translate-y-0.5 shadow-sm">
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Chat with Platform</span>
              <span className="sm:hidden">Chat</span>
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-sm ${
                isWishlisted
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-pink-50 text-pink-600 hover:bg-pink-100"
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              <span className="hidden sm:inline">
                {isWishlisted ? "Saved" : "Save to Wishlist"}
              </span>
              <span className="sm:hidden">Save</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-all transform hover:-translate-y-0.5 shadow-sm"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>

              {showShareOptions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl p-2 z-10 min-w-[200px]">
                  <button
                    onClick={() => copyToClipboard(window.location.href)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Facebook size={16} className="text-blue-600" />
                    <span>Facebook</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Twitter size={16} className="text-sky-500" />
                    <span>Twitter</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Linkedin size={16} className="text-blue-700" />
                    <span>LinkedIn</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mail size={16} className="text-gray-600" />
                    <span>Email</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Tabs with Seller Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {[
              "description",
              "specifications",
              "highlights",
              "seller details",
              "reviews",
              "shipping",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? "text-[hsl(24,100%,50%)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[hsl(24,100%,50%)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="prose max-w-none">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {product.longDescription}
                </p>
                <p className="text-gray-700 mt-4">
                  All units come with manufacturer warranty and GST invoice.
                  Bulk orders get special pricing and priority shipping.
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-500 min-w-[120px]">
                      {key}:
                    </span>
                    <span className="text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "highlights" && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "seller details" && (
              <div className="space-y-6">
                {/* Seller Overview */}
                <div className="bg-gradient-to-r from-[hsl(24,100%,95%)] to-[hsl(24,100%,90%)] p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Store className="w-8 h-8 text-[hsl(24,100%,50%)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {product.seller.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.seller.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Verified Seller
                        </span>
                        <span className="text-sm text-gray-400">|</span>
                        <span className="text-sm text-gray-600">
                          Member since {product.seller.memberSince}
                        </span>
                        <span className="text-sm text-green-600 font-medium ml-2">
                          ● {product.seller.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-[hsl(24,100%,50%)]" />
                    <div className="text-xl font-bold text-gray-900">
                      {product.seller.happyCustomers}+
                    </div>
                    <div className="text-xs text-gray-500">Happy Customers</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Package className="w-6 h-6 mx-auto mb-2 text-[hsl(24,100%,50%)]" />
                    <div className="text-xl font-bold text-gray-900">
                      {product.seller.totalTransactions}+
                    </div>
                    <div className="text-xs text-gray-500">Transactions</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-[hsl(24,100%,50%)]" />
                    <div className="text-xl font-bold text-gray-900">
                      {product.seller.yearEstablished}
                    </div>
                    <div className="text-xs text-gray-500">Established</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-[hsl(24,100%,50%)]" />
                    <div className="text-xl font-bold text-gray-900">
                      {product.seller.teamSize}+
                    </div>
                    <div className="text-xs text-gray-500">Team Size</div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Building2
                        size={18}
                        className="text-[hsl(24,100%,50%)]"
                      />
                      Business Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Business Type:
                        </span>
                        <span className="text-sm font-medium">
                          {product.seller.businessType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Annual Revenue:
                        </span>
                        <span className="text-sm font-medium">
                          {product.seller.annualRevenue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          GST Number:
                        </span>
                        <span className="text-sm font-medium">
                          {product.seller.gst}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          PAN Number:
                        </span>
                        <span className="text-sm font-medium">
                          {product.seller.pan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Employees:
                        </span>
                        <span className="text-sm font-medium">
                          {product.seller.employees}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Award size={18} className="text-[hsl(24,100%,50%)]" />
                      Certifications & Compliance
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {product.seller.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mt-4">
                      <Globe size={18} className="text-[hsl(24,100%,50%)]" />
                      Delivery Areas
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {product.seller.deliveryAreas.map((area, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[hsl(24,100%,50%)]" />
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <MapPin size={18} className="text-[hsl(24,100%,50%)]" />
                      Business Address
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {product.seller.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <Globe size={18} className="text-[hsl(24,100%,50%)]" />
                      Export Countries
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {product.seller.exportCountries.map((country, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white rounded-full text-xs border border-gray-200"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <RefreshCw
                        size={18}
                        className="text-[hsl(24,100%,50%)]"
                      />
                      Return Policy
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {product.seller.returnPolicy}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <Truck size={18} className="text-[hsl(24,100%,50%)]" />
                      Shipping Policy
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {product.seller.shippingPolicy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <Scale size={18} className="text-[hsl(24,100%,50%)]" />
                    Accepted Payment Methods
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {product.seller.paymentMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call Now
                  </button>
                  <button className="flex-1 border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={18} />
                    Send Inquiry
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-8 text-gray-500">
                <Star size={40} className="mx-auto mb-3 text-gray-300" />
                <p>Customer reviews will appear here</p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-5 h-5 text-[hsl(24,100%,50%)]" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-600">
                      On orders above ₹50,000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-[hsl(24,100%,50%)]" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-gray-600">
                      7 days return policy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Related Products
            </h2>
            <a
              href="/products"
              className="text-[hsl(24,100%,50%)] hover:text-[hsl(24,100%,40%)] font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                  <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </span>
                  {product.verified && (
                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield size={10} />
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[hsl(24,100%,50%)] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[hsl(24,100%,50%)]">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₹{product.mrp}
                  </span>
                </div>
                <p className="text-xs text-gray-500">/ {product.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
