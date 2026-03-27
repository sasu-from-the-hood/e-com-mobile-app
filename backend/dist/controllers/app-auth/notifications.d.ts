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
export declare const getUnreadCount: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    count: number;
}, {
    count: number;
}>, Record<never, never>, Record<never, never>>;
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
//# sourceMappingURL=notifications.d.ts.map