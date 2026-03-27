import { z } from 'zod';
export declare const getDeliveryBoys: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    warehouseName: string | null;
    isActive: boolean | null;
    isAvailable: boolean | null;
    totalDeliveries: number | null;
    currentAssignedOrders: number | null;
    rating: string | null;
    notes: string | null;
    createdAt: Date;
}[], {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    warehouseName: string | null;
    isActive: boolean | null;
    isAvailable: boolean | null;
    totalDeliveries: number | null;
    currentAssignedOrders: number | null;
    rating: string | null;
    notes: string | null;
    createdAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const getDeliveryBoy: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, z.ZodString, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    phone: string;
    password: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    isActive: boolean | null;
    isAvailable: boolean | null;
    totalDeliveries: number | null;
    currentAssignedOrders: number | null;
    rating: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    name: string;
    phone: string;
    password: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    isActive: boolean | null;
    isAvailable: boolean | null;
    totalDeliveries: number | null;
    currentAssignedOrders: number | null;
    rating: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}>, Record<never, never>, Record<never, never>>;
export declare const createDeliveryBoy: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    photo: z.ZodOptional<z.ZodString>;
    vehicleType: z.ZodOptional<z.ZodString>;
    vehiclePlateNumber: z.ZodOptional<z.ZodString>;
    warehouseId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    phone: string;
    password: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    isActive: boolean;
    isAvailable: boolean;
    notes: string | null;
    totalDeliveries: number;
    currentAssignedOrders: number;
    rating: string;
}, {
    id: string;
    name: string;
    phone: string;
    password: string;
    email: string | null;
    photo: string | null;
    vehicleType: string | null;
    vehiclePlateNumber: string | null;
    warehouseId: string | null;
    isActive: boolean;
    isAvailable: boolean;
    notes: string | null;
    totalDeliveries: number;
    currentAssignedOrders: number;
    rating: string;
}>, Record<never, never>, Record<never, never>>;
export declare const updateDeliveryBoy: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    photo: z.ZodOptional<z.ZodString>;
    vehicleType: z.ZodOptional<z.ZodString>;
    vehiclePlateNumber: z.ZodOptional<z.ZodString>;
    warehouseId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const deleteDeliveryBoy: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const getDeliveryBoyStats: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    total: number;
    active: number;
    available: number;
    onDelivery: number;
} | undefined, {
    total: number;
    active: number;
    available: number;
    onDelivery: number;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const assignDeliveryBoy: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, z.ZodObject<{
    orderId: z.ZodString;
    deliveryBoyId: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=delivery-boys.d.ts.map