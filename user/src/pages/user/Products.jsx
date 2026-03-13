// import { Loader2, X } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import UserLayout from "../../components/UserLayout";
// import { GETMethod } from "../../utils/service";
// import { StaticAPI } from "../../utils/StaticApi";
// import { useParams } from "react-router-dom";

// const Products = () => {
//   const { categoryId } = useParams();
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   const [sortBy, setSortBy] = useState("newest");

//   // API response states
//   const [category, setCategory] = useState(null);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [availableFilters, setAvailableFilters] = useState({
//     sellers: [],
//     priceRange: { min: 0, max: 0 },
//     subcategories: [],
//   });

//   // Infinite scroll states
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const observerRef = useRef();
//   const lastProductRef = useRef();

//   const itemsPerPage = 8;

//   // Fetch category products from API
//   const fetchCategoryProducts = async () => {
//     setInitialLoading(true);
//     try {
//       const response = await GETMethod(
//         `${StaticAPI.getCategoryProducts}?categoryId=${categoryId}&limit=100`,
//       ); // Fetch more products for filtering

//       if (response.success) {
//         setCategory(response.category);
//         setAllProducts(response.products);

//         // Set available filters from API response
//         setAvailableFilters({
//           sellers: response.filters?.sellers || [],
//           priceRange: response.filters?.priceRange || { min: 0, max: 0 },
//           subcategories: response.category?.subcategories || [],
//         });

//         // Initialize price range from actual data
//         if (response.filters?.priceRange) {
//           setPriceRange({
//             min: response.filters.priceRange.min || 0,
//             max: response.filters.priceRange.max || 50000,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   // Apply filters and sorting to products
//   const applyFilters = useCallback(() => {
//     let filtered = [...allProducts];

//     // Filter by subcategories (if any selected)
//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter((product) => {
//         const productCategory =
//           product.category?.name || product.subCategory?.name;
//         return selectedCategories.includes(productCategory);
//       });
//     }

//     // Filter by price range
//     filtered = filtered.filter((product) => {
//       const productPrice = product.pricingTiers?.[0]?.pricePerPiece || 0;
//       return productPrice >= priceRange.min && productPrice <= priceRange.max;
//     });

//     // Apply sorting
//     switch (sortBy) {
//       case "price_asc":
//         filtered.sort((a, b) => {
//           const priceA = a.pricingTiers?.[0]?.pricePerPiece || 0;
//           const priceB = b.pricingTiers?.[0]?.pricePerPiece || 0;
//           return priceA - priceB;
//         });
//         break;
//       case "price_desc":
//         filtered.sort((a, b) => {
//           const priceA = a.pricingTiers?.[0]?.pricePerPiece || 0;
//           const priceB = b.pricingTiers?.[0]?.pricePerPiece || 0;
//           return priceB - priceA;
//         });
//         break;
//       case "rating_desc":
//         filtered.sort(
//           (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
//         );
//         break;
//       case "popular":
//         filtered.sort(
//           (a, b) => (b.rating?.count || 0) - (a.rating?.count || 0),
//         );
//         break;
//       case "newest":
//       default:
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//     }

//     setFilteredProducts(filtered);

//     // Reset pagination when filters change
//     setDisplayedProducts([]);
//     setPage(1);
//     setHasMore(filtered.length > 0);
//   }, [allProducts, selectedCategories, priceRange, sortBy]);

//   // Initial fetch
//   useEffect(() => {
//     fetchCategoryProducts();
//   }, [categoryId]);

//   // Apply filters when products or filters change
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       applyFilters();
//     }
//   }, [allProducts, selectedCategories, priceRange, sortBy, applyFilters]);

//   // Load more products for infinite scroll
//   const loadMoreProducts = useCallback(() => {
//     if (loading || !hasMore) return;

//     setLoading(true);

//     // Simulate API call with timeout for smooth loading
//     setTimeout(() => {
//       const start = (page - 1) * itemsPerPage;
//       const end = start + itemsPerPage;
//       const newProducts = filteredProducts.slice(start, end);

