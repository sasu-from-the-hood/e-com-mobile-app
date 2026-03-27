import { z } from 'zod';
export declare const getProducts: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<any[], any[]>, Record<never, never>, Record<never, never>>;
export declare const getProduct: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodString, import("@orpc/contract").Schema<any, any>, Record<never, never>, Record<never, never>>;
export declare const getBrowseAllProducts: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    excludeIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<any[], any[]>, Record<never, never>, Record<never, never>>;
export declare const getCategories: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    productCount: number;
}[], {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    productCount: number;
}[]>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=products.d.ts.map