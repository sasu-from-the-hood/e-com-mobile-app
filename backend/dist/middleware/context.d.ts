export interface CreateContextOptions {
    req: Request;
    res: Response;
}
export interface Context {
    req: Request;
    res: Response;
    user?: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session?: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
}
export declare const createContext: ({ req, res }: CreateContextOptions) => Promise<Context>;
//# sourceMappingURL=context.d.ts.map