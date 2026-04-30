import { z } from 'zod';
/**
 * Proxy GLB files from Gradio to avoid CORS issues
 * This downloads the file from Gradio and streams it to the client
 */
export declare const proxyGLB: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    url: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    data: string;
    size: number;
    contentType: string;
}, {
    success: boolean;
    data: string;
    size: number;
    contentType: string;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=3d-proxy.d.ts.map