//       if (newProducts.length > 0) {
//         setDisplayedProducts((prev) => [...prev, ...newProducts]);
//         setPage((prev) => prev + 1);
//         setHasMore(end < filteredProducts.length);
//       } else {
//         setHasMore(false);
//       }

//       setLoading(false);
//     }, 500);
//   }, [page, loading, hasMore, filteredProducts]);

//   // Initial load and load when page changes
//   useEffect(() => {
//     if (filteredProducts.length > 0 && page === 1) {
//       loadMoreProducts();
//     }
//   }, [page, loadMoreProducts, filteredProducts]);

//   // Setup intersection observer for infinite scroll
//   useEffect(() => {
//     if (loading || initialLoading) return;

//     if (observerRef.current) {
//       observerRef.current.disconnect();
//     }

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           loadMoreProducts();
//         }
//       },
//       { threshold: 0.1 },
//     );

//     if (lastProductRef.current) {
//       observerRef.current.observe(lastProductRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [loading, hasMore, loadMoreProducts, initialLoading]);

//   // Handle category selection
//   const handleCategoryChange = (categoryName) => {
//     setSelectedCategories((prev) => {
//       if (prev.includes(categoryName)) {
//         return prev.filter((c) => c !== categoryName);
//       } else {
//         return [...prev, categoryName];
//       }
//     });
//   };

//   // Handle reset all filters
//   const handleResetAll = () => {
//     setSelectedCategories([]);
//     setPriceRange({
//       min: availableFilters.priceRange?.min || 0,
//       max: availableFilters.priceRange?.max || 50000,
//     });
//     setSortBy("newest");
//   };

//   // Format price display
//   const formatPrice = (product) => {
//     if (!product.pricingTiers || product.pricingTiers.length === 0) {
//       return "Price on request";
//     }

//     const prices = product.pricingTiers.map((tier) => tier.pricePerPiece);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     if (minPrice === maxPrice) {
//       return `₹ ${minPrice.toLocaleString()}`;
//     }
//     return `₹ ${minPrice.toLocaleString()} - ₹ ${maxPrice.toLocaleString()}`;
//   };

//   // Get MOQ
//   const getMOQ = (product) => {
//     return product.minimumOrderQuantity || 1;
//   };

//   if (initialLoading) {
//     return (
//       <UserLayout>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
//         </div>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Category Header */}
//           {category && (
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {category.name}
//               </h1>
//               {category.description && (
//                 <p className="text-gray-600">{category.description}</p>
//               )}
//             </div>
//           )}

//           <div className="flex flex-col md:flex-row gap-8">
//             {/* Desktop Sidebar */}
//             <div className="hidden md:block w-64 flex-shrink-0">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="font-semibold text-gray-900">Filters</h2>
//                   <button
//                     onClick={handleResetAll}
//                     className="text-sm text-orange-600 hover:text-orange-700 font-medium"
//                   >
//                     Reset All
//                   </button>
//                 </div>

