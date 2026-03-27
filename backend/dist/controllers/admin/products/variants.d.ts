import { z } from 'zod';
export declare const getProductVariants: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    images: any;
    dimensions: any;
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    images: any;
    dimensions: any;
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const createProductVariant: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    productId: z.ZodString;
    sku: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    material: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodString>;
    originalPrice: z.ZodOptional<z.ZodString>;
    stockQuantity: z.ZodDefault<z.ZodNumber>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodString>;
    dimensions: z.ZodOptional<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    images: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    dimensions: {
        length: number;
        width: number;
        height: number;
    } | null;
    images: string[] | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    dimensions: {
        length: number;
        width: number;
        height: number;
    } | null;
    images: string[] | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const updateProductVariant: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    data: z.ZodObject<{
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        price: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        originalPrice: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        sku: z.ZodOptional<z.ZodString>;
        stockQuantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        lowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        weight: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        size: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>>;
        material: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        dimensions: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            length: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    dimensions: {
        length: number;
        width: number;
        height: number;
    } | null;
    images: string[] | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    productId: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: string | null;
    originalPrice: string | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    weight: string | null;
    dimensions: {
        length: number;
        width: number;
        height: number;
    } | null;
    images: string[] | null;
    isActive: boolean | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const deleteProductVariant: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const bulkUpdateVariantStock: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    updates: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        stockQuantity: z.ZodNumber;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    results: {
        variantId: string;
        previousStock: number;
        newStock: number;
        difference: number;
    }[];
}, {
    success: boolean;
    results: {
        variantId: string;
        previousStock: number;
        newStock: number;
        difference: number;
    }[];
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=variants.d.ts.map