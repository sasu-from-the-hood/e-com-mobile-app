import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../database/db.js'
import { products } from '../database/schema/products.js'
import { categories } from '../database/schema/categories.js'
import { orders } from '../database/schema/orders.js'
import { user as users } from '../database/schema/auth-schema.js'
import { sql, count, sum, desc, gte } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth.js'

export const getDashboardStats = os
  .handler(async () => {
    try {
      // Get total counts
      const [totalProducts] = await db.select({ count: count() }).from(products)
      const [totalCategories] = await db.select({ count: count() }).from(categories)
      const [totalOrders] = await db.select({ count: count() }).from(orders)
      const [totalUsers] = await db.select({ count: count() }).from(users)

      // Get revenue (sum of order amounts)
      const [revenue] = await db.select({ 
        total: sql<number>`COALESCE(SUM(${orders.total}), 0)` 
      }).from(orders)

      // Get recent orders (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const [recentOrders] = await db.select({ count: count() })
        .from(orders)
        .where(gte(orders.createdAt, thirtyDaysAgo))

      // Get low stock products
      const [lowStockCount] = await db.select({ count: count() })
        .from(products)
        .where(sql`${products.stockQuantity} <= ${products.lowStockThreshold}`)

      // Get top selling products (mock data for now)
      const topProducts = await db.select({
        id: products.id,
        name: products.name,
        price: products.price,
        stockQuantity: products.stockQuantity
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5)

      // Get monthly sales data from orders
      const monthlySales = await db.select({
        month: sql<string>`DATE_FORMAT(${orders.createdAt}, '%b')`,
        sales: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
        orders: sql<number>`COUNT(*)`
      })
      .from(orders)
      .where(gte(orders.createdAt, sql`DATE_SUB(NOW(), INTERVAL 6 MONTH)`))
      .groupBy(sql`YEAR(${orders.createdAt}), MONTH(${orders.createdAt})`)
      .orderBy(sql`YEAR(${orders.createdAt}), MONTH(${orders.createdAt})`)
      .limit(6)


      return {
        stats: {
          totalProducts: totalProducts?.count,
          totalCategories: totalCategories?.count,
          totalOrders: totalOrders?.count,
          totalUsers: totalUsers?.count,
          totalRevenue: revenue?.total || 0,
          recentOrders: recentOrders?.count || 0,
          lowStockProducts: lowStockCount?.count || 0
        },
        topProducts,
        monthlySales
      }
    } catch (error) {
      console.error('Dashboard stats error:', error)
      return {
        stats: {
          totalProducts: 0,
          totalCategories: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          recentOrders: 0,
          lowStockProducts: 0
        },
        topProducts: [],
        monthlySales: []
      }
    }
  })