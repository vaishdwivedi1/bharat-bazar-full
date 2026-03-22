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
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineCube,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  DELETEMethod,
  GETMethod,
  POSTMethod,
  PUTMethod,
} from "../../utils/service";
import { StaticAPI } from "../../utils/StaticApi";

const SellerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    icon: "📦",
    isFeatured: false,
    isActive: true,
    subcategories: [],
    parentCategory: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

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
      let url = `${StaticAPI.getSellerCategories}?page=${pageNum}&limit=10`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await GETMethod(url);
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

  // Fetch all categories for parent selection
  const fetchAllCategoriesForParent = async () => {
    try {
      const response = await GETMethod(
        `${StaticAPI.getSellerCategories}?limit=1000`,
      );
      return response.categories || [];
    } catch (error) {
      console.error("Error fetching parent categories:", error);
      return [];
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  // Validate circular reference
  const validateParentCategory = (categoryId, parentId, categoriesList) => {
    if (!parentId) return true;

    let currentParent = categoriesList.find((c) => c._id === parentId);
    while (currentParent) {
      if (currentParent._id === categoryId) {
        return false;
      }
      currentParent = categoriesList.find(
        (c) => c._id === currentParent.parentCategory,
      );
    }
    return true;
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

  // Handle parent category change with validation
  const handleParentCategoryChange = (e) => {
    const parentId = e.target.value;

    if (editingCategory && parentId) {
      const isValid = validateParentCategory(
        editingCategory._id,
        parentId,
        categories,
      );
      if (!isValid) {
        toast.error("Cannot set a subcategory as parent (circular reference)");
        return;
      }
    }

    setFormData({
      ...formData,
      parentCategory: parentId,
    });
  };

  // Handle icon input click
  const handleIconClick = () => {
    if (iconInputRef.current) {
      iconInputRef.current.focus();
    }
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

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
  const handleAddNew = async () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      slug: "",
      icon: "📦",
      isFeatured: false,
      isActive: true,
      subcategories: [],
      parentCategory: "",
    });
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const parents = await fetchAllCategoriesForParent();
    setParentCategories(parents);
    setShowModal(true);

    setTimeout(() => {
      if (iconInputRef.current) {
        iconInputRef.current.focus();
      }
    }, 100);
  };

  // Handle row click to open details modal
  const handleRowClick = (category, e) => {
    // Prevent opening modal if clicking on action buttons
    if (e.target.closest("button")) {
      return;
    }
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  // Handle edit from details modal
  const handleEditFromDetails = () => {
    setShowDetailsModal(false);
    handleEdit(selectedCategory);
  };

  // Handle delete from details modal
  const handleDeleteFromDetails = () => {
    setShowDetailsModal(false);
    handleDeleteClick(selectedCategory);
  };

  // Open modal for editing category
  const handleEdit = async (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      icon: category.icon || "📦",
      isFeatured: category.isFeatured || false,
      isActive: category.isActive !== false,
      subcategories: category.subcategories || [],
      parentCategory:
        category.parentCategory?._id || category.parentCategory || "",
    });

    if (category.image && category.image !== "") {
      setImagePreview(category.image);
    } else {
      setImagePreview("");
    }
    setImageFile(null);

    const allParents = await fetchAllCategoriesForParent();
    const filteredParents = allParents.filter((parent) => {
      if (parent._id === category._id) return false;

      let isChild = false;
      const checkIfChild = (catId) => {
        const child = categories.find((c) => c.parentCategory === catId);
        if (child) {
          if (child._id === category._id) {
            isChild = true;
            return true;
          }
          return checkIfChild(child._id);
        }
        return false;
      };
      checkIfChild(parent._id);

      return !isChild;
    });

    setParentCategories(filteredParents);
    setShowModal(true);

    setTimeout(() => {
      if (iconInputRef.current) {
        iconInputRef.current.focus();
      }
    }, 100);
  };

  // Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setActionLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("icon", formData.icon);
      formDataToSend.append("isFeatured", formData.isFeatured);
      formDataToSend.append("isActive", formData.isActive);

      if (formData.subcategories && formData.subcategories.length > 0) {
        formDataToSend.append(
          "subcategories",
          JSON.stringify(formData.subcategories),
        );
      } else {
        formDataToSend.append("subcategories", "[]");
      }

      if (formData.parentCategory && formData.parentCategory !== "") {
        formDataToSend.append("parentCategory", formData.parentCategory);
      }

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingCategory) {
        const url = `${StaticAPI.editSellerCategory}/${editingCategory._id}`;
        await PUTMethod(url, formDataToSend, config);
        toast.success("Category updated successfully");
      } else {
        const url = StaticAPI.addSellerCategory;
        await POSTMethod(url, formDataToSend, config);
        toast.success("Category created successfully");
      }

      setShowModal(false);
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPage(1);
      setCategories([]);
      fetchCategories(1, true);
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save category";

      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("already exists")
      ) {
        toast.error("A category with this name already exists");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category) => {
    const hasChildren = categories.some((c) => {
      const catParent = c.parentCategory?._id || c.parentCategory;
      return catParent === category._id;
    });

    if (hasChildren) {
      toast.error("Please delete or reassign subcategories first");
      return;
    }
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Handle delete category
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setActionLoading(true);
    try {
      const url = `${StaticAPI.deleteSellerCategory}/${categoryToDelete._id}`;
      await DELETEMethod(url);

      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
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

  // Handle toggle category status
  const handleToggleStatus = async (category) => {
    try {
      const response = await axios.put(
        `${StaticAPI.toggleSellerCategoryStatus}/${category._id}`,
        { isActive: !category.isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          `Category ${!category.isActive ? "activated" : "deactivated"} successfully`,
        );
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id ? { ...c, isActive: !category.isActive } : c,
          ),
        );
        if (selectedCategory && selectedCategory._id === category._id) {
          setSelectedCategory({
            ...selectedCategory,
            isActive: !category.isActive,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Failed to update category status");
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (categoryId, e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedRows(newExpanded);
  };

  // Build category tree
  const buildCategoryTree = (categoriesList, parentId = null) => {
    return categoriesList
      .filter((cat) => {
        const catParent = cat.parentCategory?._id || cat.parentCategory;
        return catParent === parentId;
      })
      .map((cat) => ({
        ...cat,
        children: buildCategoryTree(categoriesList, cat._id),
      }));
  };

  // Filter categories based on search term
  const filterCategories = (categoriesList, search) => {
    if (!search) return categoriesList;

    const lowerSearch = search.toLowerCase();
    const filtered = [];

    for (const cat of categoriesList) {
      const matches =
        cat.name?.toLowerCase().includes(lowerSearch) ||
        cat.description?.toLowerCase().includes(lowerSearch);

      if (matches) {
        filtered.push(cat);
      } else if (cat.children && cat.children.length > 0) {
        const matchingChildren = filterCategories(cat.children, search);
        if (matchingChildren.length > 0) {
          filtered.push({
            ...cat,
            children: matchingChildren,
          });
        }
      }
    }

    return filtered;
  };

  // Render category rows recursively
  const renderCategoryRows = (categoriesList, depth = 0) => {
    return categoriesList.map((category, index) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedRows.has(category._id);

      return (
        <React.Fragment key={category._id}>
          <tr
            className="hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={(e) => handleRowClick(category, e)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {hasChildren && (
                  <button
                    onClick={(e) => toggleRowExpansion(category._id, e)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    type="button"
                  >
                    {isExpanded ? (
                      <HiOutlineChevronDown className="w-4 h-4" />
                    ) : (
                      <HiOutlineChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                {!hasChildren && <div className="w-4" />}
                <div className="text-2xl">{category.icon || "📦"}</div>
                {category.image && category.image !== "" && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <div style={{ marginLeft: `${depth * 20}px` }}>
                <div className="text-sm font-medium text-gray-900">
                  {depth > 0 && "↳ "}
                  {category.name}
                </div>
                {category.description && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {category.description}
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{category.slug}</div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(category);
                }}
                className="text-blue-600 hover:text-blue-900 mr-3"
                title="Edit"
                type="button"
              >
                <HiOutlinePencil className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(category);
                }}
                className="text-red-600 hover:text-red-900"
                title="Delete"
                type="button"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </td>
          </tr>
          {hasChildren &&
            isExpanded &&
            renderCategoryRows(category.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  // Build category tree
  const categoryTree = buildCategoryTree(categories);
  const filteredCategories = filterCategories(categoryTree, searchTerm);

  // Initial load and page changes
  useEffect(() => {
    fetchCategories(page, page === 1);
  }, [page]);

  // Reset pagination when searching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        setCategories([]);
        fetchCategories(1, true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
          type="button"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Categories Table */}
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
                  renderCategoryRows(filteredCategories)
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

            {loadingMore && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!hasMore && categories.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No more categories to load
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCategory && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <HiOutlineDocumentText className="w-5 h-5" />
                Category Details
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
              {/* Category Header */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <div className="text-6xl mb-2">
                    {selectedCategory.icon || "📦"}
                  </div>
                  {selectedCategory.image && selectedCategory.image !== "" && (
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory.name}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedCategory.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedCategory.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedCategory.isFeatured
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedCategory.isFeatured ? "Featured" : "Regular"}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {selectedCategory.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Category Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineTag className="w-4 h-4" />
                    <span className="text-sm font-medium">Slug</span>
                  </div>
                  <p className="text-gray-900 font-mono text-sm">
                    {selectedCategory.slug}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineCube className="w-4 h-4" />
                    <span className="text-sm font-medium">Products Count</span>
                  </div>
                  <p className="text-gray-900 text-2xl font-semibold">
                    {selectedCategory.productsCount || "0"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineUsers className="w-4 h-4" />
                    <span className="text-sm font-medium">Parent Category</span>
                  </div>
                  <p className="text-gray-900">
                    {selectedCategory.parentCategory?.name ||
                      selectedCategory.parentCategory ||
                      "None (Top Level)"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <HiOutlineTag className="w-4 h-4" />
                    <span className="text-sm font-medium">Level</span>
                  </div>
                  <p className="text-gray-900">{selectedCategory.level || 0}</p>
                </div>
              </div>

              {/* Subcategories Section */}
              {selectedCategory.subcategories &&
                selectedCategory.subcategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <HiOutlineTag className="w-5 h-5" />
                      Subcategories / Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Metadata */}
              <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                <p>
                  Created:{" "}
                  {new Date(selectedCategory.createdAt).toLocaleString()}
                </p>
                <p>
                  Last Updated:{" "}
                  {new Date(selectedCategory.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleToggleStatus(selectedCategory)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  type="button"
                >
                  {selectedCategory.isActive ? (
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
                  onClick={handleEditFromDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  type="button"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                  Edit Category
                </button>
                <button
                  onClick={handleDeleteFromDetails}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  type="button"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategory ? "Edit Category" : "Create New Category"}
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

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleParentCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None (Top Level Category)</option>
                    {parentCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a parent category to create a subcategory hierarchy
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

                    {imagePreview && (
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
                  </div>
                </div>

                {/* Subcategories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategories (Tags)
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
                  <p className="text-xs text-gray-500 mt-1">
                    Add tags or subcategory names to help organize products
                  </p>
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
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
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

export default SellerCategories;
