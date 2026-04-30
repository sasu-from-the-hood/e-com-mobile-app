import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { deliveryBoys, deliveryBoyWarehouses, warehouses, orders } from '../../database/schema/index.js';
import { eq, desc, sql, inArray } from 'drizzle-orm';
import cuid from 'cuid';
import { hashPassword } from '../../utils/password.js';

export const getDeliveryBoys = adminProcedure
  .handler(async () => {
    const allDeliveryBoys = await db
      .select({
        id: deliveryBoys.id,
        name: deliveryBoys.name,
        phone: deliveryBoys.phone,
        email: deliveryBoys.email,
        photo: deliveryBoys.photo,
        vehicleType: deliveryBoys.vehicleType,
        vehiclePlateNumber: deliveryBoys.vehiclePlateNumber,
        warehouseId: deliveryBoys.warehouseId,
        warehouseName: warehouses.name,
        isActive: deliveryBoys.isActive,
        isAvailable: deliveryBoys.isAvailable,
        totalDeliveries: deliveryBoys.totalDeliveries,
        currentAssignedOrders: deliveryBoys.currentAssignedOrders,
        rating: deliveryBoys.rating,
        notes: deliveryBoys.notes,
        createdAt: deliveryBoys.createdAt,
      })
      .from(deliveryBoys)
      .leftJoin(warehouses, eq(deliveryBoys.warehouseId, warehouses.id))
      .orderBy(desc(deliveryBoys.createdAt));

    // Get assigned warehouses for each delivery boy (if table exists)
    const deliveryBoyIds = allDeliveryBoys.map(db => db.id);
    
    let warehouseAssignments: any[] = [];
    if (deliveryBoyIds.length > 0) {
      try {
        warehouseAssignments = await db
          .select({
            deliveryBoyId: deliveryBoyWarehouses.deliveryBoyId,
            warehouseId: deliveryBoyWarehouses.warehouseId,
            warehouseName: warehouses.name,
          })
          .from(deliveryBoyWarehouses)
          .leftJoin(warehouses, eq(deliveryBoyWarehouses.warehouseId, warehouses.id))
          .where(inArray(deliveryBoyWarehouses.deliveryBoyId, deliveryBoyIds));
      } catch (error) {
        // Table might not exist yet if migration hasn't been run
        console.log('delivery_boy_warehouses table not found, skipping warehouse assignments');
      }
    }

    // Attach warehouse arrays to each delivery boy
    return allDeliveryBoys.map(boy => ({
      ...boy,
      assignedWarehouses: warehouseAssignments
        .filter(wa => wa.deliveryBoyId === boy.id)
        .map(wa => ({
          id: wa.warehouseId,
          name: wa.warehouseName,
        })),
    }));
  });

export const getDeliveryBoy = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    const [deliveryBoy] = await db
      .select()
      .from(deliveryBoys)
      .where(eq(deliveryBoys.id, input));

    if (!deliveryBoy) {
      throw new Error('Delivery boy not found');
    }

    return deliveryBoy;
  });

export const createDeliveryBoy = adminProcedure
  .input(z.object({
    name: z.string(),
    phone: z.string(),
    password: z.string().optional(), // Optional, defaults to "deliverboy123"
    email: z.string().optional(),
    photo: z.string().optional(),
    vehicleType: z.string().optional(),
    vehiclePlateNumber: z.string().optional(),
    warehouseId: z.string().optional(), // Keep for backward compatibility
    warehouseIds: z.array(z.string()).optional(), // New: multiple warehouses
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    notes: z.string().optional(),
  }))
  .handler(async ({ input }) => {
    console.log('📝 Creating delivery boy with input:', input);
    console.log('📦 Warehouse IDs to assign:', input.warehouseIds);
    
    const defaultPassword = "deliverboy123";
    const passwordToHash = input.password || defaultPassword;
    const hashedPassword = await hashPassword(passwordToHash);

    const deliveryBoyId = cuid();
    const deliveryBoyData = {
      id: deliveryBoyId,
      name: input.name,
      phone: input.phone,
      password: hashedPassword,
      email: input.email || null,
      photo: input.photo || null,
      vehicleType: input.vehicleType || null,
      vehiclePlateNumber: input.vehiclePlateNumber || null,
      warehouseId: input.warehouseId || null, // Keep for backward compatibility
      isActive: input.isActive ?? true,
      isAvailable: input.isAvailable ?? true,
      notes: input.notes || null,
      totalDeliveries: 0,
      currentAssignedOrders: 0,
      rating: "0",
    };

    await db.insert(deliveryBoys).values(deliveryBoyData);

    // Insert warehouse assignments if provided
    if (input.warehouseIds && input.warehouseIds.length > 0) {
      try {
        const warehouseAssignments = input.warehouseIds.map(warehouseId => ({
          deliveryBoyId,
          warehouseId,
        }));
        console.log('💾 Inserting warehouse assignments:', warehouseAssignments);
        await db.insert(deliveryBoyWarehouses).values(warehouseAssignments);
        console.log('✅ Warehouse assignments inserted successfully');
      } catch (error) {
        console.log('❌ Failed to insert warehouse assignments:', error);
        console.log('Table might not exist yet - run migration');
      }
    }

    return deliveryBoyData;
  });

