import { z } from 'zod';
export declare const getPaymentMethods: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    userId: string;
    type: string;
    provider: string | null;
    cardNumber: string | null;
    expiryDate: string | null;
    cardHolderName: string | null;
    billingAddressId: string | null;
    paypalEmail: string | null;
    bankAccountNumber: string | null;
    routingNumber: string | null;
    isDefault: boolean | null;
    isActive: boolean | null;
    isVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    id: string;
    userId: string;
    type: string;
    provider: string | null;
    cardNumber: string | null;
    expiryDate: string | null;
    cardHolderName: string | null;
    billingAddressId: string | null;
    paypalEmail: string | null;
    bankAccountNumber: string | null;
    routingNumber: string | null;
    isDefault: boolean | null;
    isActive: boolean | null;
    isVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const addPaymentMethod: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    type: z.ZodEnum<{
        paypal: "paypal";
        card: "card";
        bank: "bank";
    }>;
    cardNumber: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodString>;
    cardholderName: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const processPayment: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    orderId: z.ZodString;
    paymentMethodId: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    transactionId: string;
    status: string;
}, {
    success: boolean;
    transactionId: string;
    status: string;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=checkout.d.ts.map