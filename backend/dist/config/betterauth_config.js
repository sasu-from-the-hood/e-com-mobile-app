import 'dotenv/config';
import { config } from './env_config.js';
export const otpConfig = {
    enabled: config.otpEnabled,
};
export const betterauthConfig = {
    otp: otpConfig,
    trustOrgin: config.allowedOrigins,
    BASEURL: config.BACKEND_URL,
    rateLimit: {
        window: config.window,
        max: config.max,
    },
};
//# sourceMappingURL=betterauth_config.js.map