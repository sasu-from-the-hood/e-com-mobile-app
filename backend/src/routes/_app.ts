import { os } from '@orpc/server'
import * as upload from './upload.js'
const { uploadAvatar } = upload
import * as products from '../controllers/shop/products.js'
import * as cart from '../controllers/shop/cart.js'
import * as search from '../controllers/shop/search.js'
import * as checkout from '../controllers/shop/checkout.js'
import * as orders from '../controllers/orders/orders.js'
import * as tracking from '../controllers/orders/tracking.js'
import * as notifications from '../controllers/notifications.js'
import * as favorites from '../controllers/profile/favorites.js'
import * as addresses from '../controllers/profile/addresses.js'
import * as reviews from '../controllers/reviews.js'
import * as recommendations from '../controllers/recommendations.js'
import * as banners from '../controllers/shop/banners.js'
import * as newArrivals from '../controllers/shop/new-arrivals.js'
import * as adminProducts from '../controllers/admin-products.js'
import * as adminCategories from '../controllers/admin-catagores.js'
import * as dashboard from '../controllers/dashboard.js'
import { handshake } from '../utils/handshake.js'

export const router = os.router({
  uploadAvatar,
  
  // Shop
  getProducts: products.getProducts,
  getProduct: products.getProduct,
  getCategories: products.getCategories,
  searchProducts: search.searchProducts,
  trackSearchClick: search.trackSearchClick,
  getPopularSearches: search.getPopularSearches,
  getUserSearchHistory: search.getUserSearchHistory,
  clearSearchHistory: search.clearSearchHistory,
  getRecommendations: recommendations.getRecommendations,
  trackInteraction: recommendations.trackInteraction,
  getBanners: banners.getBanners,
  getNewArrivals: newArrivals.getNewArrivals,
  
  // Cart
  getCart: cart.getCart,
  addToCart: cart.addToCart,
  updateCart: cart.updateCart,
  removeFromCart: cart.removeFromCart,
  clearCart: cart.clearCart,
  toggleCartItemSelection: cart.toggleCartItemSelection,
  getCartTotal: cart.getCartTotal,
  
  // Checkout
  getPaymentMethods: checkout.getPaymentMethods,
  addPaymentMethod: checkout.addPaymentMethod,
  processPayment: checkout.processPayment,
  
  // Orders
  getOrders: orders.getOrders,
  getOrder: orders.getOrder,
  createOrder: orders.createOrder,
  updateOrderStatus: orders.updateOrderStatus,
  
  // Tracking
  getOrderTracking: tracking.getOrderTracking,
  updateTracking: tracking.updateTracking,
  getTrackingTimeline: tracking.getTrackingTimeline,
  
  // Notifications
  getNotifications: notifications.getNotifications,
  markAsRead: notifications.markAsRead,
  markAllAsRead: notifications.markAllAsRead,
  sendNotification: notifications.sendNotification,
  
  // Profile
  getFavorites: favorites.getFavorites,
  addToFavorites: favorites.addToFavorites,
  removeFromFavorites: favorites.removeFromFavorites,
  
  getAddresses: addresses.getAddresses,
  addAddress: addresses.addAddress,
  updateAddress: addresses.updateAddress,
  deleteAddress: addresses.deleteAddress,
  
  // Reviews
  getProductReviews: reviews.getProductReviews,
  addReview: reviews.addReview,
  updateReview: reviews.updateReview,
  deleteReview: reviews.deleteReview,

  // Admin Products
  getAdminProducts: adminProducts.getAdminProducts,
  createProduct: adminProducts.createProduct,
  updateProduct: adminProducts.updateProduct,
  deleteProduct: adminProducts.deleteProduct,

  // Admin Categories
  adminGetCategories: adminCategories.getCategories,
  adminCreateCategory: adminCategories.createCategory,
  adminUpdateCategory: adminCategories.updateCategory,
  adminDeleteCategory: adminCategories.deleteCategory,

  // Dashboard
  getDashboardStats: dashboard.getDashboardStats,

  //  handshake
  handshake,
})

export type AppRouter = typeof router