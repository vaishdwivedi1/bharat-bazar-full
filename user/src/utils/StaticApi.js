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
};
