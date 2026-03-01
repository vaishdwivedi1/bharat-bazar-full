// components/CategoryGridCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const CategoryGridCarousel = () => {
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

  const categories = [
    {
      name: "Electronics & Electrical",
      products: "15,420",
      subcategories: ["Mobile Phones", "Computer Hardware", "LED Lights"],
      icon: "🔌",
    },
    {
      name: "Textiles & Apparel",
      products: "28,350",
      subcategories: ["Cotton Fabrics", "Ready Made Garments", "Sarees"],
      icon: "👕",
    },
    {
      name: "Industrial Supplies",
      products: "12,890",
      subcategories: [
        "Tools & Equipment",
        "Safety Products",
        "Packaging Materials",
      ],
      icon: "⚙️",
    },
    {
      name: "Food & Agriculture",
      products: "18,670",
      subcategories: ["Grains & Pulses", "Spices", "Fresh Vegetables"],
      icon: "🌾",
    },
    {
      name: "Building Materials",
      products: "9,450",
      subcategories: ["Cement & Concrete", "Steel & Iron", "Tiles & Flooring"],
      icon: "🏗️",
    },
    {
      name: "Furniture & Decor",
      products: "7,820",
      subcategories: ["Office Furniture", "Home Furniture", "Decorative Items"],
      icon: "🪑",
    },
    {
      name: "Machinery & Equipment",
      products: "6,340",
      subcategories: [
        "Manufacturing Machines",
        "Agricultural Machines",
        "Printing Machines",
      ],
      icon: "🔧",
    },
    {
      name: "Health & Medical",
      products: "5,120",
      subcategories: ["Medical Equipment", "Pharmaceuticals", "Personal Care"],
      icon: "💊",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Browse Categories
            </h2>
            <p className="text-gray-600 mt-2">
              Explore products across thousands of categories
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
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

        {/* Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] pl-4 first:pl-0"
              >
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[hsl(24,100%,50%)] group cursor-pointer mx-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <span className="text-sm text-[hsl(24,100%,50%)] font-semibold bg-white px-2 py-1 rounded-full shadow-sm">
                      {category.products} Products
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[hsl(24,100%,50%)] transition-colors">
                    {category.name}
                  </h3>
                  <ul className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <a
                          href="#"
                          className="text-sm text-gray-600 hover:text-[hsl(24,100%,50%)] transition-colors inline-block hover:translate-x-1 transform duration-300"
                        >
                          {sub}
                        </a>
                      </li>
                    ))}
                  </ul>
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
      </div>
    </div>
  );
};

export default CategoryGridCarousel;
