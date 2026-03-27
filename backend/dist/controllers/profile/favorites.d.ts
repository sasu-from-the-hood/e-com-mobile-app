import { z } from 'zod';
export declare const getFavorites: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    product: any;
    id: string;
}[], {
    product: any;
    id: string;
}[]>, Record<never, never>, Record<never, never>>;
export declare const addToFavorites: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
export declare const removeFromFavorites: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
//# sourceMappingURL=favorites.d.ts.map