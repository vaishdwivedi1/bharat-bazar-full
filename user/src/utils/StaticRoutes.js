// Base paths
export const USER_BASE_PATH = "/user";
export const SELLER_BASE_PATH = "/seller";

export const ROUTES = {
  // Public Routes
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",

  // Public Product Routes
  PUBLIC_PRODUCTS: "/products",
  PUBLIC_PRODUCT_DETAIL: "/products/:id",
  PUBLIC_PRODUCTS_BY_CATEGORY: "/products/category/:categoryId",
  PUBLIC_PRODUCT_SEARCH: "/products/search",

  // Auth Routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  UNAUTHORIZED: "/unauthorized",

  // ============ USER ROUTES ============
  USER_DASHBOARD: `${USER_BASE_PATH}/dashboard`,
  USER_CART: `${USER_BASE_PATH}/cart`,
  USER_CHECKOUT: `${USER_BASE_PATH}/checkout`,
  USER_ORDERS: `${USER_BASE_PATH}/orders`,
  USER_ORDER_DETAIL: `${USER_BASE_PATH}/orders/:id`,
  USER_WISHLIST: `${USER_BASE_PATH}/wishlist`,
  USER_PROFILE: `${USER_BASE_PATH}/profile`,

  // ============ SELLER ROUTES ============
  SELLER_DASHBOARD: `${SELLER_BASE_PATH}/dashboard`,
  SELLER_PRODUCTS: `${SELLER_BASE_PATH}/products`,
  SELLER_PRODUCT_ADD: `${SELLER_BASE_PATH}/products/add`,
  SELLER_PRODUCT_DETAIL: `${SELLER_BASE_PATH}/products/:id`,
  SELLER_PRODUCT_EDIT: `${SELLER_BASE_PATH}/products/edit/:id`,
  SELLER_INVENTORY: `${SELLER_BASE_PATH}/inventory`,
  SELLER_ORDERS: `${SELLER_BASE_PATH}/orders`,
  SELLER_ORDER_DETAIL: `${SELLER_BASE_PATH}/orders/:id`,
  SELLER_PROFILE: `${SELLER_BASE_PATH}/profile`,
  SELLER_SETTINGS: `${SELLER_BASE_PATH}/settings`,
};
