import { db } from '../db.js';
import { categories, products } from '../schema/index.js';
import cuid from 'cuid';
export async function seedEcommerce() {
    try {
        // Check if data already exists
        const existingCategories = await db.select().from(categories).limit(1);
        if (existingCategories.length > 0) {
            console.log('E-commerce data already exists, skipping seed');
            return;
        }
        // Seed Categories
        const categoryData = [
            {
                id: cuid(),
                name: 'New Arrivals',
                description: 'Latest products in our store',
                isActive: true,
                isFeatured: true
            },
            {
                id: cuid(),
                name: 'Clothes',
                description: 'Fashion and apparel',
                isActive: true,
                isFeatured: false
            },
            {
                id: cuid(),
                name: 'Bags',
                description: 'Handbags and accessories',
                isActive: true,
                isFeatured: false
            },
            {
                id: cuid(),
                name: 'Shoes',
                description: 'Footwear for all occasions',
                isActive: true,
                isFeatured: false
            },
            {
                id: cuid(),
                name: 'Electronics',
                description: 'Tech gadgets and devices',
                isActive: true,
                isFeatured: true
            }
        ];
        await db.insert(categories).values(categoryData);
        // Seed Products
        const productData = [
            {
                id: cuid(),
                name: 'Wireless Headphones',
                slug: 'wireless-headphones',
                description: 'High-quality wireless headphones with noise cancellation and premium sound.',
                shortDescription: 'Premium wireless headphones',
                price: '99.99',
                originalPrice: '129.99',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
                categoryId: categoryData[4]?.id || cuid(),
                brand: 'AudioTech',
                sku: 'AT-WH-001',
                colors: ['Black', 'White', 'Blue'],
                sizes: ['One Size'],
                tags: ['wireless', 'audio', 'premium'],
                rating: '4.5',
                reviewCount: 128,
                inStock: true,
                stockQuantity: 50,
                lowStockThreshold: 10,
                discount: 23,
                isFeatured: true
            },
            {
                id: cuid(),
                name: 'Smart Watch',
                slug: 'smart-watch',
                description: 'Feature-rich smartwatch with health monitoring, GPS, and long battery life.',
                shortDescription: 'Advanced fitness smartwatch',
                price: '199.99',
                originalPrice: '249.99',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
                categoryId: categoryData[4]?.id || cuid(),
                brand: 'TechFit',
                sku: 'TF-SW-002',
                colors: ['Black', 'Silver', 'Rose Gold'],
                sizes: ['38mm', '42mm'],
                tags: ['smartwatch', 'fitness', 'health'],
                rating: '4.3',
                reviewCount: 89,
                inStock: true,
                stockQuantity: 30,
                lowStockThreshold: 5,
                discount: 20,
                isFeatured: true
            },
            {
                id: cuid(),
                name: 'Running Shoes',
                slug: 'running-shoes',
                description: 'Comfortable running shoes designed for daily workouts and long-distance running.',
                shortDescription: 'Professional running shoes',
                price: '79.99',
                originalPrice: '99.99',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
                categoryId: categoryData[3]?.id || cuid(),
                brand: 'RunFast',
                sku: 'RF-RS-003',
                colors: ['Blue', 'Red', 'Black'],
                sizes: ['38', '39', '40', '41', '42', '43', '44'],
                tags: ['running', 'sports', 'comfort'],
                rating: '4.7',
                reviewCount: 203,
                inStock: true,
                stockQuantity: 75,
                lowStockThreshold: 15,
                discount: 20,
                isFeatured: true
            },
            {
                id: cuid(),
                name: 'Leather Backpack',
                slug: 'leather-backpack',
                description: 'Durable leather backpack perfect for travel, work, and everyday use.',
                shortDescription: 'Premium leather backpack',
                price: '49.99',
                originalPrice: '69.99',
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
                categoryId: categoryData[2]?.id || cuid(),
                brand: 'LeatherCraft',
                sku: 'LC-BP-004',
                colors: ['Brown', 'Black', 'Tan'],
                sizes: ['Medium', 'Large'],
                tags: ['backpack', 'leather', 'travel'],
                rating: '4.2',
                reviewCount: 156,
                inStock: true,
                stockQuantity: 25,
                lowStockThreshold: 8,
                discount: 29,
                isFeatured: false
            },
            {
                id: cuid(),
                name: 'Cotton T-Shirt',
                slug: 'cotton-t-shirt',
                description: 'Soft and comfortable 100% cotton t-shirt available in multiple colors.',
                shortDescription: 'Premium cotton t-shirt',
                price: '19.99',
                originalPrice: '24.99',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
                categoryId: categoryData[1]?.id || cuid(),
                brand: 'ComfortWear',
                sku: 'CW-TS-005',
                colors: ['White', 'Black', 'Gray', 'Navy', 'Red'],
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                tags: ['t-shirt', 'cotton', 'casual'],
                rating: '4.4',
                reviewCount: 312,
                inStock: true,
                stockQuantity: 100,
                lowStockThreshold: 20,
                discount: 20,
                isFeatured: false
            },
            {
                id: cuid(),
                name: 'Denim Jeans',
                slug: 'denim-jeans',
                description: 'Classic denim jeans with modern fit and premium quality fabric.',
                shortDescription: 'Classic fit denim jeans',
                price: '59.99',
                originalPrice: '79.99',
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
                images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
                categoryId: categoryData[1]?.id || cuid(),
                brand: 'DenimCo',
                sku: 'DC-DJ-006',
                colors: ['Blue', 'Black', 'Light Blue'],
                sizes: ['28', '30', '32', '34', '36', '38'],
                tags: ['jeans', 'denim', 'casual'],
                rating: '4.1',
                reviewCount: 89,
                inStock: true,
                stockQuantity: 60,
                lowStockThreshold: 12,
                discount: 25,
                isFeatured: false
            }
        ];
        await db.insert(products).values(productData);
        console.log('E-commerce data seeded successfully');
    }
    catch (error) {
        console.error('Failed to seed e-commerce data:', error);
    }
}
//# sourceMappingURL=ecommerce-seed.js.map