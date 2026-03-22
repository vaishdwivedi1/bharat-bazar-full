import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineCurrencyRupee,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiOutlinePhotograph,
  HiOutlinePlusCircle,
  HiOutlineMinusCircle,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  DELETEMethod,
  GETMethod,
  POSTMethod,
  POSTWithFiles,
  PUTMethod,
} from "../../utils/service";
import { StaticAPI } from "../../utils/StaticApi";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    slug: "",
    minimumOrderQuantity: 1,
    totalStock: 0,
    category: "",
    subCategory: "",
    isFeatured: false,
    isActive: true,
    bulkOrderEligible: true,
    gstIncluded: true,
    gstRate: 18,
    pricingTiers: [
      {
        minQuantity: 1,
        maxQuantity: 10,
        pricePerPiece: 0,
        discount: 0,
      },
    ],
    images: [],
    specifications: [],
    highlights: [],
    warrantyInfo: {
      duration: "",
      type: "none",
      details: "",
      terms: "",
    },
    shippingDetails: {
      shippingMethods: [
        {
          methodName: "standard",
          cost: 0,
          estimatedDays: { min: 3, max: 7 },
          isActive: true,
        },
      ],
      returnPolicy: {
        eligible: true,
        period: 7,
        conditions: "",
        shippingPaidBy: "seller",
      },
    },
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newSpec, setNewSpec] = useState({
    key: "",
    value: "",
    unit: "",
    group: "General",
    isHighlighted: false,
  });
  const [newHighlight, setNewHighlight] = useState({
    text: "",
    icon: "",
    order: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Refs
  const fileInputRef = useRef(null);
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  // Fetch products with pagination
  const fetchProducts = async (pageNum = 1, isNewSearch = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let url = `${StaticAPI.getProductsBySeller}?page=${pageNum}&limit=10`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await GETMethod(url);
      const newProducts = response.products || [];

      setProducts((prev) =>
        isNewSearch || pageNum === 1 ? newProducts : [...prev, ...newProducts],
      );

      setHasMore(newProducts.length === 10);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await GETMethod(
        `${StaticAPI.getSellerCategories}?limit=1000`,
      );
      return response.categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")
      .substring(0, 100);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });
    } else if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        subCategory: "", // Reset subcategory when main category changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle pricing tier changes
  const handlePricingTierChange = (index, field, value) => {
    const newTiers = [...formData.pricingTiers];
    newTiers[index][field] = parseFloat(value) || 0;

    // Auto-calculate discount if pricePerPiece is set
    if (field === "pricePerPiece" && newTiers[index].discount === 0) {
      // You can add discount calculation logic here
    }

    setFormData({ ...formData, pricingTiers: newTiers });
  };

  // Add pricing tier
  const addPricingTier = () => {
    const lastTier = formData.pricingTiers[formData.pricingTiers.length - 1];
    const newMinQuantity = lastTier.maxQuantity + 1;
    setFormData({
      ...formData,
      pricingTiers: [
        ...formData.pricingTiers,
        {
          minQuantity: newMinQuantity,
          maxQuantity: newMinQuantity + 10,
          pricePerPiece: 0,
          discount: 0,
        },
      ],
    });
  };

  // Remove pricing tier
  const removePricingTier = (index) => {
    if (formData.pricingTiers.length === 1) {
      toast.error("At least one pricing tier is required");
      return;
    }
    const newTiers = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData({ ...formData, pricingTiers: newTiers });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select image files");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFiles((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add specification
  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specifications: [
          ...formData.specifications,
          { ...newSpec, order: formData.specifications.length },
        ],
      });
      setNewSpec({
        key: "",
        value: "",
        unit: "",
        group: "General",
        isHighlighted: false,
      });
    }
  };

  // Remove specification
  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  // Add highlight
  const addHighlight = () => {
    if (newHighlight.text) {
      setFormData({
        ...formData,
        highlights: [
          ...formData.highlights,
          { ...newHighlight, order: formData.highlights.length },
        ],
      });
      setNewHighlight({ text: "", icon: "", order: 0 });
    }
  };

  // Remove highlight
  const removeHighlight = (index) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  // Handle shipping method change
  const handleShippingMethodChange = (index, field, value) => {
    const newMethods = [...formData.shippingDetails.shippingMethods];
    newMethods[index][field] = value;
    setFormData({
      ...formData,
      shippingDetails: {
        ...formData.shippingDetails,
        shippingMethods: newMethods,
      },
    });
  };

  // Add shipping method
  const addShippingMethod = () => {
    setFormData({
      ...formData,
      shippingDetails: {
        ...formData.shippingDetails,
        shippingMethods: [
          ...formData.shippingDetails.shippingMethods,
          {
            methodName: "standard",
            cost: 0,
            estimatedDays: { min: 3, max: 7 },
            isActive: true,
          },
        ],
      },
    });
  };

  // Remove shipping method
  const removeShippingMethod = (index) => {
    if (formData.shippingDetails.shippingMethods.length === 1) {
      toast.error("At least one shipping method is required");
      return;
    }
    const newMethods = formData.shippingDetails.shippingMethods.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      shippingDetails: {
        ...formData.shippingDetails,
        shippingMethods: newMethods,
      },
    });
  };

  // Open modal for creating new product
  const handleAddNew = async () => {
    setEditingProduct(null);
    const categoriesList = await fetchCategories();
    setCategories(categoriesList);

    setFormData({
      name: "",
      shortDescription: "",
      longDescription: "",
      slug: "",
      minimumOrderQuantity: 1,
      totalStock: 0,
      category: "",
      subCategory: "",
      isFeatured: false,
      isActive: true,
      bulkOrderEligible: true,
      gstIncluded: true,
      gstRate: 18,
      pricingTiers: [
        {
          minQuantity: 1,
          maxQuantity: 10,
          pricePerPiece: 0,
          discount: 0,
        },
      ],
      images: [],
      specifications: [],
      highlights: [],
      warrantyInfo: {
        duration: "",
        type: "none",
        details: "",
        terms: "",
      },
      shippingDetails: {
        shippingMethods: [
          {
            methodName: "standard",
            cost: 0,
            estimatedDays: { min: 3, max: 7 },
            isActive: true,
          },
        ],
        returnPolicy: {
          eligible: true,
          period: 7,
          conditions: "",
          shippingPaidBy: "seller",
        },
      },
    });
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  // Open modal for editing product
  const handleEdit = async (product) => {
    setEditingProduct(product);
    const categoriesList = await fetchCategories();
    setCategories(categoriesList);

    setFormData({
      name: product.name || "",
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      slug: product.slug || "",
      minimumOrderQuantity: product.minimumOrderQuantity || 1,
      totalStock: product.totalStock || 0,
      category: product.category?._id || product.category || "",
      subCategory: product.subCategory?._id || product.subCategory || "",
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
      bulkOrderEligible: product.bulkOrderEligible !== false,
      gstIncluded: product.gstIncluded !== false,
      gstRate: product.gstRate || 18,
      pricingTiers: product.pricingTiers || [
        {
          minQuantity: 1,
          maxQuantity: 10,
          pricePerPiece: 0,
          discount: 0,
        },
      ],
      images: product.images || [],
      specifications: product.specifications || [],
      highlights: product.highlights || [],
      warrantyInfo: product.warrantyInfo || {
        duration: "",
        type: "none",
        details: "",
        terms: "",
      },
      shippingDetails: product.shippingDetails || {
        shippingMethods: [
          {
            methodName: "standard",
            cost: 0,
            estimatedDays: { min: 3, max: 7 },
            isActive: true,
          },
        ],
        returnPolicy: {
          eligible: true,
          period: 7,
          conditions: "",
          shippingPaidBy: "seller",
        },
      },
    });

    // Set existing images
    if (product.images && product.images.length > 0) {
      setImagePreviews(product.images.map((img) => img.url));
    } else {
      setImagePreviews([]);
    }
    setImageFiles([]);
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      console.log("Validation failed: Product name missing");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      console.log("Validation failed: Category missing");
      return;
    }

    if (formData.pricingTiers.some((tier) => tier.pricePerPiece <= 0)) {
      toast.error("Please set valid prices for all pricing tiers");
      console.log("Validation failed: Invalid pricing tiers");
      return;
    }

    if (imagePreviews.length === 0 && imageFiles.length === 0) {
      toast.error("At least one product image is required");
      console.log("Validation failed: No images");
      return;
    }

    setActionLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("longDescription", formData.longDescription);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append(
        "minimumOrderQuantity",
        String(formData.minimumOrderQuantity),
      );
      formDataToSend.append("totalStock", String(formData.totalStock));
      formDataToSend.append("category", formData.category);

      formDataToSend.append("isFeatured", String(formData.isFeatured));
      formDataToSend.append("isActive", String(formData.isActive));
      formDataToSend.append(
        "bulkOrderEligible",
        String(formData.bulkOrderEligible),
      );
      formDataToSend.append("gstIncluded", String(formData.gstIncluded));
      formDataToSend.append("gstRate", String(formData.gstRate));

      // Pricing tiers - ensure it's a valid JSON string
      const pricingTiersJson = JSON.stringify(formData.pricingTiers);
      formDataToSend.append("pricingTiers", pricingTiersJson);

      // Specifications
      const specificationsJson = JSON.stringify(formData.specifications);
      formDataToSend.append("specifications", specificationsJson);

      // Highlights
      const highlightsJson = JSON.stringify(formData.highlights);
      formDataToSend.append("highlights", highlightsJson);

      // Warranty info
      const warrantyInfoJson = JSON.stringify(formData.warrantyInfo);
      formDataToSend.append("warrantyInfo", warrantyInfoJson);

      // Shipping details
      const shippingDetailsJson = JSON.stringify(formData.shippingDetails);
      formDataToSend.append("shippingDetails", shippingDetailsJson);

      // Images - handle both new and existing
      if (imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formDataToSend.append("images", file);
        });
      } else if (imagePreviews.length > 0 && editingProduct) {
        // For editing, send existing images as JSON
        const existingImages = formData.images.map((img) => ({ url: img.url }));
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      } else if (imagePreviews.length === 0 && !editingProduct) {
        toast.error("Please upload product images");
        setActionLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let url;
      let response;

      if (editingProduct) {
        url = `${StaticAPI.editProduct}/${editingProduct._id}`;
        response = await PUTMethod(url, formDataToSend, config);
        toast.success("Product updated successfully");
      } else {
        url = StaticAPI.createProduct;

        response = await POSTMethod(url, formDataToSend, config);
        toast.success("Product created successfully");
      }

      setShowModal(false);
      setImageFiles([]);
      setImagePreviews([]);
      setPage(1);
      setProducts([]);
      await fetchProducts(1, true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save product";

      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("already exists")
      ) {
        toast.error("A product with this name already exists");
      } else if (errorMessage.includes("validation")) {
        toast.error(`Validation error: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle row click
  const handleRowClick = (product, e) => {
    if (e.target.closest("button")) {
      return;
    }
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // Handle delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setActionLoading(true);
    try {
      const url = `${StaticAPI.deleteProduct}/${productToDelete._id}`;
      await DELETEMethod(url);

      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setProductToDelete(null);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      if (selectedProduct && selectedProduct._id === productToDelete._id) {
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.isActive ? "inactive" : "active";

      const response = await POSTMethod(`${StaticAPI.changeProductStatus}`, {
        productId: product._id,
        status: newStatus,
        reason: newStatus === "inactive" ? "Seller deactivated product" : "",
      });

      if (response.data.success) {
        toast.success(
          `Product ${!product.isActive ? "activated" : "deactivated"} successfully`,
        );
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id ? { ...p, isActive: !product.isActive } : p,
          ),
        );
        if (selectedProduct && selectedProduct._id === product._id) {
          setSelectedProduct({
            ...selectedProduct,
            isActive: !product.isActive,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update product status",
      );
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(page, page === 1);
  }, [page]);

  // Reset pagination when searching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        setProducts([]);
        fetchProducts(1, true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Get subcategories based on selected category
  const getSubCategories = () => {
    const selectedCat = categories.find((c) => c._id === formData.category);
    return selectedCat?.subcategories || [];
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          type="button"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product, index) => {
                    const minPrice =
                      product.pricingTiers?.[0]?.pricePerPiece || 0;
                    const maxPrice =
                      product.pricingTiers?.[product.pricingTiers.length - 1]
                        ?.pricePerPiece || 0;

                    return (
                      <tr
                        key={product._id}
                        ref={
                          products.length === index + 1 ? lastProductRef : null
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => handleRowClick(product, e)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.shortDescription}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{minPrice.toLocaleString()} - ₹
                            {maxPrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">per piece</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${product.totalStock > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {product.totalStock || 0} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.category?.name || product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-900">
                              {product.rating?.average?.toFixed(1) || "0"}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.rating?.count || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(product);
                            }}
                            className="text-gray-600 hover:text-gray-900 mr-3"
                            title={product.isActive ? "Deactivate" : "Activate"}
                            type="button"
                          >
                            {product.isActive ? (
                              <HiOutlineEyeOff className="w-5 h-5" />
                            ) : (
                              <HiOutlineEye className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Edit"
                            type="button"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </button>
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(product);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            type="button"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button> */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {loadingMore && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No more products to load
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Premium Leather Wallet"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        placeholder="auto-generated"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      required
                      maxLength="500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Brief product description (max 500 characters)"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Description *
                    </label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>

                {/* Category & Stock */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Category & Stock
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Quantity *
                      </label>
                      <input
                        type="number"
                        name="minimumOrderQuantity"
                        value={formData.minimumOrderQuantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Stock *
                      </label>
                      <input
                        type="number"
                        name="totalStock"
                        value={formData.totalStock}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Pricing Tiers
                    </h3>
                    <button
                      type="button"
                      onClick={addPricingTier}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <HiOutlinePlusCircle className="w-5 h-5" />
                      Add Tier
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.pricingTiers.map((tier, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 gap-3 items-end bg-gray-100 p-3 rounded-lg"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Min Quantity
                          </label>
                          <input
                            type="number"
                            value={tier.minQuantity}
                            onChange={(e) =>
                              handlePricingTierChange(
                                index,
                                "minQuantity",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Max Quantity
                          </label>
                          <input
                            type="number"
                            value={tier.maxQuantity}
                            onChange={(e) =>
                              handlePricingTierChange(
                                index,
                                "maxQuantity",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Price per Piece (₹)
                          </label>
                          <input
                            type="number"
                            value={tier.pricePerPiece}
                            onChange={(e) =>
                              handlePricingTierChange(
                                index,
                                "pricePerPiece",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            value={tier.discount}
                            onChange={(e) =>
                              handlePricingTierChange(
                                index,
                                "discount",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removePricingTier(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <HiOutlineMinusCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Product Images
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2"
                    >
                      <HiOutlineUpload className="w-5 h-5" />
                      <span>Upload Images</span>
                    </label>
                    <span className="text-sm text-gray-500">
                      Max 10 images, up to 5MB each
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <HiOutlineX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Key"
                      value={newSpec.key}
                      onChange={(e) =>
                        setNewSpec({ ...newSpec, key: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newSpec.value}
                      onChange={(e) =>
                        setNewSpec({ ...newSpec, value: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., mm, kg)"
                      value={newSpec.unit}
                      onChange={(e) =>
                        setNewSpec({ ...newSpec, unit: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                      >
                        <span className="font-medium w-1/4">{spec.key}:</span>
                        <span className="flex-1">{spec.value}</span>
                        {spec.unit && (
                          <span className="text-gray-500">{spec.unit}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="text-red-600"
                        >
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Product Highlights
                  </h3>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Highlight text"
                      value={newHighlight.text}
                      onChange={(e) =>
                        setNewHighlight({
                          ...newHighlight,
                          text: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Icon (optional)"
                      value={newHighlight.icon}
                      onChange={(e) =>
                        setNewHighlight({
                          ...newHighlight,
                          icon: e.target.value,
                        })
                      }
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                      >
                        {highlight.icon && <span>{highlight.icon}</span>}
                        <span className="flex-1">{highlight.text}</span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="text-red-600"
                        >
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Shipping Details
                    </h3>
                    <button
                      type="button"
                      onClick={addShippingMethod}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <HiOutlinePlusCircle className="w-5 h-5" />
                      Add Shipping Method
                    </button>
                  </div>

                  {formData.shippingDetails.shippingMethods.map(
                    (method, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-3 mb-3 bg-gray-100 p-3 rounded-lg"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Method Name
                          </label>
                          <select
                            value={method.methodName}
                            onChange={(e) =>
                              handleShippingMethodChange(
                                index,
                                "methodName",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                            <option value="freight">Freight</option>
                            <option value="local_pickup">Local Pickup</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Cost (₹)
                          </label>
                          <input
                            type="number"
                            value={method.cost}
                            onChange={(e) =>
                              handleShippingMethodChange(
                                index,
                                "cost",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Est. Days (min-max)
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={method.estimatedDays?.min || 3}
                              onChange={(e) =>
                                handleShippingMethodChange(
                                  index,
                                  "estimatedDays",
                                  {
                                    ...method.estimatedDays,
                                    min: parseInt(e.target.value),
                                  },
                                )
                              }
                              className="w-1/2 px-2 py-1 border border-gray-300 rounded"
                              placeholder="Min"
                            />
                            <input
                              type="number"
                              value={method.estimatedDays?.max || 7}
                              onChange={(e) =>
                                handleShippingMethodChange(
                                  index,
                                  "estimatedDays",
                                  {
                                    ...method.estimatedDays,
                                    max: parseInt(e.target.value),
                                  },
                                )
                              }
                              className="w-1/2 px-2 py-1 border border-gray-300 rounded"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                        <div className="flex items-end gap-2">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={method.isActive}
                              onChange={(e) =>
                                handleShippingMethodChange(
                                  index,
                                  "isActive",
                                  e.target.checked,
                                )
                              }
                            />
                            <span className="text-xs">Active</span>
                          </label>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeShippingMethod(index)}
                              className="text-red-600"
                            >
                              <HiOutlineMinusCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">
                      Return Policy
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.shippingDetails.returnPolicy.eligible
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingDetails: {
                                ...formData.shippingDetails,
                                returnPolicy: {
                                  ...formData.shippingDetails.returnPolicy,
                                  eligible: e.target.checked,
                                },
                              },
                            })
                          }
                        />
                        <span className="text-sm">Eligible for returns</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Return period (days)"
                        value={formData.shippingDetails.returnPolicy.period}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingDetails: {
                              ...formData.shippingDetails,
                              returnPolicy: {
                                ...formData.shippingDetails.returnPolicy,
                                period: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Status & Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Status & Options
                  </h3>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="bulkOrderEligible"
                        checked={formData.bulkOrderEligible}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Bulk Orders Eligible
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="gstIncluded"
                        checked={formData.gstIncluded}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        GST Included
                      </span>
                    </label>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%)
                    </label>
                    <input
                      type="number"
                      name="gstRate"
                      value={formData.gstRate}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-gray-100 py-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5" />
                Product Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Product Header */}
              <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  {selectedProduct.images && selectedProduct.images[0] && (
                    <img
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedProduct.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedProduct.isActive ? "Active" : "Inactive"}
                    </span>
                    {selectedProduct.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {selectedProduct.shortDescription}
                  </p>
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineCurrencyRupee className="w-4 h-4" />
                    <span className="text-sm font-medium">Price Range</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    ₹
                    {Math.min(
                      ...selectedProduct.pricingTiers.map(
                        (t) => t.pricePerPiece,
                      ),
                    ).toLocaleString()}{" "}
                    - ₹
                    {Math.max(
                      ...selectedProduct.pricingTiers.map(
                        (t) => t.pricePerPiece,
                      ),
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineCube className="w-4 h-4" />
                    <span className="text-sm font-medium">Stock</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {selectedProduct.totalStock} units
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">Min Order</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {selectedProduct.minimumOrderQuantity} units
                  </p>
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Pricing Tiers
                </h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Min Qty
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Max Qty
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Price/Piece
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedProduct.pricingTiers.map((tier, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">
                          {tier.minQuantity}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {tier.maxQuantity}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          ₹{tier.pricePerPiece.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm">{tier.discount}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Specifications */}
              {selectedProduct.specifications &&
                selectedProduct.specifications.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.specifications.map((spec, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">{spec.key}:</span>{" "}
                          {spec.value}
                          {spec.unit && (
                            <span className="text-gray-500 ml-1">
                              ({spec.unit})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Highlights */}
              {selectedProduct.highlights &&
                selectedProduct.highlights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Highlights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {highlight.icon && `${highlight.icon} `}
                          {highlight.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleToggleStatus(selectedProduct)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  type="button"
                >
                  {selectedProduct.isActive ? (
                    <>
                      <HiOutlineEyeOff className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <HiOutlineEye className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedProduct);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  type="button"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleDeleteClick(selectedProduct);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  type="button"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                type="button"
              >
                {actionLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
