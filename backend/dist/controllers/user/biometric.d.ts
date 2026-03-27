import { z } from 'zod';
export declare const biometricPlugin: () => {
    id: string;
    endpoints: {
        registerBiometric: import("better-call").StrictEndpoint<"/biometric/register", {
            method: "POST";
            body: z.ZodObject<{
                deviceId: z.ZodString;
                publicKey: z.ZodString;
            }, z.core.$strip>;
            requireAuth: boolean;
        }, {
            error: string;
        } | {
            success: boolean;
        }>;
        removeBiometric: import("better-call").StrictEndpoint<"/biometric/remove", {
            method: "POST";
            requireAuth: boolean;
        }, {
            error: string;
        } | {
            success: boolean;
        }>;
        checkBiometric: import("better-call").StrictEndpoint<"/biometric/check", {
            method: "POST";
            body: z.ZodObject<{
                deviceId: z.ZodString;
            }, z.core.$strip>;
            requireAuth: boolean;
        }, {
            error: string;
        } | {
            registered: boolean;
        }>;
        generateChallenge: import("better-call").StrictEndpoint<"/biometric/challenge", {
            method: "POST";
            body: z.ZodObject<{
                deviceId: z.ZodString;
            }, z.core.$strip>;
        }, {
            error: string;
        } | {
            challenge: string;
        }>;
        loginWithBiometric: import("better-call").StrictEndpoint<"/biometric/login", {
            method: "POST";
            body: z.ZodObject<{
                deviceId: z.ZodString;
                signature: z.ZodString;
            }, z.core.$strip>;
        }, {
            error: string;
        } | {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } | undefined;
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
        }>;
    };
};
//# sourceMappingURL=biometric.d.ts.map