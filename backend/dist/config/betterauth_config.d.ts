import 'dotenv/config';
export type OtpConfig = {
    enabled: boolean;
};
export declare const otpConfig: OtpConfig;
export declare const betterauthConfig: {
    otp: OtpConfig;
    trustOrgin: string[];
    BASEURL: string | undefined;
    rateLimit: {
        window: number;
        max: number;
    };
};
export type BetterAuthConfig = typeof betterauthConfig;
//# sourceMappingURL=betterauth_config.d.ts.map