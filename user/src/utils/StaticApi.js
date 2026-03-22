export const StaticAPI = {
  login: "/auth/v1/login",
  registerSeller: "/auth/seller/v1/registerSeller",
  registerBuyer: "/auth/user/v1/registerBuyer",
  sendOTP: "/auth/v1/send-otp",
  verifyOTP: "/auth/v1/verify-otp",
  forgotPassword: "/auth/v1/forgot-password",
  resetPassword: "/auth/v1/reset-password",

  // categories
  getAllCategories: "/category/v1/getAllCategory",
  getAllActiveCategory: "/category/v1/getAllActiveCategory",
  getCategoryProducts: "/category/v1/getCategoryProducts",
  getSellerCategories: "/category/v1/seller/getSellerCategories",
  addSellerCategory: "/category/v1/seller/add-category",
  editSellerCategory: "/category/v1/seller/edit-category",
  deleteSellerCategory: "/category/v1/seller/delete-category",
  toggleSellerCategoryStatus: "/category/v1/seller/toggleCategoryStatus",

  // products
  getProductsBySeller: "/products/v1/getAllProductsBySeller",
  createProduct: "/products/v1/createProduct",
  editProduct: "/products/v1/editProduct",
  deleteProduct: "/products/v1/deleteProduct",
  changeProductStatus: "/products/v1/changeProductStatus",
};
