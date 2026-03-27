import { z } from 'zod';
export declare const getNotifications: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    userId: string;
    type: string;
    category: string | null;
    title: string;
    message: string;
    actionUrl: string | null;
    actionText: string | null;
    image: string | null;
    icon: string | null;
    priority: string | null;
    read: boolean | null;
    readAt: Date | null;
    delivered: boolean | null;
    deliveredAt: Date | null;
    data: Record<string, any> | null;
    expiresAt: Date | null;
    createdAt: Date;
}[], {
    id: string;
    userId: string;
    type: string;
    category: string | null;
    title: string;
    message: string;
    actionUrl: string | null;
    actionText: string | null;
    image: string | null;
    icon: string | null;
    priority: string | null;
    read: boolean | null;
    readAt: Date | null;
    delivered: boolean | null;
    deliveredAt: Date | null;
    data: Record<string, any> | null;
    expiresAt: Date | null;
    createdAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const markAsRead: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, z.ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const markAllAsRead: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare function createNotification({ userId, title, message, type, category }: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    category?: string;
}): Promise<import("drizzle-orm/mysql2").MySqlRawQueryResult>;
export declare const sendNotification: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    userId: z.ZodString;
    title: z.ZodString;
    message: z.ZodString;
    type: z.ZodDefault<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=notifications.d.ts.map