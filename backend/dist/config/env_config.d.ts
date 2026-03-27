import 'dotenv/config';
export declare const allowedOrigins: string[];
export declare const corsOptions: {
    origin: (origin: string | undefined) => string | null;
    allowMethods: string[];
    allowHeaders: string[];
    exposeHeaders: string[];
    credentials: boolean;
    maxAge: number;
};
export declare const port: number;
export declare const config: {
    nodeEnv: string;
    allowedOrigins: string[];
    port: number;
    version: string;
    BACKEND_URL: string | undefined;
    logLevel: "silent" | "error" | "warn" | "info" | "debug" | "trace";
    mysql: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    loginEnabled: string | undefined;
    registerEnabled: string | undefined;
    forgotPasswordEnabled: string | undefined;
    resetPasswordEnabled: string | undefined;
    otpEnabled: boolean;
    AppName: string | undefined;
    BackEndUrl: string | undefined;
    window: number;
    max: number;
    jwt: {
        secret: string;
        expiry: string;
        refreshExpiry: string;
        issuer: string;
        audience: string;
    };
    afrosms: {
        apiKey: string;
        baseUrl: string;
        senderId: string;
    };
};
//# sourceMappingURL=env_config.d.ts.map