//                 {/* Categories/Subcategories */}
//                 {availableFilters.subcategories &&
//                   availableFilters.subcategories.length > 0 && (
//                     <div className="mb-8">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="font-medium text-gray-900">
//                           Subcategories
//                         </h3>
//                         <span className="text-sm text-gray-500">
//                           {availableFilters.subcategories.length} items
//                         </span>
//                       </div>
//                       <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                         {availableFilters.subcategories.map((subcat) => (
//                           <label
//                             key={subcat}
//                             className="flex items-center justify-between cursor-pointer group"
//                           >
//                             <div className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedCategories.includes(subcat)}
//                                 onChange={() => handleCategoryChange(subcat)}
//                                 className="w-4 h-4 border-2 border-gray-300 rounded-md text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
//                               />
//                               <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
//                                 {subcat}
//                               </span>
//                             </div>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Price Range */}
//                 <div className="mb-8">
//                   <h3 className="font-medium text-gray-900 mb-4">
//                     Price Range
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="flex-1">
//                         <label className="text-xs text-gray-500 mb-1 block">
//                           Min (₹)
//                         </label>
//                         <input
//                           type="number"
//                           value={priceRange.min}
//                           onChange={(e) =>
//                             setPriceRange({
//                               ...priceRange,
//                               min: Number(e.target.value) || 0,
//                             })
//                           }
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                           min={availableFilters.priceRange?.min || 0}
//                           max={availableFilters.priceRange?.max || 50000}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="text-xs text-gray-500 mb-1 block">
//                           Max (₹)
//                         </label>
//                         <input
//                           type="number"
//                           value={priceRange.max}
//                           onChange={(e) =>
//                             setPriceRange({
//                               ...priceRange,
//                               max: Number(e.target.value) || 0,
//                             })
//                           }
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                           min={availableFilters.priceRange?.min || 0}
//                           max={availableFilters.priceRange?.max || 50000}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sort Options in Sidebar */}
//                 <div>
//                   <h3 className="font-medium text-gray-900 mb-4">Sort By</h3>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   >
//                     <option value="newest">Newest First</option>
//                     <option value="price_asc">Price: Low to High</option>
//                     <option value="price_desc">Price: High to Low</option>
//                     <option value="rating_desc">Top Rated</option>
//                     <option value="popular">Most Popular</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Filters Drawer */}
//             {mobileFiltersOpen && (
//               <div className="fixed inset-0 z-50 md:hidden">
//                 <div
//                   className="absolute inset-0 bg-black bg-opacity-50"
//                   onClick={() => setMobileFiltersOpen(false)}
//                 />
//                 <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="font-semibold text-gray-900">Filters</h2>
//                       <button onClick={() => setMobileFiltersOpen(false)}>
//                         <X className="w-5 h-5 text-gray-500" />
//                       </button>
//                     </div>

//                     {/* Mobile filter content */}
//                     <div className="space-y-6">
//                       {availableFilters.subcategories &&
//                         availableFilters.subcategories.length > 0 && (
//                           <div>
//                             <h3 className="font-medium text-gray-900 mb-3">
//                               Subcategories
//                             </h3>
//                             <div className="space-y-2">
//                               {availableFilters.subcategories.map((subcat) => (
//                                 <label
//                                   key={subcat}
//                                   className="flex items-center"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedCategories.includes(
//                                       subcat,
//                                     )}
//                                     onChange={() =>
//                                       handleCategoryChange(subcat)
//                                     }
//                                     className="w-4 h-4 border-2 border-gray-300 rounded-md text-orange-600"
//                                   />
//                                   <span className="ml-2 text-sm text-gray-600">
//                                     {subcat}
//                                   </span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                       <div>
//                         <h3 className="font-medium text-gray-900 mb-3">
//                           Sort By
//                         </h3>
//                         <select
//                           value={sortBy}
//                           onChange={(e) => setSortBy(e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
//                         >
//                           <option value="newest">Newest First</option>
//                           <option value="price_asc">Price: Low to High</option>
//                           <option value="price_desc">Price: High to Low</option>
//                           <option value="rating_desc">Top Rated</option>
//                           <option value="popular">Most Popular</option>
//                         </select>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setMobileFiltersOpen(false)}
//                       className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
//                     >
//                       Apply Filters
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid */}
//             <div className="flex-1">
//               {/* Product Cards */}
//               <div
//                 className={`grid gap-6 ${
//                   viewMode === "grid"
//                     ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
//                     : "grid-cols-1"
//                 }`}
//               >
//                 {displayedProducts.map((product, index) => (
//                   <div
//                     key={product._id}
//                     ref={
//                       index === displayedProducts.length - 1
//                         ? lastProductRef
//                         : null
//                     }
//                     className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
//                       viewMode === "list" ? "flex" : "flex flex-col"
//                     }`}
//                   >
//                     {/* Product Image */}
//                     <div
//                       className={`${
//                         viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "h-48"
//                       } bg-gray-100 relative`}
//                     >
//                       <img
//                         src={
//                           product.images?.find((img) => img.isPrimary)?.url ||
//                           product.images?.[0]?.url ||
//                           "/api/placeholder/400/300"
//                         }
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                       />
//                       {product.isFeatured && (
//                         <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                           Featured
//                         </span>
//                       )}
//                     </div>

