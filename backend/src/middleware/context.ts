// Use standard web Request and Response types
import { auth } from "../utils/auth.js";

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

export const createContext = async ({ req, res }: CreateContextOptions): Promise<Context> => {
  const context: Context = { req, res };

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
        role: (session.user as any).role || 'user',
        emailVerified: session.user.emailVerified,
      };

      context.session = {
        id: session.session.id,
        userId: session.session.userId,
        expiresAt: session.session.expiresAt,
      };
    }
  } catch (error) {
    console.error("Context creation error:", error);
  }

  return context;
};
