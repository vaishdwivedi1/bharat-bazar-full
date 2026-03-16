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
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // ============ USER ROUTES ============
  USER_CART: `${USER_BASE_PATH}/cart`,
  USER_CHECKOUT: `${USER_BASE_PATH}/checkout`,
  USER_ORDERS: `${USER_BASE_PATH}/orders`,
  USER_ORDER_DETAIL: `${USER_BASE_PATH}/orders/:id`,
  USER_WISHLIST: `${USER_BASE_PATH}/wishlist`,
  USER_PROFILE: `${USER_BASE_PATH}/profile`,

  // ============ SELLER ROUTES ============
  // Dashboard
  SELLER_DASHBOARD: `${SELLER_BASE_PATH}/dashboard`,
  SELLER_ANALYTICS: `${SELLER_BASE_PATH}/analytics`,

  // Products
  SELLER_PRODUCTS: `${SELLER_BASE_PATH}/products`,
  SELLER_PRODUCT_ADD: `${SELLER_BASE_PATH}/products/add`,
  SELLER_PRODUCT_DETAIL: `${SELLER_BASE_PATH}/products/:id`,
  SELLER_PRODUCT_EDIT: `${SELLER_BASE_PATH}/products/edit/:id`,

  // Categories (spelling corrected)
  SELLER_CATEGORIES: `${SELLER_BASE_PATH}/categories`,
  SELLER_CATEGORY_ADD: `${SELLER_BASE_PATH}/categories/add`,
  SELLER_CATEGORY_DETAIL: `${SELLER_BASE_PATH}/categories/:id`,
  SELLER_CATEGORY_EDIT: `${SELLER_BASE_PATH}/categories/edit/:id`,

  // Brands
  SELLER_BRANDS: `${SELLER_BASE_PATH}/brands`,
  SELLER_BRAND_ADD: `${SELLER_BASE_PATH}/brands/add`,
  SELLER_BRAND_DETAIL: `${SELLER_BASE_PATH}/brands/:id`,
  SELLER_BRAND_EDIT: `${SELLER_BASE_PATH}/brands/edit/:id`,

  // Inventory
  SELLER_INVENTORY: `${SELLER_BASE_PATH}/inventory`,
  SELLER_LOW_STOCK: `${SELLER_BASE_PATH}/inventory/low-stock`,
  SELLER_STOCK_ALERTS: `${SELLER_BASE_PATH}/inventory/alerts`,

  // Orders
  SELLER_ORDERS: `${SELLER_BASE_PATH}/orders`,
  SELLER_ORDER_PENDING: `${SELLER_BASE_PATH}/orders/pending`,
  SELLER_ORDER_PROCESSING: `${SELLER_BASE_PATH}/orders/processing`,
  SELLER_ORDER_SHIPPED: `${SELLER_BASE_PATH}/orders/shipped`,
  SELLER_ORDER_DELIVERED: `${SELLER_BASE_PATH}/orders/delivered`,
  SELLER_ORDER_CANCELLED: `${SELLER_BASE_PATH}/orders/cancelled`,
  SELLER_ORDER_DETAIL: `${SELLER_BASE_PATH}/orders/:id`,
  SELLER_RETURNS: `${SELLER_BASE_PATH}/returns`,
  SELLER_RETURN_DETAIL: `${SELLER_BASE_PATH}/returns/:id`,

  // Finance
  SELLER_FINANCE_DASHBOARD: `${SELLER_BASE_PATH}/finance`,
  SELLER_TRANSACTIONS: `${SELLER_BASE_PATH}/transactions`,
  SELLER_PAYOUTS: `${SELLER_BASE_PATH}/payouts`,
  SELLER_WITHDRAW: `${SELLER_BASE_PATH}/withdraw`,
  SELLER_TAX_DOCUMENTS: `${SELLER_BASE_PATH}/tax`,
  SELLER_INVOICES: `${SELLER_BASE_PATH}/invoices`,

  // Marketing
  SELLER_PROMOTIONS: `${SELLER_BASE_PATH}/promotions`,
  SELLER_COUPONS: `${SELLER_BASE_PATH}/coupons`,
  SELLER_COUPON_ADD: `${SELLER_BASE_PATH}/coupons/add`,
  SELLER_COUPON_EDIT: `${SELLER_BASE_PATH}/coupons/edit/:id`,
  SELLER_ADVERTISING: `${SELLER_BASE_PATH}/advertising`,
  SELLER_DISCOUNTS: `${SELLER_BASE_PATH}/discounts`,

  // Customers
  SELLER_CUSTOMERS: `${SELLER_BASE_PATH}/customers`,
  SELLER_CUSTOMER_DETAIL: `${SELLER_BASE_PATH}/customers/:id`,
  SELLER_REVIEWS: `${SELLER_BASE_PATH}/reviews`,
  SELLER_REVIEW_DETAIL: `${SELLER_BASE_PATH}/reviews/:id`,
  SELLER_MESSAGES: `${SELLER_BASE_PATH}/messages`,
  SELLER_CHAT: `${SELLER_BASE_PATH}/chat/:id`,
  SELLER_SUPPORT_TICKETS: `${SELLER_BASE_PATH}/support`,
  SELLER_TICKET_DETAIL: `${SELLER_BASE_PATH}/support/:id`,

  // Reports
  SELLER_REPORTS: `${SELLER_BASE_PATH}/reports`,
  SELLER_SALES_REPORT: `${SELLER_BASE_PATH}/reports/sales`,
  SELLER_PRODUCT_REPORT: `${SELLER_BASE_PATH}/reports/products`,
  SELLER_CUSTOMER_REPORT: `${SELLER_BASE_PATH}/reports/customers`,
  SELLER_FINANCE_REPORT: `${SELLER_BASE_PATH}/reports/finance`,

  // Settings
  SELLER_PROFILE: `${SELLER_BASE_PATH}/profile`,
  SELLER_SETTINGS: `${SELLER_BASE_PATH}/settings`,
  SELLER_STORE_SETTINGS: `${SELLER_BASE_PATH}/store-settings`,
  SELLER_SHIPPING_SETTINGS: `${SELLER_BASE_PATH}/shipping`,
  SELLER_PAYMENT_SETTINGS: `${SELLER_BASE_PATH}/payment`,
  SELLER_TAX_SETTINGS: `${SELLER_BASE_PATH}/tax-settings`,
  SELLER_NOTIFICATION_SETTINGS: `${SELLER_BASE_PATH}/notification-settings`,
  SELLER_TEAM: `${SELLER_BASE_PATH}/team`,
  SELLER_TEAM_ADD: `${SELLER_BASE_PATH}/team/add`,
  SELLER_TEAM_EDIT: `${SELLER_BASE_PATH}/team/edit/:id`,
  SELLER_HELP_CENTER: `${SELLER_BASE_PATH}/help`,
  SELLER_FAQ: `${SELLER_BASE_PATH}/faq`,
};
