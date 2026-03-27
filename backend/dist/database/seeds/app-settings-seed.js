import { db } from '../db.js';
import { appSettings } from '../schema/index.js';
import { eq } from 'drizzle-orm';
import cuid from 'cuid';
export async function seedAppSettings() {
    const defaultSettings = [
        {
            key: 'app_name',
            value: 'E-Commerce App',
            description: 'The name of the application',
        },
        {
            key: 'contact_email',
            value: 'support@example.com',
            description: 'Contact email for customer support',
        },
        {
            key: 'contact_phone',
            value: '+251912345678',
            description: 'Contact phone number',
        },
        {
            key: 'facebook_url',
            value: '',
            description: 'Facebook page URL',
        },
        {
            key: 'instagram_url',
            value: '',
            description: 'Instagram profile URL',
        },
        {
            key: 'twitter_url',
            value: '',
            description: 'Twitter profile URL',
        },
        {
            key: 'about_us',
            value: 'We are a leading e-commerce platform providing quality products.',
            description: 'About us text',
        },
        {
            key: 'terms_conditions',
            value: 'Terms and conditions content goes here.',
            description: 'Terms and conditions',
        },
        {
            key: 'privacy_policy',
            value: 'Privacy policy content goes here.',
            description: 'Privacy policy',
        },
        {
            key: 'return_policy',
            value: 'Return policy content goes here.',
            description: 'Return policy',
        },
        {
            key: 'shipping_info',
            value: 'Shipping information goes here.',
            description: 'Shipping information',
        },
    ];
    for (const setting of defaultSettings) {
        const existing = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, setting.key))
            .limit(1);
        if (existing.length === 0) {
            await db.insert(appSettings).values({
                id: cuid(),
                ...setting,
            });
        }
    }
    console.log('App settings seeded successfully');
}
//# sourceMappingURL=app-settings-seed.js.map