export declare const handshake: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    service: string;
    version: string;
    env: string;
    auth: {
        login: string | undefined;
        register: string | undefined;
        forgotPassword: string | undefined;
        otp: boolean;
    };
    stats: {
        totalUsers: string;
        recentUsers: {
            name: string;
            avatar: null;
        }[];
    };
}, {
    service: string;
    version: string;
    env: string;
    auth: {
        login: string | undefined;
        register: string | undefined;
        forgotPassword: string | undefined;
        otp: boolean;
    };
    stats: {
        totalUsers: string;
        recentUsers: {
            name: string;
            avatar: null;
        }[];
    };
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=handshake.d.ts.map