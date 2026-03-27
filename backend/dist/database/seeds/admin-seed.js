import { db } from '../db.js';
import { user } from '../schema/auth-schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger.js';
import { auth } from '../../utils/auth.js';
import { seedEcommerce } from './ecommerce-seed.js';
export async function seedAdmin() {
    try {
        // Seed e-commerce data
        await seedEcommerce();
        console.log('E-commerce data seeded successfully');
        // Check if any admin user already exists by role
        const existingAdmin = await db
            .select()
            .from(user)
            .where(eq(user.role, 'admin'))
            .limit(1);
        if (existingAdmin.length > 0) {
            logger.info('Admin user already exists, skipping seed');
            return;
        }
        // Create admin user using Better Auth signUp
        await auth.api.signUpEmail({
            body: {
                email: 'admin@example.com',
                password: 'Admin@example.com',
                name: 'Admin'
            }
        });
        // Update user role to admin
        await db
            .update(user)
            .set({
            role: 'admin',
            emailVerified: true,
            phoneNumber: '+251912345678'
        })
            .where(eq(user.email, 'admin@example.com'));
        logger.info('Admin user created successfully');
    }
    catch (error) {
        logger.error('Failed to seed admin user:');
    }
}
//# sourceMappingURL=admin-seed.js.map