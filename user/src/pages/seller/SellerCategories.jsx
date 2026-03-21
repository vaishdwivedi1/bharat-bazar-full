import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineX,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  DELETEMethod,
  GETMethod,
  POSTMethod,
  PUTMethod,
} from "../../utils/service";
import { StaticAPI } from "../../utils/StaticApi";
import { Delete } from "lucide-react";

const SellerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    icon: "📦",
    isFeatured: false,
    isActive: true,
    subcategories: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const iconInputRef = useRef(null);

  // Observer for infinite scroll
  const observer = useRef();
  const lastCategoryRef = useCallback(
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

  // Fetch categories with pagination
  const fetchCategories = async (pageNum = 1, isNewSearch = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await GETMethod(
        `${StaticAPI.getSellerCategories}?page=${pageNum}&limit=10&search=${searchTerm}`,
      );

      const newCategories = response.categories || [];

      setCategories((prev) =>
        isNewSearch || pageNum === 1
          ? newCategories
          : [...prev, ...newCategories],
      );

      setHasMore(newCategories.length === 10);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
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
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle icon input click to open emoji keyboard
  const handleIconClick = () => {
    // Focus on the input
    if (iconInputRef.current) {
      iconInputRef.current.focus();
    }
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle subcategory addition
  const handleAddSubcategory = () => {
    if (subcategoryInput.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, subcategoryInput.trim()],
      });
      setSubcategoryInput("");
    }
  };

  // Handle subcategory removal
  const handleRemoveSubcategory = (index) => {
    const newSubcategories = formData.subcategories.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      subcategories: newSubcategories,
    });
  };

  // Open modal for creating new category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      slug: "",
      icon: "📦",
      isFeatured: false,
      isActive: true,
      subcategories: [],
    });
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowModal(true);

    // Small timeout to ensure modal is rendered before focusing
    setTimeout(() => {
      if (iconInputRef.current) {
        iconInputRef.current.focus();
      }
    }, 100);
  };

  // Open modal for editing category
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      icon: category.icon || "📦",
      isFeatured: category.isFeatured || false,
      isActive: category.isActive !== false,
      subcategories: category.subcategories || [],
    });
    // Set image preview if category has image
    if (category.image) {
      setImagePreview(category.image);
    } else {
      setImagePreview("");
    }
    setImageFile(null); // Reset file selection
    setShowModal(true);

    // Small timeout to ensure modal is rendered before focusing
    setTimeout(() => {
      if (iconInputRef.current) {
        iconInputRef.current.focus();
      }
    }, 100);
  };

  // Handle form submit (create/update) with file upload - UPDATED API ENDPOINT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Updated URL for create - using /add-category as per Postman request
      const url = editingCategory
        ? `${StaticAPI.editCategory}/${editingCategory._id}`
        : StaticAPI.addCategory;

      const method = editingCategory ? "put" : "post";

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("icon", formData.icon);

      // Format subcategories as per Postman example: [test1,test2,test3]
      // If subcategories array exists, format it as a string
      if (formData.subcategories && formData.subcategories.length > 0) {
        // Format as [item1,item2,item3] without quotes
        const subcategoriesString = `[${formData.subcategories.join(",")}]`;
        formDataToSend.append("subcategories", subcategoriesString);
      } else {
        formDataToSend.append("subcategories", "[]");
      }

      // Append image file if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingCategory) {
        await PUTMethod({
          url,
          formDataToSend,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await POSTMethod({
          url,
          formDataToSend,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully",
      );
      setShowModal(false);
      // Reset image states
      setImageFile(null);
      setImagePreview("");
      // Refresh the list
      setPage(1);
      setCategories([]);
      fetchCategories(1, true);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Handle delete category
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setActionLoading(true);
    try {
      const response = await DELETEMethod(
        `${StaticAPI.deleteCategory}/${categoryToDelete._id}`,
      );

      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      // Remove from list without refetch
      setCategories((prev) =>
        prev.filter((c) => c._id !== categoryToDelete._id),
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle toggle category status (active/inactive)
  const handleToggleStatus = async (category) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/category/v1/seller/toggleCategoryStatus/${category._id}`,
        { isActive: !category.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          `Category ${!category.isActive ? "activated" : "deactivated"} successfully`,
        );
        // Update in list without refetch
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id ? { ...c, isActive: !category.isActive } : c,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Failed to update category status");
    }
  };

  // Filter categories based on search (client-side filtering)
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Initial load and page changes
  useEffect(() => {
    fetchCategories(page, page === 1);
  }, [page]);

  // Reset pagination when searching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      setCategories([]);
      fetchCategories(1, true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
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
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Categories Table with Infinite Scroll */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icon/Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => {
                      // Add ref to the last element for infinite scroll
                      if (filteredCategories.length === index + 1) {
                        return (
                          <tr
                            ref={lastCategoryRef}
                            key={category._id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="text-2xl">
                                  {category.icon || "📦"}
                                </div>
                                {category.image && (
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {category.description}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {category.slug}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {category.productsCount || "0"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {category.subcategories?.length || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  category.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  category.isFeatured
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {category.isFeatured ? "Featured" : "Regular"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleToggleStatus(category)}
                                className="text-gray-600 hover:text-gray-900 mr-3"
                                title={
                                  category.isActive ? "Deactivate" : "Activate"
                                }
                              >
                                {category.isActive ? (
                                  <HiOutlineEyeOff className="w-5 h-5" />
                                ) : (
                                  <HiOutlineEye className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEdit(category)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Edit"
                              >
                                <HiOutlinePencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(category)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <HiOutlineTrash className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={category._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="text-2xl">
                                  {category.icon || "📦"}
                                </div>
                                {category.image && (
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {category.description}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {category.slug}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {category.productsCount || "0"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {category.subcategories?.length || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  category.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  category.isFeatured
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {category.isFeatured ? "Featured" : "Regular"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(category)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Edit"
                              >
                                <HiOutlinePencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(category)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <HiOutlineTrash className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* End of list message */}
              {!hasMore && categories.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No more categories to load
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal with File Upload and Auto-focus on Icon */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    placeholder="auto-generated"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from name
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Category description..."
                  />
                </div>

                {/* Icon and Image Upload */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      name="icon"
                      ref={iconInputRef}
                      value={formData.icon}
                      onChange={handleInputChange}
                      onClick={handleIconClick}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="📦"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        id="category-image"
                      />
                      <label
                        htmlFor="category-image"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                        <HiOutlineUpload className="w-5 h-5" />
                        <span>Choose Image</span>
                      </label>
                      {(imagePreview || imageFile) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <HiOutlineX className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || imageFile) && (
                      <div className="mt-2 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        {imageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            {imageFile.name} (
                            {(imageFile.size / 1024).toFixed(2)} KB)
                          </p>
                        )}
                      </div>
                    )}

                    {/* Show existing image when editing */}
                    {editingCategory && !imageFile && imagePreview && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Current Image:
                        </p>
                        <img
                          src={imagePreview}
                          alt="Current"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategories
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={subcategoryInput}
                      onChange={(e) => setSubcategoryInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Smartphones"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubcategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.subcategories.map((sub, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Toggles */}
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
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-3">
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
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Category
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{categoryToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
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

export default SellerCategories;
