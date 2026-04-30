import { z } from 'zod';
/**
 * Save and compress 3D model GLB files
 */
export declare const save3DModel: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    bodyPartType: z.ZodEnum<{
        "both-legs": "both-legs";
        "left-leg": "left-leg";
        "right-leg": "right-leg";
        "top-head": "top-head";
        "middle-head": "middle-head";
        "lower-head": "lower-head";
        chest: "chest";
        "left-hand": "left-hand";
        "right-hand": "right-hand";
    }>;
    colorName: z.ZodOptional<z.ZodString>;
    colorHex: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    leftLegUrl: z.ZodOptional<z.ZodString>;
    rightLegUrl: z.ZodOptional<z.ZodString>;
    scale: z.ZodOptional<z.ZodNumber>;
    positionX: z.ZodOptional<z.ZodNumber>;
    positionY: z.ZodOptional<z.ZodNumber>;
    positionZ: z.ZodOptional<z.ZodNumber>;
    inferenceSteps: z.ZodOptional<z.ZodNumber>;
    guidanceScale: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    guidanceScale: number | null;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
    id: string;
    name: string;
    bodyPartType: "both-legs" | "left-leg" | "right-leg" | "top-head" | "middle-head" | "lower-head" | "chest" | "left-hand" | "right-hand";
    colorName: string | null;
    colorHex: string | null;
    prompt: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    leftLegSize: number | null;
    rightLegSize: number | null;
    leftLegOriginalSize: number | null;
    rightLegOriginalSize: number | null;
    inferenceSteps: number | null;
}, {
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    guidanceScale: number | null;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
    id: string;
    name: string;
    bodyPartType: "both-legs" | "left-leg" | "right-leg" | "top-head" | "middle-head" | "lower-head" | "chest" | "left-hand" | "right-hand";
    colorName: string | null;
    colorHex: string | null;
    prompt: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    leftLegSize: number | null;
    rightLegSize: number | null;
    leftLegOriginalSize: number | null;
    rightLegOriginalSize: number | null;
    inferenceSteps: number | null;
}>, Record<never, never>, Record<never, never>>;
/**
 * List all 3D models
 */
export declare const list3DModels: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    guidanceScale: number | null;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
    id: string;
    name: string;
    bodyPartType: string;
    colorName: string | null;
    colorHex: string | null;
    prompt: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    leftLegSize: number | null;
    rightLegSize: number | null;
    leftLegOriginalSize: number | null;
    rightLegOriginalSize: number | null;
    inferenceSteps: number | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    guidanceScale: number | null;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
    id: string;
    name: string;
    bodyPartType: string;
    colorName: string | null;
    colorHex: string | null;
    prompt: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    leftLegSize: number | null;
    rightLegSize: number | null;
    leftLegOriginalSize: number | null;
    rightLegOriginalSize: number | null;
    inferenceSteps: number | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
/**
 * Delete a 3D model
 */
export declare const delete3DModel: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>>, z.ZodString, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
/**
 * Get a single 3D model by ID (publicly accessible)
 */
export declare const get3DModel: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodString, import("@orpc/contract").Schema<{
    id: string;
    bodyPartType: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
}, {
    id: string;
    bodyPartType: string;
    leftLegFile: string | null;
    rightLegFile: string | null;
    scale: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    leftLegUrl: string | null;
    rightLegUrl: string | null;
}>, Record<never, never>, Record<never, never>>;
/**
 * Check if a model is saved by its prompt and body part type
 */
export declare const checkModelSaved: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
    prompt: z.ZodString;
    bodyPartType: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    isSaved: boolean;
    modelId: string | null;
    model: {
        scale: number;
        positionX: number;
        positionY: number;
        positionZ: number;
        guidanceScale: number | null;
        id: string;
        name: string;
        bodyPartType: string;
        colorName: string | null;
        colorHex: string | null;
        prompt: string;
        leftLegFile: string | null;
        rightLegFile: string | null;
        leftLegSize: number | null;
        rightLegSize: number | null;
        leftLegOriginalSize: number | null;
        rightLegOriginalSize: number | null;
        inferenceSteps: number | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
}, {
    isSaved: boolean;
    modelId: string | null;
    model: {
        scale: number;
        positionX: number;
        positionY: number;
        positionZ: number;
        guidanceScale: number | null;
        id: string;
        name: string;
        bodyPartType: string;
        colorName: string | null;
        colorHex: string | null;
        prompt: string;
        leftLegFile: string | null;
        rightLegFile: string | null;
        leftLegSize: number | null;
        rightLegSize: number | null;
        leftLegOriginalSize: number | null;
        rightLegOriginalSize: number | null;
        inferenceSteps: number | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=3d-models-orpc.d.ts.map