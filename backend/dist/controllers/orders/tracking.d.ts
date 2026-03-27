import { z } from 'zod';
export declare const getOrderTracking: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodString, import("@orpc/contract").Schema<{
    id: string;
    orderId: string;
    status: string;
    location: string | null;
    latitude: string | null;
    longitude: string | null;
    courierName: string | null;
    courierPhone: string | null;
    courierImage: string | null;
    estimatedArrival: Date | null;
    notes: string | null;
    internalNotes: string | null;
    images: string[] | null;
    signature: string | null;
    metadata: Record<string, any> | null;
    timestamp: Date;
}[], {
    id: string;
    orderId: string;
    status: string;
    location: string | null;
    latitude: string | null;
    longitude: string | null;
    courierName: string | null;
    courierPhone: string | null;
    courierImage: string | null;
    estimatedArrival: Date | null;
    notes: string | null;
    internalNotes: string | null;
    images: string[] | null;
    signature: string | null;
    metadata: Record<string, any> | null;
    timestamp: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const updateTracking: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    status: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const getTrackingTimeline: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodString, import("@orpc/contract").Schema<{
    id: string;
    title: string;
    status: string;
    time: string;
    location: string;
}[], {
    id: string;
    title: string;
    status: string;
    time: string;
    location: string;
}[]>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=tracking.d.ts.map