export const updateDeliveryBoy = adminProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
    email: z.string().optional(),
    photo: z.string().optional(),
    vehicleType: z.string().optional(),
    vehiclePlateNumber: z.string().optional(),
    warehouseId: z.string().optional(), // Keep for backward compatibility
    warehouseIds: z.array(z.string()).optional(), // New: multiple warehouses
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    notes: z.string().optional(),
  }))
  .handler(async ({ input }) => {
    console.log('📝 Updating delivery boy:', input.id);
    console.log('📦 New warehouse IDs:', input.warehouseIds);
    
    const { id, warehouseIds, ...updateData } = input;

    const updatePayload: any = {};
    if (updateData.name) updatePayload.name = updateData.name;
    if (updateData.phone) updatePayload.phone = updateData.phone;
    if (updateData.password) {
      updatePayload.password = await hashPassword(updateData.password);
    }
    if (updateData.email !== undefined) updatePayload.email = updateData.email || null;
    if (updateData.photo !== undefined) updatePayload.photo = updateData.photo || null;
    if (updateData.vehicleType !== undefined) updatePayload.vehicleType = updateData.vehicleType || null;
    if (updateData.vehiclePlateNumber !== undefined) updatePayload.vehiclePlateNumber = updateData.vehiclePlateNumber || null;
    if (updateData.warehouseId !== undefined) updatePayload.warehouseId = updateData.warehouseId || null;
    if (updateData.isActive !== undefined) updatePayload.isActive = updateData.isActive;
    if (updateData.isAvailable !== undefined) updatePayload.isAvailable = updateData.isAvailable;
    if (updateData.notes !== undefined) updatePayload.notes = updateData.notes || null;

    await db
      .update(deliveryBoys)
      .set(updatePayload)
      .where(eq(deliveryBoys.id, id));

    // Update warehouse assignments if provided
    if (warehouseIds !== undefined) {
      try {
        console.log('🗑️ Deleting old warehouse assignments for delivery boy:', id);
        // Delete existing assignments
        await db
          .delete(deliveryBoyWarehouses)
          .where(eq(deliveryBoyWarehouses.deliveryBoyId, id));

        // Insert new assignments
        if (warehouseIds.length > 0) {
          const warehouseAssignments = warehouseIds.map(warehouseId => ({
            deliveryBoyId: id,
            warehouseId,
          }));
          console.log('💾 Inserting new warehouse assignments:', warehouseAssignments);
          await db.insert(deliveryBoyWarehouses).values(warehouseAssignments);
          console.log('✅ Warehouse assignments updated successfully');
        } else {
          console.log('ℹ️ No warehouses to assign');
        }
      } catch (error) {
        console.log('❌ Failed to update warehouse assignments:', error);
        console.log('Table might not exist yet - run migration');
      }
    }

    return { success: true };
  });

export const deleteDeliveryBoy = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    await db
      .delete(deliveryBoys)
      .where(eq(deliveryBoys.id, input));

    return { success: true };
  });

export const getDeliveryBoyStats = adminProcedure
  .handler(async () => {
    try {
      const [stats] = await db
        .select({
          total: sql<number>`CAST(COUNT(*) AS UNSIGNED)`,
          active: sql<number>`CAST(SUM(CASE WHEN ${deliveryBoys.isActive} = true THEN 1 ELSE 0 END) AS UNSIGNED)`,
          available: sql<number>`CAST(SUM(CASE WHEN ${deliveryBoys.isAvailable} = true THEN 1 ELSE 0 END) AS UNSIGNED)`,
          onDelivery: sql<number>`CAST(SUM(CASE WHEN ${deliveryBoys.currentAssignedOrders} > 0 THEN 1 ELSE 0 END) AS UNSIGNED)`,
        })
        .from(deliveryBoys);

      return {
        total: Number(stats?.total || 0),
        active: Number(stats?.active || 0),
        available: Number(stats?.available || 0),
        onDelivery: Number(stats?.onDelivery || 0),
      };
    } catch (error) {
      console.error('Error fetching delivery boy stats:', error);
      // Return default stats if query fails
      return {
        total: 0,
        active: 0,
        available: 0,
        onDelivery: 0,
      };
    }
  });

export const assignDeliveryBoy = adminProcedure
  .input(z.object({
    orderId: z.string(),
    deliveryBoyId: z.string(),
  }))
  .handler(async ({ input }) => {
    // Update order with delivery boy
    await db
      .update(orders)
      .set({ deliveryBoyId: input.deliveryBoyId })
      .where(eq(orders.id, input.orderId));

    // Update delivery boy's current assigned orders count
    await db.execute(sql`
      UPDATE ${deliveryBoys}
      SET ${deliveryBoys.currentAssignedOrders} = (
        SELECT COUNT(*) FROM ${orders}
        WHERE ${orders.deliveryBoyId} = ${input.deliveryBoyId}
        AND ${orders.status} NOT IN ('delivered', 'cancelled')
      )
      WHERE ${deliveryBoys.id} = ${input.deliveryBoyId}
    `);

    return { success: true };
  });
