import { z } from 'zod';
export declare const getBanners: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodString;
    imageUrl: z.ZodString;
    imageAlt: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
    discount: z.ZodOptional<z.ZodNumber>;
    productId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=banners.d.ts.map