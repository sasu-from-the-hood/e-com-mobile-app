import { betterAuth } from "better-auth";
import { phoneNumber, admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db.js";
import { haveIBeenPwned } from "better-auth/plugins";
import { betterauthConfig } from "../config/betterauth_config.js";
import * as schema from "../database/schema/auth-schema.js";
import { expo } from "@better-auth/expo";
import { config } from "../config/env_config.js";
const plugins = [
    expo(),
    haveIBeenPwned(),
    admin(),
];
const usePhoneOtp = betterauthConfig.otp.enabled;
export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'mysql', schema }),
    baseURL: betterauthConfig.BASEURL,
    plugins: [
        ...plugins,
        ...(usePhoneOtp
            ? [phoneNumber({
                    async sendOTP({ phoneNumber: toPhoneNumber, code }) {
                        // TODO: integrate SMS provider here
                        // For now, log to console for development
                        console.log(`[OTP] to ${toPhoneNumber}: ${code}`);
                    },
                })]
            : []),
    ],
    rateLimit: {
        window: betterauthConfig.rateLimit.window,
        max: betterauthConfig.rateLimit.max,
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    appName: config.AppName || 'e-commerce App',
    trustedOrigins: betterauthConfig.trustOrgin,
});
//# sourceMappingURL=auth.js.map