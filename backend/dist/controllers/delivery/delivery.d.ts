import { z } from 'zod';
export declare const sseClients: Map<string, Set<ReadableStreamDefaultController<any>>>;
export declare const deliveryBoyLogin: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phone: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
        photo: string | null;
        vehicleType: string | null;
    };
    error?: never;
}, {
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
        photo: string | null;
        vehicleType: string | null;
    };
    error?: never;
}>, Record<never, never>, Record<never, never>>;
export declare const getMyAssignedOrders: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    currency: string | null;
    paymentStatus: string | null;
    createdAt: Date;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    customerName: string | null;
}[], {
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    currency: string | null;
    paymentStatus: string | null;
    createdAt: Date;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    customerName: string | null;
}[]>, Record<never, never>, Record<never, never>>;
export declare const getClaimableOrders: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    currency: string | null;
    createdAt: Date;
    customerName: string | null;
}[], {
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    currency: string | null;
    createdAt: Date;
    customerName: string | null;
}[]>, Record<never, never>, Record<never, never>>;
export declare const claimOrder: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
    };
}>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const updateDeliveryStatus: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
    };
}>, z.ZodObject<{
    orderId: z.ZodString;
    status: z.ZodEnum<{
        returned: "returned";
        delivered: "delivered";
        out_for_delivery: "out_for_delivery";
    }>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const getDeliveryBoyStats: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    deliveryBoy: {
        id: string;
        name: string;
        phone: string;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    totalDeliveries: number;
    currentAssignedOrders: number;
    isAvailable: boolean;
    rating: string;
}, {
    totalDeliveries: number;
    currentAssignedOrders: number;
    isAvailable: boolean;
    rating: string;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=delivery.d.ts.map