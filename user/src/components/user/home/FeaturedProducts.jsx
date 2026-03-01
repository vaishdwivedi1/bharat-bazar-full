// components/FeaturedProducts.jsx
import React, { useRef } from "react";
import { ChevronRight, ChevronLeft, Star, Shield } from "lucide-react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const FeaturedProducts = () => {
  // Create refs for custom navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const products = [
    {
      name: "Samsung Galaxy A54 5G Bulk Pack",
      description: "Samsung Galaxy A54 5G - 8GB RAM, 256GB Storage",
      price: "27,000 - 28,500",
      unit: "pieces",
      moq: "50",
      image: "📱",
      rating: 4.8,
      verified: true,
      fulfilled: true,
      discount: "12% off",
    },
    {
      name: "Premium Cotton Fabric Roll",
      description: "100% Cotton, 120 GSM, Multiple Colors",
      price: "72 - 85",
      unit: "meters",
      moq: "100",
      image: "🧵",
      rating: 4.6,
      verified: true,
      fulfilled: true,
      discount: "8% off",
    },
    {
      name: "Heavy Duty Industrial Drill Machine",
      description: "1500W Motor, Variable Speed, Metal Body",
      price: "7,500 - 8,500",
      unit: "pieces",
      moq: "10",
      image: "🔨",
      rating: 4.7,
      verified: true,
      fulfilled: true,
      discount: "15% off",
    },
    {
      name: "Organic Basmati Rice Premium Grade",
      description: "Organic, Long Grain, Aged 2 Years",
      price: "110 - 125",
      unit: "kg",
      moq: "500",
      image: "🌾",
      rating: 4.9,
      verified: true,
      fulfilled: true,
      discount: "5% off",
    },
    {
      name: "LED Panel Light 40W Bulk Pack",
      description: "40W, 4000 Lumens, Cool White, Energy Efficient",
      price: "520 - 650",
      unit: "pieces",
      moq: "100",
      image: "💡",
      rating: 4.5,
      verified: true,
      fulfilled: true,
      discount: "18% off",
    },
    {
      name: "Executive Office Chair Bulk Order",
      description: "Ergonomic, Adjustable Height, Mesh Back Support",
      price: "5,500 - 6,500",
      unit: "pieces",
      moq: "20",
      image: "🪑",
      rating: 4.4,
      verified: true,
      fulfilled: true,
      discount: "10% off",
    },
    {
      name: "Industrial Safety Gloves Pack",
      description: "Cut Resistant, Leather Palm, Heavy Duty",
      price: "450 - 550",
      unit: "pair",
      moq: "500",
      image: "🧤",
      rating: 4.7,
      verified: true,
      fulfilled: true,
      discount: "7% off",
    },
    {
      name: "Premium Quality Silk Sarees",
      description: "Pure Silk, Traditional Designs, Zari Work",
      price: "7,200 - 8,500",
      unit: "pieces",
      moq: "25",
      image: "👘",
      rating: 4.8,
      verified: true,
      fulfilled: true,
      discount: "20% off",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-2">
              Top selling products from verified suppliers
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Custom Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                ref={prevRef}
                className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-[hsl(24,100%,90%)] text-gray-600 hover:text-[hsl(24,100%,50%)] flex items-center justify-center transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                ref={nextRef}
                className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-[hsl(24,100%,90%)] text-gray-600 hover:text-[hsl(24,100%,50%)] flex items-center justify-center transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="featured-products-swiper"
          onInit={(swiper) => {
            // Fix for navigation buttons initialization
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group h-full flex flex-col">
                {/* Product Image with Discount Badge */}
                <div className="relative h-48 bg-gradient-to-br from-[hsl(24,100%,90%)] to-[hsl(24,100%,80%)] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </span>
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Rating and Verified Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold ml-1">
                        {product.rating}
                      </span>
                    </div>
                    {product.verified && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[hsl(24,100%,50%)] transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-xl font-bold text-[hsl(24,100%,50%)]">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      / {product.unit}
                    </span>
                  </div>

                  {/* MOQ */}
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">MOQ:</span> {product.moq}{" "}
                    {product.unit}
                  </p>

                  {/* Fulfilled by Platform Badge */}
                  {product.fulfilled && (
                    <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 py-1 px-2 rounded-full w-fit">
                      <Shield className="w-3 h-3 mr-1 text-[hsl(24,100%,50%)]" />
                      Fulfilled by Platform
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-[hsl(24,100%,50%)] text-white py-2.5 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg mt-auto">
                    Request Quote
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <button className="flex items-center text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] transition-colors bg-white px-6 py-3 rounded-full shadow-md">
            View All Products <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
