import { z } from 'zod';
import { vendorProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { products, orders, orderItems, vendorWarehouses, warehouses } from '../../database/schema/index.js';
import { eq, and, sum, count, desc, like, sql } from 'drizzle-orm';
import cuid from 'cuid';

// ── Stats ────────────────────────────────────────────────────────────────────

export const getVendorStats = vendorProcedure
  .handler(async ({ context }) => {
    const vendorId = (context as any).user.id;

    // Vendor's warehouse IDs
    const vw = await db.select({ warehouseId: vendorWarehouses.warehouseId })
      .from(vendorWarehouses).where(eq(vendorWarehouses.vendorId, vendorId));
    const warehouseIds = vw.map(r => r.warehouseId);

    const [totalProducts] = await db.select({ count: count() }).from(products)
      .where(eq(products.vendorId, vendorId));

    const [pendingApproval] = await db.select({ count: count() }).from(products)
      .where(and(eq(products.vendorId, vendorId), eq(products.isActive, false)));

    // Orders for vendor's warehouses
    let totalOrders = 0;
    let totalRevenue = '0';
    if (warehouseIds.length > 0) {
      const [ordersCount] = await db.select({ count: count() }).from(orders)
        .where(sql`JSON_CONTAINS(${orders.metadata}, JSON_ARRAY(${warehouseIds[0]}), '$.warehouseIds') OR 1=1`);
      totalOrders = ordersCount?.count ?? 0;
    }

    return {
      totalProducts: totalProducts?.count ?? 0,
      pendingApproval: pendingApproval?.count ?? 0,
      totalWarehouses: warehouseIds.length,
      totalOrders,
      totalRevenue,
    };
  });

// ── Products ─────────────────────────────────────────────────────────────────

export const getVendorProducts = vendorProcedure
  .input(z.object({
    search: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(20),
  }))
  .handler(async ({ input, context }) => {
    const vendorId = (context as any).user.id;
    const offset = (input.page - 1) * input.limit;

    const conditions = [eq(products.vendorId, vendorId)];
    if (input.search) {
      conditions.push(like(products.name, `%${input.search}%`));
    }

    const rows = await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(input.limit)
      .offset(offset);

    const [total] = await db.select({ count: count() }).from(products)
      .where(and(...conditions));

    return { products: rows, total: total?.count ?? 0 };
  });

export const createVendorProduct = vendorProcedure
  .input(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.string(),
    originalPrice: z.string().optional(),
    categoryId: z.string().optional(),
    warehouseId: z.string().optional(),
    sku: z.string().optional(),
    stockQuantity: z.number().default(0),
    discount: z.number().default(0),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }))
  .handler(async ({ input, context }) => {
    const vendorId = (context as any).user.id;
    const id = cuid();
    const slug = `${input.name.toLowerCase().replace(/\s+/g, '-')}-${id.slice(-6)}`;

    await db.insert(products).values({
      id,
      slug,
      vendorId,
      name: input.name,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice,
      categoryId: input.categoryId,
      warehouseId: input.warehouseId,
      sku: input.sku,
      stockQuantity: input.stockQuantity,
      discount: input.discount,
      sizes: input.sizes ?? [],
      tags: input.tags ?? [],
      isActive: false, // pending admin approval
      inStock: input.stockQuantity > 0,
    });

    return { id, slug };
  });

export const updateVendorProduct = vendorProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
    originalPrice: z.string().optional(),
    categoryId: z.string().optional(),
    warehouseId: z.string().optional(),
    sku: z.string().optional(),
    stockQuantity: z.number().optional(),
    discount: z.number().optional(),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }))
  .handler(async ({ input, context }) => {
    const vendorId = (context as any).user.id;
    const { id, ...data } = input;

    // Ensure vendor owns this product
    const [existing] = await db.select().from(products)
      .where(and(eq(products.id, id), eq(products.vendorId, vendorId)));
    if (!existing) throw new Error('Product not found');

    const updatePayload: any = { ...data };
    if (data.stockQuantity !== undefined) {
      updatePayload.inStock = data.stockQuantity > 0;
    }
    // Reset approval on edit
    updatePayload.isActive = false;

    await db.update(products).set(updatePayload).where(eq(products.id, id));
    return { success: true };
  });

export const deleteVendorProduct = vendorProcedure
  .input(z.string())
  .handler(async ({ input: id, context }) => {
    const vendorId = (context as any).user.id;
    const [existing] = await db.select().from(products)
      .where(and(eq(products.id, id), eq(products.vendorId, vendorId)));
    if (!existing) throw new Error('Product not found');
    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  });

// ── Warehouses ────────────────────────────────────────────────────────────────

export const getVendorOwnWarehouses = vendorProcedure
  .handler(async ({ context }) => {
    const vendorId = (context as any).user.id;
    
    // Get vendor's assigned warehouse IDs
    const vw = await db.select({ warehouseId: vendorWarehouses.warehouseId })
      .from(vendorWarehouses)
      .where(eq(vendorWarehouses.vendorId, vendorId));
    
    const warehouseIds = vw.map(r => r.warehouseId);
    
    if (warehouseIds.length === 0) {
      return [];
    }
    
    // Get warehouse details for assigned warehouses
    return db.select()
      .from(warehouses)
      .where(sql`${warehouses.id} IN (${sql.join(warehouseIds.map(id => sql`${id}`), sql`, `)})`);
  });

export const getAllWarehousesForVendor = vendorProcedure
  .handler(async () => {
    return db.select().from(warehouses).where(eq(warehouses.isActive, true));
  });

export const updateVendorWarehouse = vendorProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional()
  }))
  .handler(async ({ input }) => {
    console.log('📝 updateVendorWarehouse called with input:', input);
    const { id, ...updateData } = input;

    const updatePayload: any = {};
    if (updateData.name) updatePayload.name = updateData.name;
    if (updateData.address) updatePayload.address = updateData.address;
    if (updateData.phone !== undefined) updatePayload.phone = updateData.phone;
    if (updateData.isActive !== undefined) updatePayload.isActive = updateData.isActive;

    console.log('📦 Update payload:', updatePayload);
    console.log('🆔 Warehouse ID:', id);

    try {
      await db
        .update(warehouses)
        .set(updatePayload)
        .where(eq(warehouses.id, id));

      console.log('✅ Warehouse updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating warehouse:', error);
      throw error;
    }
  });

// ── Orders ────────────────────────────────────────────────────────────────────

export const getVendorOrders = vendorProcedure
  .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }))
  .handler(async ({ input, context }) => {
    const vendorId = (context as any).user.id;

    // Get vendor's warehouse IDs
    const vw = await db.select({ warehouseId: vendorWarehouses.warehouseId })
      .from(vendorWarehouses).where(eq(vendorWarehouses.vendorId, vendorId));
    const warehouseIds = vw.map(r => r.warehouseId);

    if (warehouseIds.length === 0) return { orders: [], total: 0 };

    // Orders that contain products from vendor's warehouses
    const vendorProductIds = await db.select({ id: products.id })
      .from(products)
      .where(eq(products.vendorId, vendorId));
    const productIds = vendorProductIds.map(p => p.id);

    if (productIds.length === 0) return { orders: [], total: 0 };

    const offset = (input.page - 1) * input.limit;

    const rows = await db
      .selectDistinct({ order: orders })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(sql`${orderItems.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`)
      .orderBy(desc(orders.createdAt))
      .limit(input.limit)
      .offset(offset);

    return { orders: rows.map(r => r.order), total: rows.length };
  });
