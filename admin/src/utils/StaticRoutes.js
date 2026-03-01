export const BASE_PATH = "/admin";

export const ROUTES = {
  // Public Routes
  LOGIN: `${BASE_PATH}/login`,

  // Protected Routes
  DASHBOARD: `${BASE_PATH}/dashboard`,

  // Product Routes
  PRODUCTS: `${BASE_PATH}/products`,
  PRODUCT_ADD: `${BASE_PATH}/products/add`,
  PRODUCT_DETAIL: `${BASE_PATH}/products/:id`,
  PRODUCT_EDIT: `${BASE_PATH}/products/edit/:id`,

  // Category Routes
  CATEGORIES: `${BASE_PATH}/categories`,
  CATEGORY_ADD: `${BASE_PATH}/categories/add`,
  CATEGORY_DETAIL: `${BASE_PATH}/categories/:id`,
  CATEGORY_EDIT: `${BASE_PATH}/categories/edit/:id`,

  // User Routes
  USERS: `${BASE_PATH}/users`,
  USER_ADD: `${BASE_PATH}/users/add`,
  USER_DETAIL: `${BASE_PATH}/users/:id`,
  USER_EDIT: `${BASE_PATH}/users/edit/:id`,

  // Order Routes
  ORDERS: `${BASE_PATH}/orders`,
  ORDER_DETAIL: `${BASE_PATH}/orders/:id`,

  // Profile
  PROFILE: `${BASE_PATH}/profile`,
};
