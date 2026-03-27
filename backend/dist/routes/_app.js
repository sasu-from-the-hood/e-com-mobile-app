import { os } from '@orpc/server';
import * as products from '../controllers/shop/products.js';
import * as cart from '../controllers/shop/cart.js';
import * as search from '../controllers/shop/search.js';
import * as checkout from '../controllers/shop/checkout.js';
import * as orders from '../controllers/orders/orders.js';
import * as tracking from '../controllers/orders/tracking.js';
import * as notifications from '../controllers/notifications.js';
import * as favorites from '../controllers/profile/favorites.js';
import * as addresses from '../controllers/profile/addresses.js';
import * as reviews from '../controllers/user/reviews.js';
import * as recommendations from '../controllers/user/recommendations.js';
import * as banners from '../controllers/shop/banners.js';
import * as newArrivals from '../controllers/shop/new-arrivals.js';
import * as adminProducts from '../controllers/admin/admin-products.js';
import * as adminCategories from '../controllers/admin/admin-catagores.js';
import * as adminWarehouses from '../controllers/admin/warehouses.js';
import * as adminDeliveryBoys from '../controllers/admin/delivery-boys.js';
import * as adminOrders from '../controllers/admin/orders.js';
import * as adminConsole from '../controllers/admin/console.js';
import * as dashboard from '../controllers/admin/dashboard.js';
import * as helpArticles from '../controllers/admin/help-articles.js';
import * as appSettings from '../controllers/admin/app-settings.js';
import * as appAuthLogin from '../controllers/app-auth/login.js';
import * as appAuthRegister from '../controllers/app-auth/register.js';
import * as appAuthSession from '../controllers/app-auth/session.js';
import * as appAuthForgotPassword from '../controllers/app-auth/forgot-password.js';
import * as appAuthDeleteAccount from '../controllers/app-auth/delete-account.js';
import * as appAuthResendOTP from '../controllers/app-auth/resend-otp.js';
import * as appAuthProfile from '../controllers/app-auth/profile.js';
import * as appAuthOrders from '../controllers/app-auth/orders.js';
import * as appAuthNotifications from '../controllers/app-auth/notifications.js';
import { handshake } from '../utils/handshake.js';
export const router = os.router({
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
    getBrowseAllProducts: products.getBrowseAllProducts,
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
    cancelOrder: orders.cancelOrder,
    updateOrderStatus: orders.updateOrderStatus,
    updateOrderDeliveryBoy: orders.updateDeliveryBoy,
    getOrderWarehouse: orders.getOrderWarehouse,
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
    // Admin Products - Enhanced
    getAdminProducts: adminProducts.getAdminProducts,
    createProduct: adminProducts.createProduct,
    updateProduct: adminProducts.updateProduct,
    deleteProduct: adminProducts.deleteProduct,
    getProductAnalytics: adminProducts.getProductAnalytics,
    // Product Variants
    getProductVariants: adminProducts.getProductVariants,
    createProductVariant: adminProducts.createProductVariant,
    updateProductVariant: adminProducts.updateProductVariant,
    deleteProductVariant: adminProducts.deleteProductVariant,
    bulkUpdateVariantStock: adminProducts.bulkUpdateVariantStock,
    // Inventory Management
    getInventoryTransactions: adminProducts.getInventoryTransactions,
    createInventoryAdjustment: adminProducts.createInventoryAdjustment,
    getStockAlerts: adminProducts.getStockAlerts,
    resolveStockAlert: adminProducts.resolveStockAlert,
    generateStockReport: adminProducts.generateStockReport,
    // Admin Categories
    adminGetCategories: adminCategories.getCategories,
    adminCreateCategory: adminCategories.createCategory,
    adminUpdateCategory: adminCategories.updateCategory,
    adminDeleteCategory: adminCategories.deleteCategory,
    // Admin Warehouses
    getWarehouses: adminWarehouses.getWarehouses,
    getWarehouse: adminWarehouses.getWarehouse,
    createWarehouse: adminWarehouses.createWarehouse,
    updateWarehouse: adminWarehouses.updateWarehouse,
    deleteWarehouse: adminWarehouses.deleteWarehouse,
    // Admin Delivery Boys
    getDeliveryBoys: adminDeliveryBoys.getDeliveryBoys,
    getDeliveryBoy: adminDeliveryBoys.getDeliveryBoy,
    createDeliveryBoy: adminDeliveryBoys.createDeliveryBoy,
    updateDeliveryBoy: adminDeliveryBoys.updateDeliveryBoy,
    deleteDeliveryBoy: adminDeliveryBoys.deleteDeliveryBoy,
    getDeliveryBoyStats: adminDeliveryBoys.getDeliveryBoyStats,
    assignDeliveryBoy: adminDeliveryBoys.assignDeliveryBoy,
    // Admin Orders
    getAdminOrders: adminOrders.getAdminOrders,
    getAdminOrder: adminOrders.getAdminOrder,
    adminAssignDeliveryBoy: adminOrders.adminAssignDeliveryBoy,
    adminUpdateOrderStatus: adminOrders.adminUpdateOrderStatus,
    // Admin Console (Logs)
    getLogFiles: adminConsole.getLogFiles,
    getLogContent: adminConsole.getLogContent,
    getErrorFiles: adminConsole.getErrorFiles,
    getErrorContent: adminConsole.getErrorContent,
    // Dashboard
    getDashboardStats: dashboard.getDashboardStats,
    // Help Articles
    getHelpArticles: helpArticles.getHelpArticles,
    getHelpArticle: helpArticles.getHelpArticle,
    adminGetHelpArticles: helpArticles.adminGetHelpArticles,
    createHelpArticle: helpArticles.createHelpArticle,
    updateHelpArticle: helpArticles.updateHelpArticle,
    deleteHelpArticle: helpArticles.deleteHelpArticle,
    // App Settings
    getAppSettings: appSettings.getAppSettings,
    adminGetAppSettings: appSettings.adminGetAppSettings,
    updateAppSetting: appSettings.updateAppSetting,
    bulkUpdateAppSettings: appSettings.bulkUpdateAppSettings,
    deleteAppSetting: appSettings.deleteAppSetting,
    // App Auth (Custom JWT-based auth for mobile app)
    appLogin: appAuthLogin.login,
    appSendRegisterOTP: appAuthRegister.sendRegisterOTP,
    appVerifyRegisterOTP: appAuthRegister.verifyRegisterOTP,
    appGetSession: appAuthSession.getSession,
    appRefreshToken: appAuthSession.refreshToken,
    appLogout: appAuthSession.logout,
    appSendResetPasswordOTP: appAuthForgotPassword.sendResetPasswordOTP,
    appVerifyResetPasswordOTP: appAuthForgotPassword.verifyResetPasswordOTP,
    appResetPassword: appAuthForgotPassword.resetPassword,
    appDeleteAccount: appAuthDeleteAccount.deleteAccount,
    appResendRegisterOTP: appAuthResendOTP.resendRegisterOTP,
    appResendResetPasswordOTP: appAuthResendOTP.resendResetPasswordOTP,
    appUpdateProfile: appAuthProfile.updateProfile,
    appGetProfile: appAuthProfile.getProfile,
    appUploadAvatar: appAuthProfile.uploadAvatar,
    // App Orders (JWT-protected for mobile app)
    appGetOrders: appAuthOrders.getOrders,
    appGetOrder: appAuthOrders.getOrder,
    appCreateOrder: appAuthOrders.createOrder,
    // App Notifications (JWT-protected for mobile app)
    appGetNotifications: appAuthNotifications.getNotifications,
    appGetUnreadCount: appAuthNotifications.getUnreadCount,
    appMarkAsRead: appAuthNotifications.markAsRead,
    appMarkAllAsRead: appAuthNotifications.markAllAsRead,
    //  handshake
    handshake,
});
//# sourceMappingURL=_app.js.map