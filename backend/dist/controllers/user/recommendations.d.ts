import { z } from 'zod';
export declare const getRecommendations: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
}>, z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<any[], any[]>, Record<never, never>, Record<never, never>>;
export declare const getPopularSearches: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    term: string;
    color: string | undefined;
}[], {
    term: string;
    color: string | undefined;
}[]>, Record<never, never>, Record<never, never>>;
export declare const trackInteraction: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
}>, z.ZodObject<{
    productId: z.ZodString;
    type: z.ZodEnum<{
        view: "view";
        favorite: "favorite";
        cart: "cart";
        purchase: "purchase";
    }>;
}, z.core.$strip>, import("@orpc/contract").Schema<void, void>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=recommendations.d.ts.map