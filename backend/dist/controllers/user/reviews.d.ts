import { z } from 'zod';
export declare const getProductReviews: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodString, import("@orpc/contract").Schema<{
    id: string;
    userId: string;
    productId: string;
    orderId: string | null;
    rating: number;
    title: string | null;
    comment: string | null;
    pros: string | null;
    cons: string | null;
    images: string[] | null;
    isVerifiedPurchase: boolean | null;
    helpful: number | null;
    notHelpful: number | null;
    isApproved: boolean | null;
    size: string | null;
    color: string | null;
    variant: string | null;
    wouldRecommend: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}[], {
    id: string;
    userId: string;
    productId: string;
    orderId: string | null;
    rating: number;
    title: string | null;
    comment: string | null;
    pros: string | null;
    cons: string | null;
    images: string[] | null;
    isVerifiedPurchase: boolean | null;
    helpful: number | null;
    notHelpful: number | null;
    isApproved: boolean | null;
    size: string | null;
    color: string | null;
    variant: string | null;
    wouldRecommend: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    userName: string | null;
    userImage: string | null;
}[]>, Record<never, never>, Record<never, never>>;
export declare const addReview: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodObject<{
    productId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const updateReview: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodObject<{
    id: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const deleteReview: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=reviews.d.ts.map