import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../../database/db.js';
import { helpArticles } from '../../database/schema/index.js';
import { eq, like, and, desc } from 'drizzle-orm';
import cuid from 'cuid';
import { authMiddleware } from '../../middleware/auth.js';
import * as fs from 'fs';
import * as path from 'path';
// Get all help articles
export const getHelpArticles = os
    .input(z.object({
    category: z.string().optional(),
    search: z.string().optional(),
}))
    .handler(async ({ input }) => {
    const conditions = [];
    conditions.push(eq(helpArticles.isActive, true));
    if (input.category) {
        conditions.push(eq(helpArticles.category, input.category));
    }
    if (input.search) {
        conditions.push(like(helpArticles.title, `%${input.search}%`));
    }
    const articles = await db
        .select()
        .from(helpArticles)
        .where(and(...conditions))
        .orderBy(helpArticles.order, helpArticles.createdAt);
    return articles;
});
// Get single help article
export const getHelpArticle = os
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
    const [article] = await db
        .select()
        .from(helpArticles)
        .where(eq(helpArticles.id, input.id))
        .limit(1);
    return article || null;
});
// Admin: Get all help articles (including inactive)
export const adminGetHelpArticles = os
    .use(authMiddleware)
    .handler(async ({ context }) => {
    if (context.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    const articles = await db
        .select()
        .from(helpArticles)
        .orderBy(helpArticles.order, desc(helpArticles.createdAt));
    return articles;
});
// Admin: Create help article
export const createHelpArticle = os
    .input(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    category: z.string().min(1),
    image: z.any().optional(),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
}))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    try {
        console.log('createHelpArticle - Input:', JSON.stringify({
            title: input.title,
            category: input.category,
            order: input.order,
            isActive: input.isActive,
            hasImage: !!input.image,
            imageType: input.image ? typeof input.image : 'none'
        }));
        console.log('createHelpArticle - User role:', context.user.role);
        if (context.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        let imageUrl = null;
        // Handle image upload
        if (input.image && input.image instanceof File) {
            console.log('Processing image upload...');
            const uploadDir = path.join(process.cwd(), 'uploads', 'help');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const timestamp = Date.now();
            const randomId = Math.round(Math.random() * 1E9);
            const extension = input.image.name.split('.').pop() || 'jpg';
            const filename = `help-${timestamp}-${randomId}.${extension}`;
            const filePath = path.join(uploadDir, filename);
            const buffer = Buffer.from(await input.image.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/help/${filename}`;
            console.log('Image uploaded:', imageUrl);
        }
        const articleId = cuid();
        console.log('Creating article with ID:', articleId);
        await db.insert(helpArticles).values({
            id: articleId,
            title: input.title,
            content: input.content,
            category: input.category,
            image: imageUrl,
            order: input.order,
            isActive: input.isActive,
        });
        console.log('Article inserted, fetching...');
        const [article] = await db
            .select()
            .from(helpArticles)
            .where(eq(helpArticles.id, articleId));
        console.log('Article created successfully:', article?.id);
        return article;
    }
    catch (error) {
        console.error('createHelpArticle - Error:', error);
        throw error;
    }
});
// Admin: Update help article
export const updateHelpArticle = os
    .input(z.object({
    id: z.string(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    image: z.any().optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
}))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    const updateData = {};
    if (input.title)
        updateData.title = input.title;
    if (input.content)
        updateData.content = input.content;
    if (input.category)
        updateData.category = input.category;
    if (input.order !== undefined)
        updateData.order = input.order;
    if (input.isActive !== undefined)
        updateData.isActive = input.isActive;
    // Handle image upload
    if (input.image && input.image instanceof File) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'help');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const timestamp = Date.now();
        const randomId = Math.round(Math.random() * 1E9);
        const extension = input.image.name.split('.').pop() || 'jpg';
        const filename = `help-${timestamp}-${randomId}.${extension}`;
        const filePath = path.join(uploadDir, filename);
        const buffer = Buffer.from(await input.image.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        updateData.image = `/uploads/help/${filename}`;
    }
    await db
        .update(helpArticles)
        .set(updateData)
        .where(eq(helpArticles.id, input.id));
    const [article] = await db
        .select()
        .from(helpArticles)
        .where(eq(helpArticles.id, input.id));
    return article;
});
// Admin: Delete help article
export const deleteHelpArticle = os
    .input(z.object({ id: z.string() }))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    await db.delete(helpArticles).where(eq(helpArticles.id, input.id));
    return { success: true };
});
//# sourceMappingURL=help-articles.js.map