//                     {/* Product Info */}
//                     <div className="p-5 flex flex-col gap-3 flex-1">
//                       <h3 className="font-semibold text-gray-900 text-lg leading-tight">
//                         {product.name}
//                       </h3>

//                       <p className="text-sm text-gray-600 line-clamp-2">
//                         {product.shortDescription}
//                       </p>

//                       <div className="text-xl font-bold text-gray-900">
//                         {formatPrice(product)}
//                         <span className="text-sm font-normal text-gray-500">
//                           {" "}
//                           / piece
//                         </span>
//                       </div>

//                       <div className="text-sm text-gray-600">
//                         MOQ: {getMOQ(product)} pieces
//                       </div>

//                       {/* Rating */}
//                       {product.rating?.average > 0 && (
//                         <div className="flex items-center gap-2">
//                           <div className="flex items-center">
//                             <span className="text-yellow-400">★</span>
//                             <span className="ml-1 text-sm font-medium">
//                               {product.rating.average.toFixed(1)}
//                             </span>
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             ({product.rating.count} reviews)
//                           </span>
//                         </div>
//                       )}

//                       {/* Seller Info */}
//                       {product.seller && (
//                         <div className="text-sm text-gray-600">
//                           Seller:{" "}
//                           {product.seller.businessName ||
//                             product.seller.storeName ||
//                             "Verified Seller"}
//                           {product.seller.verified && (
//                             <span className="ml-2 text-green-600 text-xs">
//                               ✓ Verified
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex items-center justify-between pt-2">
//                         <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
//                           Request Quote
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Loading Indicator */}
//               {loading && (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
//                 </div>
//               )}

//               {/* No Products Message */}
//               {displayedProducts.length === 0 &&
//                 !loading &&
//                 !initialLoading && (
//                   <div className="text-center py-12">
//                     <p className="text-gray-500">
//                       No products found in this category
//                     </p>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </UserLayout>
//   );
// };

// export default Products;

import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import UserLayout from "../../components/UserLayout";
import { GETMethod } from "../../utils/service";
import { StaticAPI } from "../../utils/StaticApi";
import { useParams } from "react-router-dom";

