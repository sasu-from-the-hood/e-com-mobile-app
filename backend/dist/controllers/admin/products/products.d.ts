import { z } from 'zod';
export declare const getAdminProducts: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        all: "all";
    }>>;
    stockStatus: z.ZodDefault<z.ZodEnum<{
        in_stock: "in_stock";
        all: "all";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        name: "name";
        createdAt: "createdAt";
        price: "price";
        stock: "stock";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    products: {
        stats: {
            variantCount: number;
            totalVariantStock: number;
            mediaCount: number;
            alertCount: number;
            stockStatus: string;
        };
        id: string;
        name: string;
        slug: string;
        description: string | null;
        sku: string | null;
        price: string;
        originalPrice: string | null;
        discount: number | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        inStock: boolean | null;
        sizes: string[] | null;
        tags: string[] | null;
        colorImages: Record<string, string[]> | null;
        variantStock: Record<string, number> | null;
        categoryId: string | null;
        categoryName: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        rating: string | null;
        reviewCount: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}, {
    products: {
        stats: {
            variantCount: number;
            totalVariantStock: number;
            mediaCount: number;
            alertCount: number;
            stockStatus: string;
        };
        id: string;
        name: string;
        slug: string;
        description: string | null;
        sku: string | null;
        price: string;
        originalPrice: string | null;
        discount: number | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        inStock: boolean | null;
        sizes: string[] | null;
        tags: string[] | null;
        colorImages: Record<string, string[]> | null;
        variantStock: Record<string, number> | null;
        categoryId: string | null;
        categoryName: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        rating: string | null;
        reviewCount: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>, Record<never, never>, Record<never, never>>;
export declare const createProduct: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodString;
    originalPrice: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    warehouseId: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    stockQuantity: z.ZodDefault<z.ZodNumber>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    discount: z.ZodDefault<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    isDigital: z.ZodDefault<z.ZodBoolean>;
    inStock: z.ZodDefault<z.ZodBoolean>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    variantStock: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    colorImages: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        color: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodString>;
        material: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodString>;
        stockQuantity: z.ZodDefault<z.ZodNumber>;
        sku: z.ZodString;
        images: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>;
    }, z.core.$strip>>>;
    seo: z.ZodOptional<z.ZodObject<{
        metaTitle: z.ZodOptional<z.ZodString>;
        metaDescription: z.ZodOptional<z.ZodString>;
        metaKeywords: z.ZodOptional<z.ZodString>;
        ogTitle: z.ZodOptional<z.ZodString>;
        ogDescription: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    originalPrice: string | null;
    colorImages: Record<string, string[]> | null;
    categoryId: string | null;
    warehouseId: string | null;
    sku: string | null;
    sizes: string[] | null;
    tags: string[] | null;
    variantStock: Record<string, number> | null;
    rating: string | null;
    reviewCount: number | null;
    inStock: boolean | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    discount: number | null;
    weight: string | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    isDigital: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    originalPrice: string | null;
    colorImages: Record<string, string[]> | null;
    categoryId: string | null;
    warehouseId: string | null;
    sku: string | null;
    sizes: string[] | null;
    tags: string[] | null;
    variantStock: Record<string, number> | null;
    rating: string | null;
    reviewCount: number | null;
    inStock: boolean | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    discount: number | null;
    weight: string | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    isDigital: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}>, Record<never, never>, Record<never, never>>;
export declare const updateProduct: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        price: z.ZodOptional<z.ZodString>;
        originalPrice: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        warehouseId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        sku: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        stockQuantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        lowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        discount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        weight: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        isDigital: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        inStock: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        sizes: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        variantStock: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        reviewCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        colorImages: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>>>;
        variants: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            color: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodString>;
            material: z.ZodOptional<z.ZodString>;
            price: z.ZodOptional<z.ZodString>;
            stockQuantity: z.ZodDefault<z.ZodNumber>;
            sku: z.ZodString;
            images: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<import("buffer").File, import("buffer").File>]>>>;
        }, z.core.$strip>>>>;
        seo: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            metaTitle: z.ZodOptional<z.ZodString>;
            metaDescription: z.ZodOptional<z.ZodString>;
            metaKeywords: z.ZodOptional<z.ZodString>;
            ogTitle: z.ZodOptional<z.ZodString>;
            ogDescription: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        attributes: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, z.core.$strip>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    originalPrice: string | null;
    colorImages: Record<string, string[]> | null;
    categoryId: string | null;
    warehouseId: string | null;
    sku: string | null;
    sizes: string[] | null;
    tags: string[] | null;
    variantStock: Record<string, number> | null;
    rating: string | null;
    reviewCount: number | null;
    inStock: boolean | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    discount: number | null;
    weight: string | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    isDigital: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    originalPrice: string | null;
    colorImages: Record<string, string[]> | null;
    categoryId: string | null;
    warehouseId: string | null;
    sku: string | null;
    sizes: string[] | null;
    tags: string[] | null;
    variantStock: Record<string, number> | null;
    rating: string | null;
    reviewCount: number | null;
    inStock: boolean | null;
    stockQuantity: number | null;
    lowStockThreshold: number | null;
    discount: number | null;
    weight: string | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    isDigital: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}>, Record<never, never>, Record<never, never>>;
export declare const deleteProduct: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
export declare const getProductAnalytics: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    productId: z.ZodOptional<z.ZodString>;
    period: z.ZodDefault<z.ZodEnum<{
        "7d": "7d";
        "30d": "30d";
        "90d": "90d";
        "1y": "1y";
    }>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    transactions: {
        date: string;
        type: string;
        quantity: number;
        count: number;
    }[];
    alerts: {
        alertType: string;
        count: number;
    }[];
    period: "7d" | "30d" | "90d" | "1y";
}, {
    transactions: {
        date: string;
        type: string;
        quantity: number;
        count: number;
    }[];
    alerts: {
        alertType: string;
        count: number;
    }[];
    period: "7d" | "30d" | "90d" | "1y";
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=products.d.ts.map