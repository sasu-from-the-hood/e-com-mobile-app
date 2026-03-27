// Use standard web Request and Response types
import { auth } from "../utils/auth.js";
export const createContext = async ({ req, res }) => {
    const context = { req, res };
    try {
        // Get cookies from Cookie header
        const cookieHeader = req.headers.get('cookie');
        const authHeader = req.headers.get('authorization');
        // Try to get session using Better Auth
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (session?.session && session?.user) {
            context.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role || 'user',
                emailVerified: session.user.emailVerified,
            };
            context.session = {
                id: session.session.id,
                userId: session.session.userId,
                expiresAt: session.session.expiresAt,
            };
        }
    }
    catch (error) {
        console.error("Context creation error:", error);
    }
    return context;
};
//# sourceMappingURL=context.js.map