const Products = () => {
  const { categoryId } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // API response states
  const [category, setCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    sellers: [],
    priceRange: { min: 0, max: 0 },
    subcategories: [],
  });

  // Infinite scroll states
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const lastProductRef = useRef();

  const itemsPerPage = 8;

  // Fetch category products from API
  const fetchCategoryProducts = async () => {
    setInitialLoading(true);
    try {
      const response = await GETMethod(
        `${StaticAPI.getCategoryProducts}?categoryId=${categoryId}&limit=100`,
      ); // Fetch more products for filtering

      if (response.success) {
        setCategory(response.category);
        setAllProducts(response.products);

        // Set available filters from API response
        setAvailableFilters({
          sellers: response.filters?.sellers || [],
          priceRange: response.filters?.priceRange || { min: 0, max: 0 },
          subcategories: response.category?.subcategories || [],
        });

        // Initialize price range from actual data
        if (response.filters?.priceRange) {
          setPriceRange({
            min: response.filters.priceRange.min || 0,
            max: response.filters.priceRange.max || 50000,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Apply filters and sorting to products
  const applyFilters = useCallback(() => {
    let filtered = [...allProducts];

    // Filter by subcategories (if any selected)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const productCategory =
          product.category?.name || product.subCategory?.name;
        return selectedCategories.includes(productCategory);
      });
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const productPrice = product.pricingTiers?.[0]?.pricePerPiece || 0;
      return productPrice >= priceRange.min && productPrice <= priceRange.max;
    });

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => {
          const priceA = a.pricingTiers?.[0]?.pricePerPiece || 0;
          const priceB = b.pricingTiers?.[0]?.pricePerPiece || 0;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        filtered.sort((a, b) => {
          const priceA = a.pricingTiers?.[0]?.pricePerPiece || 0;
          const priceB = b.pricingTiers?.[0]?.pricePerPiece || 0;
          return priceB - priceA;
        });
        break;
      case "rating_desc":
        filtered.sort(
          (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
        );
        break;
      case "popular":
        filtered.sort(
          (a, b) => (b.rating?.count || 0) - (a.rating?.count || 0),
        );
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);

    // Reset pagination when filters change
    setDisplayedProducts([]);
    setPage(1);
    setHasMore(filtered.length > 0);
  }, [allProducts, selectedCategories, priceRange, sortBy]);

  // Initial fetch
  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId]);

  // Apply filters when products or filters change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [allProducts, selectedCategories, priceRange, sortBy, applyFilters]);

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call with timeout for smooth loading
    setTimeout(() => {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const newProducts = filteredProducts.slice(start, end);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage((prev) => prev + 1);
        setHasMore(end < filteredProducts.length);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }, 500);
  }, [page, loading, hasMore, filteredProducts]);

  // Initial load and load when page changes
  useEffect(() => {
    if (filteredProducts.length > 0 && page === 1) {
      loadMoreProducts();
    }
  }, [page, loadMoreProducts, filteredProducts]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loading || initialLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 },
    );

    if (lastProductRef.current) {
      observerRef.current.observe(lastProductRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMoreProducts, initialLoading]);

  // Handle category selection
  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((c) => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // Handle price range change
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      min: Math.min(value, prev.max - 1), // Ensure min doesn't exceed max
    }));
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      max: Math.max(value, prev.min + 1), // Ensure max doesn't go below min
    }));
  };

  // Handle reset all filters
  const handleResetAll = () => {
    setSelectedCategories([]);
    setPriceRange({
      min: availableFilters.priceRange?.min || 0,
      max: availableFilters.priceRange?.max || 50000,
    });
    setSortBy("newest");
  };

  // Format price display
  const formatPrice = (product) => {
    if (!product.pricingTiers || product.pricingTiers.length === 0) {
      return "Price on request";
    }

    const prices = product.pricingTiers.map((tier) => tier.pricePerPiece);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `₹ ${minPrice.toLocaleString()}`;
    }
    return `₹ ${minPrice.toLocaleString()} - ₹ ${maxPrice.toLocaleString()}`;
  };

  // Get MOQ
  const getMOQ = (product) => {
    return product.minimumOrderQuantity || 1;
  };

  if (initialLoading) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          {category && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={handleResetAll}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Reset All
                  </button>
                </div>

                {/* Categories/Subcategories */}
                {availableFilters.subcategories &&
                  availableFilters.subcategories.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">
                          Subcategories
                        </h3>
                        <span className="text-sm text-gray-500">
                          {availableFilters.subcategories.length} items
                        </span>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {availableFilters.subcategories.map((subcat) => (
                          <label
                            key={subcat}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(subcat)}
                                onChange={() => handleCategoryChange(subcat)}
                                className="w-4 h-4 border-2 border-gray-300 rounded-md text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
                              />
                              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
                                {subcat}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Price Range Slider */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Price Range
                  </h3>

                  {/* Price Range Slider */}
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min={availableFilters.priceRange?.min || 0}
                        max={availableFilters.priceRange?.max || 50000}
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-6px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                        style={{ zIndex: 2 }}
                      />
                      <input
                        type="range"
                        min={availableFilters.priceRange?.min || 0}
                        max={availableFilters.priceRange?.max || 50000}
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-6px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                        style={{ zIndex: 3 }}
                      />

                      {/* Range Track Background */}
                      <div className="w-full h-2 bg-gray-200 rounded-lg absolute top-0"></div>

                      {/* Active Range Highlight */}
                      <div
                        className="absolute h-2 bg-orange-200 rounded-lg top-0"
                        style={{
                          left: `${((priceRange.min - (availableFilters.priceRange?.min || 0)) / ((availableFilters.priceRange?.max || 50000) - (availableFilters.priceRange?.min || 0))) * 100}%`,
                          right: `${100 - ((priceRange.max - (availableFilters.priceRange?.min || 0)) / ((availableFilters.priceRange?.max || 50000) - (availableFilters.priceRange?.min || 0))) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {/* Price Inputs */}
                    <div className="flex items-center gap-3 pt-6">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Min (₹)
                        </label>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={handleMinPriceChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          min={availableFilters.priceRange?.min || 0}
                          max={priceRange.max - 1}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Max (₹)
                        </label>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={handleMaxPriceChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          min={priceRange.min + 1}
                          max={availableFilters.priceRange?.max || 50000}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort Options in Sidebar */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Top Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-gray-900">Filters</h2>
                      <button onClick={() => setMobileFiltersOpen(false)}>
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Mobile filter content */}
                    <div className="space-y-6">
                      {availableFilters.subcategories &&
                        availableFilters.subcategories.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                              Subcategories
                            </h3>
                            <div className="space-y-2">
                              {availableFilters.subcategories.map((subcat) => (
                                <label
                                  key={subcat}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                      subcat,
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(subcat)
                                    }
                                    className="w-4 h-4 border-2 border-gray-300 rounded-md text-orange-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-600">
                                    {subcat}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Mobile Price Range */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                          Price Range
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={priceRange.min}
                              onChange={handleMinPriceChange}
                              placeholder="Min"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              min={availableFilters.priceRange?.min || 0}
                              max={priceRange.max - 1}
                            />
                            <span className="text-gray-500">-</span>
                            <input
                              type="number"
                              value={priceRange.max}
                              onChange={handleMaxPriceChange}
                              placeholder="Max"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              min={priceRange.min + 1}
                              max={availableFilters.priceRange?.max || 50000}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                          Sort By
                        </h3>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="newest">Newest First</option>
                          <option value="price_asc">Price: Low to High</option>
                          <option value="price_desc">Price: High to Low</option>
                          <option value="rating_desc">Top Rated</option>
                          <option value="popular">Most Popular</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Product Cards */}
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {displayedProducts.map((product, index) => (
                  <div
                    key={product._id}
                    ref={
                      index === displayedProducts.length - 1
                        ? lastProductRef
                        : null
                    }
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
                      viewMode === "list"
                        ? "flex"
                        : "flex flex-col justify-between flex-1"
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`${
                        viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "h-48"
                      } bg-gray-100 relative`}
                    >
                      <img
                        src={
                          product.images?.find((img) => img.isPrimary)?.url ||
                          product.images?.[0]?.url ||
                          "/api/placeholder/400/300"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isFeatured && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(product)}
                        <span className="text-sm font-normal text-gray-500">
                          {" "}
                          / piece
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        MOQ: {getMOQ(product)} pieces
                      </div>

                      {/* Rating */}
                      {product.rating?.average > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-sm font-medium">
                              {product.rating.average.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.rating.count} reviews)
                          </span>
                        </div>
                      )}

                      {/* Seller Info */}
                      {product.seller && (
                        <div className="text-sm text-gray-600">
                          Seller:{" "}
                          {product.seller.businessName ||
                            product.seller.storeName ||
                            "Verified Seller"}
                          {product.seller.verified && (
                            <span className="ml-2 text-green-600 text-xs">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                </div>
              )}

              {/* No Products Message */}
              {displayedProducts.length === 0 &&
                !loading &&
                !initialLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No products found in this category
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Products;
