import { z } from 'zod';
export declare const deleteAccount: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    password: z.ZodString;
    confirmation: z.ZodLiteral<"DELETE">;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    message: string;
}, {
    success: boolean;
    message: string;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=delete-account.d.ts.map