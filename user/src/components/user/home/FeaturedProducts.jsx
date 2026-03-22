import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Star, Shield, Loader } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { GETMethod } from "../../../utils/service";
import { StaticAPI } from "../../../utils/StaticApi";

const FeaturedProducts = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await GETMethod(
        `${StaticAPI.getAllFeaturedProducts}?limit=12&isFeatured=true`,
      );

      if (response.success && response.products) {
        // Transform API response to match component structure
        const formattedProducts = response.products.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.shortDescription || product.description,
          price: formatPriceRange(product.pricingTiers),
          unit: getUnitFromPricingTiers(product.pricingTiers),
          moq: product.minimumOrderQuantity,
          image: product.images?.[0]?.url,
          rating: product.rating?.average || 4.5,
          verified: true,
          fulfilled: product.bulkOrderEligible || false,
          discount: getDiscount(product.pricingTiers),
          slug: product.slug,
          seller: product.seller?.businessName || "Verified Seller",
        }));
        setProducts(formattedProducts);
      } else {
        // Fallback to sample data if API fails
        setProducts(getSampleProducts());
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format price range
  const formatPriceRange = (pricingTiers) => {
    if (!pricingTiers || pricingTiers.length === 0) return "0 - 0";
    const prices = pricingTiers.map((tier) => tier.pricePerPiece);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return minPrice.toLocaleString();
    }
    return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
  };

  // Helper function to get unit from pricing tiers
  const getUnitFromPricingTiers = (pricingTiers) => {
    // Default unit - you can determine from product or category
    return "piece";
  };

  // Helper function to get discount
  const getDiscount = (pricingTiers) => {
    if (!pricingTiers || pricingTiers.length === 0) return null;
    const maxDiscount = Math.max(
      ...pricingTiers.map((tier) => tier.discount || 0),
    );
    return maxDiscount > 0 ? `${maxDiscount}% off` : null;
  };

  // Handle request quote
  const handleRequestQuote = (product) => {
    window.location.href = `/products/product/${product.id}`;
  };

  // Fetch featured products from API
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-12 h-12 text-[hsl(24,100%,50%)] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[hsl(24,100%,50%)] text-white px-6 py-2 rounded-lg hover:bg-[hsl(24,100%,40%)]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        {products.length > 0 ? (
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
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div
                  onClick={() => handleRequestQuote(product)}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full"
                >
                  {/* Product Image with Discount Badge - Fixed height */}
                  <div className="relative h-48 flex-shrink-0 bg-gradient-to-br from-[hsl(24,100%,90%)] to-[hsl(24,100%,80%)] flex items-center justify-center overflow-hidden">
                    {product.image?.startsWith("http") ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-32 w-32 object-contain transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                        {product.image || "📦"}
                      </span>
                    )}
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}
                      </div>
                    )}
                  </div>

                  {/* Product Details - Fixed content area */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Rating and Verified Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold ml-1">
                          {product.rating?.toFixed(1) || "4.5"}
                        </span>
                      </div>
                      {product.verified && (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Product Title - Fixed height for 2 lines */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem] group-hover:text-[hsl(24,100%,50%)] transition-colors">
                      {product.name}
                    </h3>

                    {/* Seller Name - Fixed height */}
                    <p className="text-xs text-gray-500 mb-2 min-h-[1.25rem]">
                      by {product.seller || "Verified Seller"}
                    </p>

                    {/* Description - Fixed height for 2 lines */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>

                    {/* Price - Fixed height */}
                    <div className="mb-2 min-h-[2rem]">
                      <span className="text-xl font-bold text-[hsl(24,100%,50%)]">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {" "}
                        / {product.unit || "piece"}
                      </span>
                    </div>

                    {/* MOQ - Fixed height */}
                    <p className="text-sm text-gray-600 mb-3 min-h-[1.5rem]">
                      <span className="font-medium">MOQ:</span>{" "}
                      {product.moq || "1"} {product.unit || "piece"}
                    </p>

                    {/* Fulfilled by Platform Badge - Fixed height */}
                    <div className="min-h-[2.5rem] mb-2">
                      {product.fulfilled && (
                        <div className="flex items-center text-xs text-gray-500 bg-gray-50 py-1 px-2 rounded-full w-fit">
                          <Shield className="w-3 h-3 mr-1 text-[hsl(24,100%,50%)]" />
                          Fulfilled by Platform
                        </div>
                      )}
                    </div>

                    {/* Action Button - Fixed at bottom */}
                    <button className="w-full bg-[hsl(24,100%,50%)] text-white py-2.5 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg mt-auto">
                      Request Quote
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No featured products available at the moment.
            </p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => (window.location.href = "/products")}
            className="flex items-center text-[hsl(24,100%,50%)] font-semibold hover:text-[hsl(24,100%,40%)] transition-colors bg-white px-6 py-3 rounded-full shadow-md"
          >
            View All Products <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
