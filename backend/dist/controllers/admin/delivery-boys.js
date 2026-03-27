import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { deliveryBoys, warehouses, orders } from '../../database/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';
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
    return allDeliveryBoys;
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
    warehouseId: z.string().optional(),
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    notes: z.string().optional(),
}))
    .handler(async ({ input }) => {
    const defaultPassword = "deliverboy123";
    const passwordToHash = input.password || defaultPassword;
    const hashedPassword = await hashPassword(passwordToHash);
    const deliveryBoyData = {
        id: cuid(),
        name: input.name,
        phone: input.phone,
        password: hashedPassword,
        email: input.email || null,
        photo: input.photo || null,
        vehicleType: input.vehicleType || null,
        vehiclePlateNumber: input.vehiclePlateNumber || null,
        warehouseId: input.warehouseId || null,
        isActive: input.isActive ?? true,
        isAvailable: input.isAvailable ?? true,
        notes: input.notes || null,
        totalDeliveries: 0,
        currentAssignedOrders: 0,
        rating: "0",
    };
    await db.insert(deliveryBoys).values(deliveryBoyData);
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
    warehouseId: z.string().optional(),
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    notes: z.string().optional(),
}))
    .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const updatePayload = {};
    if (updateData.name)
        updatePayload.name = updateData.name;
    if (updateData.phone)
        updatePayload.phone = updateData.phone;
    if (updateData.password) {
        updatePayload.password = await hashPassword(updateData.password);
    }
    if (updateData.email !== undefined)
        updatePayload.email = updateData.email || null;
    if (updateData.photo !== undefined)
        updatePayload.photo = updateData.photo || null;
    if (updateData.vehicleType !== undefined)
        updatePayload.vehicleType = updateData.vehicleType || null;
    if (updateData.vehiclePlateNumber !== undefined)
        updatePayload.vehiclePlateNumber = updateData.vehiclePlateNumber || null;
    if (updateData.warehouseId !== undefined)
        updatePayload.warehouseId = updateData.warehouseId || null;
    if (updateData.isActive !== undefined)
        updatePayload.isActive = updateData.isActive;
    if (updateData.isAvailable !== undefined)
        updatePayload.isAvailable = updateData.isAvailable;
    if (updateData.notes !== undefined)
        updatePayload.notes = updateData.notes || null;
    await db
        .update(deliveryBoys)
        .set(updatePayload)
        .where(eq(deliveryBoys.id, id));
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
    const [stats] = await db
        .select({
        total: sql `COUNT(*)`,
        active: sql `SUM(CASE WHEN ${deliveryBoys.isActive} = 1 THEN 1 ELSE 0 END)`,
        available: sql `SUM(CASE WHEN ${deliveryBoys.isAvailable} = 1 THEN 1 ELSE 0 END)`,
        onDelivery: sql `SUM(CASE WHEN ${deliveryBoys.currentAssignedOrders} > 0 THEN 1 ELSE 0 END)`,
    })
        .from(deliveryBoys);
    return stats;
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
    await db.execute(sql `
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
//# sourceMappingURL=delivery-boys.js.map