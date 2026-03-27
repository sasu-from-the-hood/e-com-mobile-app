import { z } from 'zod';
export declare const getInventoryTransactions: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    variantId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        purchase: "purchase";
        transfer: "transfer";
        adjustment: "adjustment";
        sale: "sale";
        return: "return";
        damage: "damage";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    transactions: {
        id: string;
        productId: string;
        productName: string | null;
        variantId: string | null;
        type: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        unitCost: string | null;
        totalCost: string | null;
        referenceType: string | null;
        referenceId: string | null;
        reason: string | null;
        notes: string | null;
        batchNumber: string | null;
        expiryDate: Date | null;
        performedBy: string | null;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}, {
    transactions: {
        id: string;
        productId: string;
        productName: string | null;
        variantId: string | null;
        type: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        unitCost: string | null;
        totalCost: string | null;
        referenceType: string | null;
        referenceId: string | null;
        reason: string | null;
        notes: string | null;
        batchNumber: string | null;
        expiryDate: Date | null;
        performedBy: string | null;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>, Record<never, never>, Record<never, never>>;
export declare const createInventoryAdjustment: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    variantId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    reason: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    unitCost: z.ZodOptional<z.ZodString>;
    batchNumber: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    newStock: number;
    previousStock: number;
}, {
    success: boolean;
    newStock: number;
    previousStock: number;
}>, Record<never, never>, Record<never, never>>;
export declare const getStockAlerts: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    alertType: z.ZodOptional<z.ZodEnum<{
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
        overstock: "overstock";
        expiry: "expiry";
    }>>;
    isResolved: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    alerts: {
        id: string;
        productId: string;
        productName: string | null;
        variantId: string | null;
        alertType: string;
        threshold: number | null;
        currentStock: number | null;
        message: string | null;
        isResolved: boolean | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}, {
    alerts: {
        id: string;
        productId: string;
        productName: string | null;
        variantId: string | null;
        alertType: string;
        threshold: number | null;
        currentStock: number | null;
        message: string | null;
        isResolved: boolean | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        createdAt: Date;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>, Record<never, never>, Record<never, never>>;
export declare const resolveStockAlert: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    alertId: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const generateStockReport: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    includeVariants: z.ZodDefault<z.ZodBoolean>;
    lowStockOnly: z.ZodDefault<z.ZodBoolean>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    summary: {
        totalProducts: number;
        lowStockProducts: number;
        outOfStockProducts: number;
        totalStockValue: string;
    };
    products: {
        id: string;
        name: string;
        sku: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        price: string;
        inStock: boolean | null;
    }[];
    variants: any[];
    generatedAt: Date;
}, {
    summary: {
        totalProducts: number;
        lowStockProducts: number;
        outOfStockProducts: number;
        totalStockValue: string;
    };
    products: {
        id: string;
        name: string;
        sku: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        price: string;
        inStock: boolean | null;
    }[];
    variants: any[];
    generatedAt: Date;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=inventory.d.ts.map