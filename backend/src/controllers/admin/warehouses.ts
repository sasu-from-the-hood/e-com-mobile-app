import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { warehouses } from '../../database/schema/index.js';
import { eq } from 'drizzle-orm';
import cuid from 'cuid';

export const getWarehouses = adminProcedure
  .handler(async () => {
    const allWarehouses = await db
      .select()
      .from(warehouses);

    return allWarehouses;
  });

export const getWarehouse = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    const [warehouse] = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, input));

    if (!warehouse) {
      throw new Error('Warehouse not found');
    }

    return warehouse;
  });

export const createWarehouse = adminProcedure
  .input(z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    phone: z.string().optional(),
    isActive: z.boolean().optional()
  }))
  .handler(async ({ input }) => {
    const warehouseData = {
      id: cuid(),
      name: input.name,
      address: input.address,
      latitude: input.latitude.toString(),
      longitude: input.longitude.toString(),
      phone: input.phone || null,
      isActive: input.isActive ?? true
    };

    await db.insert(warehouses).values(warehouseData);

    return warehouseData;
  });

export const updateWarehouse = adminProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional()
  }))
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;

    const updatePayload: any = {};
    if (updateData.name) updatePayload.name = updateData.name;
    if (updateData.address) updatePayload.address = updateData.address;
    if (updateData.latitude) updatePayload.latitude = updateData.latitude.toString();
    if (updateData.longitude) updatePayload.longitude = updateData.longitude.toString();
    if (updateData.phone !== undefined) updatePayload.phone = updateData.phone;
    if (updateData.isActive !== undefined) updatePayload.isActive = updateData.isActive;

    await db
      .update(warehouses)
      .set(updatePayload)
      .where(eq(warehouses.id, id));

    return { success: true };
  });

export const deleteWarehouse = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    await db
      .delete(warehouses)
      .where(eq(warehouses.id, input));

    return { success: true };
  });
