// components/TopSuppliersCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Star,
  Award,
  Package,
  Calendar,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const TopSuppliersCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: true,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const suppliers = [
    {
      name: "Rajesh Electronics Pvt Ltd",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      products: 245,
      years: 21,
      type: "Manufacturer",
      revenue: "₹50-100 Cr",
      verified: true,
      topSupplier: true,
      image: "🏭",
      established: "2003",
    },
    {
      name: "Sharma Textiles",
      location: "Surat, Gujarat",
      rating: 4.6,
      products: 520,
      years: 28,
      type: "Manufacturer & Exporter",
      revenue: "₹100-500 Cr",
      verified: true,
      topSupplier: true,
      image: "🧵",
      established: "1996",
    },
    {
      name: "Agro Fresh Exports",
      location: "Nashik, Maharashtra",
      rating: 4.7,
      products: 95,
      years: 11,
      type: "Exporter",
      revenue: "₹25-50 Cr",
      verified: true,
      topSupplier: true,
      image: "🌾",
      established: "2013",
    },
    {
      name: "Delhi Furniture House",
      location: "New Delhi, Delhi",
      rating: 4.3,
      products: 210,
      years: 26,
      type: "Manufacturer",
      revenue: "₹25-50 Cr",
      verified: true,
      topSupplier: true,
      image: "🪑",
      established: "1998",
    },
    {
      name: "Techno Tools Pvt Ltd",
      location: "Pune, Maharashtra",
      rating: 4.9,
      products: 180,
      years: 15,
      type: "Manufacturer",
      revenue: "₹75-150 Cr",
      verified: true,
      topSupplier: true,
      image: "🔧",
      established: "2009",
    },
    {
      name: "Green Agro Industries",
      location: "Indore, Madhya Pradesh",
      rating: 4.5,
      products: 320,
      years: 18,
      type: "Processor & Exporter",
      revenue: "₹40-80 Cr",
      verified: true,
      topSupplier: true,
      image: "🌱",
      established: "2006",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Suppliers</h2>
            <p className="text-gray-600 mt-2">
              Trusted partners with verified credentials
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                prevBtnEnabled
                  ? "bg-gray-100 hover:bg-[hsl(24,100%,90%)] text-gray-600 hover:text-[hsl(24,100%,50%)]"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                nextBtnEnabled
                  ? "bg-gray-100 hover:bg-[hsl(24,100%,90%)] text-gray-600 hover:text-[hsl(24,100%,50%)]"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-2 px-2" ref={emblaRef}>
          <div className="flex">
            {suppliers.map((supplier, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"
              >
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-[hsl(24,100%,50%)] group h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[hsl(24,100%,90%)] rounded-full flex items-center justify-center text-2xl">
                        {supplier.image}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {supplier.name}
                          </h3>
                          {supplier.topSupplier && (
                            <span className="bg-[hsl(24,100%,90%)] text-[hsl(24,100%,50%)] text-xs px-2 py-1 rounded-full">
                              ⭐ Top
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-xs">{supplier.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center bg-green-100 text-green-600 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      <span className="font-semibold text-sm">
                        {supplier.rating}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 bg-white rounded-lg p-3">
                    <div className="text-center">
                      <Package className="w-4 h-4 mx-auto mb-1 text-[hsl(24,100%,50%)]" />
                      <div className="font-semibold text-gray-900 text-sm">
                        {supplier.products}+
                      </div>
                      <div className="text-[10px] text-gray-500">Products</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-4 h-4 mx-auto mb-1 text-[hsl(24,100%,50%)]" />
                      <div className="font-semibold text-gray-900 text-sm">
                        {supplier.years}+
                      </div>
                      <div className="text-[10px] text-gray-500">Years</div>
                    </div>
                    <div className="text-center">
                      <Award className="w-4 h-4 mx-auto mb-1 text-[hsl(24,100%,50%)]" />
                      <div className="font-semibold text-gray-900 text-xs truncate">
                        {supplier.type.split(" ")[0]}
                      </div>
                      <div className="text-[10px] text-gray-500">Type</div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="flex justify-between items-center mb-4 text-sm bg-white rounded-lg px-3 py-2">
                    <span className="text-gray-600">
                      Est. {supplier.established}
                    </span>
                    <span className="font-semibold text-[hsl(24,100%,50%)]">
                      {supplier.revenue}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-2.5 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="flex-1 bg-[hsl(24,100%,50%)] text-white py-2.5 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                      <Phone size={16} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-[hsl(24,100%,50%)]"
                  : "w-2 bg-gray-300 hover:bg-[hsl(24,100%,70%)]"
              }`}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="flex justify-center mt-6 md:hidden">
          <button className="flex items-center text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] transition-colors bg-gray-100 px-6 py-3 rounded-full">
            View All Suppliers <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopSuppliersCarousel;
