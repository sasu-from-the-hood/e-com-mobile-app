import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { vendorWarehouses } from '../../database/schema/index.js';
import { warehouses } from '../../database/schema/index.js';
import { eq } from 'drizzle-orm';

// Get warehouses linked to a vendor
export const getVendorWarehouses = adminProcedure
  .input(z.string())
  .handler(async ({ input: vendorId }) => {
    const rows = await db
      .select({ warehouse: warehouses })
      .from(vendorWarehouses)
      .innerJoin(warehouses, eq(vendorWarehouses.warehouseId, warehouses.id))
      .where(eq(vendorWarehouses.vendorId, vendorId));

    return rows.map((r) => r.warehouse);
  });

// Set (replace) all warehouses for a vendor
export const setVendorWarehouses = adminProcedure
  .input(z.object({
    vendorId: z.string(),
    warehouseIds: z.array(z.string()),
  }))
  .handler(async ({ input }) => {
    const { vendorId, warehouseIds } = input;

    await db
      .delete(vendorWarehouses)
      .where(eq(vendorWarehouses.vendorId, vendorId));

    if (warehouseIds.length > 0) {
      await db.insert(vendorWarehouses).values(
        warehouseIds.map((warehouseId) => ({ vendorId, warehouseId }))
      );
    }

    return { success: true };
  });
