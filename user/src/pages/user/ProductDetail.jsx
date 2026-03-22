import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Facebook,
  Globe,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  RotateCcw,
  Scale,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Store,
  Truck,
  Twitter,
  Users,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GETMethod, POSTMethod } from "../../utils/service";
import { StaticAPI } from "../../utils/StaticApi";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(100);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await GETMethod(
          `${StaticAPI.getProductDetails}?productId=${productId}`,
        );

        if (response.success && response.product) {
          setProduct(response.product);
          // Set quantity to MOQ
          setQuantity(response.product.minimumOrderQuantity || 100);
          // Fetch related products
          fetchRelatedProducts(response.product.category);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Fetch related products
  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await GETMethod(
        `${StaticAPI.getRelatedProducts}?productId=${productId}&limit=4`,
      );
      if (response.success) {
        setRelatedProducts(response.products || []);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async () => {
    try {
      if (isWishlisted) {
        // Remove from wishlist
        await POSTMethod(StaticAPI.removeFromWishlist, {
          productId: productId,
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await POSTMethod(StaticAPI.addToWishlist, {
          productId: productId,
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Please login to add to wishlist");
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    try {
      await POSTMethod(StaticAPI.addToCart, {
        productId: productId,
        quantity: quantity,
      });
      toast.success("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    try {
      await POSTMethod(StaticAPI.createOrder, {
        productId: productId,
        quantity: quantity,
      });
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  // Request quote
  const handleRequestQuote = async () => {
    try {
      await POSTMethod(StaticAPI.requestQuote, {
        productId: productId,
        quantity: quantity,
      });
      toast.success("Quote request sent successfully");
    } catch (error) {
      console.error("Error requesting quote:", error);
      toast.error("Failed to send quote request");
    }
  };

  // Send inquiry to seller
  const handleSendInquiry = async () => {
    try {
      await POSTMethod(StaticAPI.sendInquiry, {
        productId: productId,
        message: `I'm interested in ${product?.name}. Please share more details.`,
      });
      toast.success("Inquiry sent successfully");
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry");
    }
  };

  // Format price range from pricing tiers
  const formatPriceRange = (pricingTiers) => {
    if (!pricingTiers || pricingTiers.length === 0) return "0";
    const prices = pricingTiers.map((tier) => tier.pricePerPiece);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return minPrice.toLocaleString();
    }
    return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
  };

  // Get current price based on quantity
  const getCurrentPrice = () => {
    if (!product?.pricingTiers) return 0;
    const tier = product.pricingTiers.find(
      (t) => quantity >= t.minQuantity && quantity <= t.maxQuantity,
    );
    return (
      tier?.pricePerPiece ||
      product.pricingTiers[product.pricingTiers.length - 1]?.pricePerPiece ||
      0
    );
  };

  // Get pricing tiers for display
  const getPricingTiersDisplay = () => {
    if (!product?.pricingTiers) return [];
    return product.pricingTiers.map((tier) => ({
      range: `${tier.minQuantity}-${tier.maxQuantity} pieces`,
      price: tier.pricePerPiece.toLocaleString(),
      discount: tier.discount || 0,
    }));
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + (product?.minimumOrderQuantity || 10));
  };

  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity((prev) =>
      prev > (product?.minimumOrderQuantity || 50)
        ? prev - (product?.minimumOrderQuantity || 10)
        : product?.minimumOrderQuantity || 50,
    );
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[hsl(24,100%,50%)] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-[hsl(24,100%,50%)] text-white px-6 py-2 rounded-lg hover:bg-[hsl(24,100%,40%)] transition-colors"
          >
            Browse Products
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  const pricingTiers = getPricingTiersDisplay();
  const currentPrice = getCurrentPrice();
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-24">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-[hsl(24,100%,90%)] to-[hsl(24,100%,80%)] rounded-xl flex items-center justify-center mb-4 relative group">
                {product.images?.[selectedImage]?.url ? (
                  <img
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    className="h-48 w-48 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
                    📦
                  </span>
                )}
                <button
                  onClick={handleAddToWishlist}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
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
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedImage === idx
                          ? "ring-2 ring-[hsl(24,100%,50%)] scale-105 shadow-md"
                          : "hover:ring-2 hover:ring-gray-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        className="h-12 w-12 object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Product Details */}
          <div className="lg:w-2/3 bg-white rounded-xl p-6 shadow-sm">
            {/* Title & Rating */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.shortDescription}</p>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-semibold">
                  {product.rating?.average?.toFixed(1) || "4.5"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {product.rating?.count || 0} reviews
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
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Discount
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
                        <td className="px-4 py-2 text-sm text-green-600">
                          {tier.discount > 0 ? `${tier.discount}% off` : "-"}
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
                Quantity (MOQ: {product.minimumOrderQuantity} pieces)
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
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <ShoppingCart size={20} />
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRequestQuote}
              className="flex items-center gap-2 px-6 py-3 bg-[hsl(24,100%,95%)] text-[hsl(24,100%,50%)] rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
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
              onClick={handleAddToWishlist}
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Tabs */}
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
                {product.specifications?.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-500 min-w-[120px]">
                      {spec.key}:
                    </span>
                    <span className="text-sm text-gray-900">{spec.value}</span>
                    {spec.unit && (
                      <span className="text-xs text-gray-500">
                        ({spec.unit})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "highlights" && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.highlights?.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {highlight.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "seller details" && product.seller && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[hsl(24,100%,95%)] to-[hsl(24,100%,90%)] p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Store className="w-8 h-8 text-[hsl(24,100%,50%)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {product.seller.businessName || product.seller.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Verified Seller
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">
                          {product.seller.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">
                          {product.seller.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={18} className="text-[hsl(24,100%,50%)]" />
                      Business Address
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {product.seller.address || "Address not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      (window.location.href = `tel:${product.seller.phone}`)
                    }
                    className="flex-1 bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Call Now
                  </button>
                  <button
                    onClick={handleSendInquiry}
                    className="flex-1 border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors flex items-center justify-center gap-2"
                  >
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
                      {product.shippingDetails?.returnPolicy?.period || 7} days
                      return policy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className=" rounded-sm p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct, idx) => (
                <a
                  href={`/products/product/${relatedProduct._id}`}
                  key={idx}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                    {relatedProduct.images?.[0]?.url ? (
                      <img
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.name}
                        className="h-24 w-24 object-contain transform group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                        📦
                      </span>
                    )}
                    {relatedProduct.bulkOrderEligible && (
                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[hsl(24,100%,50%)] transition-colors line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {relatedProduct.shortDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[hsl(24,100%,50%)]">
                      ₹{formatPriceRange(relatedProduct.pricingTiers)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    MOQ: {relatedProduct.minimumOrderQuantity} pcs
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
