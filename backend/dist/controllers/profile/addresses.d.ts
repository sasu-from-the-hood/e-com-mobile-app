import { z } from 'zod';
export declare const getAddresses: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    fullName: string;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: string | null;
    longitude: string | null;
    instructions: string | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    id: string;
    userId: string;
    fullName: string;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: string | null;
    longitude: string | null;
    instructions: string | null;
    isDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const addAddress: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    fullName: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    country: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodString>;
    longitude: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, import("@orpc/contract").Schema<import("mysql2").ResultSetHeader, import("mysql2").ResultSetHeader>, Record<never, never>, Record<never, never>>;
export declare const updateAddress: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    fullName: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    country: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodString>;
    longitude: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    id: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, Record<never, never>, Record<never, never>>;
export declare const deleteAddress: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
//# sourceMappingURL=addresses.d.ts.map