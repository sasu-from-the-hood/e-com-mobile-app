export declare const router: {
    getProducts: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        category: import("zod").ZodOptional<import("zod").ZodString>;
        search: import("zod").ZodOptional<import("zod").ZodString>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<any[], any[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getProduct: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodString, import("@orpc/contract").Schema<any, any>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getCategories: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        productCount: number;
    }[], {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        productCount: number;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    searchProducts: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        query: import("zod").ZodString;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<any[], any[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    trackSearchClick: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: never;
    }, {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getPopularSearches: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        term: string;
        count: number;
    }[], {
        term: string;
        count: number;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getUserSearchHistory: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        term: string;
        count: number;
        lastSearched: Date;
    }[], {
        term: string;
        count: number;
        lastSearched: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    clearSearchHistory: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getRecommendations: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<any[], any[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    trackInteraction: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
        type: import("zod").ZodEnum<{
            view: "view";
            favorite: "favorite";
            cart: "cart";
            purchase: "purchase";
        }>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<void, void>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getBanners: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodString;
        title: import("zod").ZodString;
        subtitle: import("zod").ZodString;
        imageUrl: import("zod").ZodString;
        imageAlt: import("zod").ZodString;
        type: import("zod").ZodOptional<import("zod").ZodString>;
        discount: import("zod").ZodOptional<import("zod").ZodNumber>;
        productId: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getNewArrivals: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        price: number;
        rating: number;
        colorImages: any;
        colors: string[];
        images: any;
        sizes: any;
        tags: any;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        originalPrice: string | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        variantStock: Record<string, number> | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        price: number;
        rating: number;
        colorImages: any;
        colors: string[];
        images: any;
        sizes: any;
        tags: any;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        originalPrice: string | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        variantStock: Record<string, number> | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getBrowseAllProducts: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        excludeIds: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodString>>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
        offset: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<any[], any[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getCart: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        productId: string;
        quantity: number;
        color: string | null;
        size: string | null;
        selected: boolean;
        product: {
            id: string;
            name: string;
            price: string;
            image: string;
            imageUrl: string;
            colorImages: any;
        };
    }[], {
        id: string;
        productId: string;
        quantity: number;
        color: string | null;
        size: string | null;
        selected: boolean;
        product: {
            id: string;
            name: string;
            price: string;
            image: string;
            imageUrl: string;
            colorImages: any;
        };
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    addToCart: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
        quantity: import("zod").ZodNumber;
        color: import("zod").ZodOptional<import("zod").ZodString>;
        size: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult | undefined, import("drizzle-orm/mysql2").MySqlRawQueryResult | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateCart: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        quantity: import("zod").ZodNumber;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    removeFromCart: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    clearCart: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    toggleCartItemSelection: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        selected: import("zod").ZodBoolean;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getCartTotal: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        currency: string;
    }, {
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        currency: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getPaymentMethods: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        type: string;
        provider: string | null;
        cardNumber: string | null;
        expiryDate: string | null;
        cardHolderName: string | null;
        billingAddressId: string | null;
        paypalEmail: string | null;
        bankAccountNumber: string | null;
        routingNumber: string | null;
        isDefault: boolean | null;
        isActive: boolean | null;
        isVerified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        userId: string;
        type: string;
        provider: string | null;
        cardNumber: string | null;
        expiryDate: string | null;
        cardHolderName: string | null;
        billingAddressId: string | null;
        paypalEmail: string | null;
        bankAccountNumber: string | null;
        routingNumber: string | null;
        isDefault: boolean | null;
        isActive: boolean | null;
        isVerified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    addPaymentMethod: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        type: import("zod").ZodEnum<{
            paypal: "paypal";
            card: "card";
            bank: "bank";
        }>;
        cardNumber: import("zod").ZodOptional<import("zod").ZodString>;
        expiryDate: import("zod").ZodOptional<import("zod").ZodString>;
        cardholderName: import("zod").ZodOptional<import("zod").ZodString>;
        isDefault: import("zod").ZodDefault<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    processPayment: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        paymentMethodId: import("zod").ZodString;
        amount: import("zod").ZodNumber;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        transactionId: string;
        status: string;
    }, {
        success: boolean;
        transactionId: string;
        status: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getOrders: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            productName: string;
            productImage: string | null;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            size: string | null;
            color: string | null;
            variant: string | null;
            sku: string | null;
            weight: string | null;
            customizations: Record<string, any> | null;
            giftMessage: string | null;
            isGift: string | null;
            returnStatus: string | null;
            returnReason: string | null;
            createdAt: Date;
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        items: {
            id: string;
            orderId: string;
            productId: string;
            productName: string;
            productImage: string | null;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            size: string | null;
            color: string | null;
            variant: string | null;
            sku: string | null;
            weight: string | null;
            customizations: Record<string, any> | null;
            giftMessage: string | null;
            isGift: string | null;
            returnStatus: string | null;
            returnReason: string | null;
            createdAt: Date;
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            product: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                price: string;
                originalPrice: string | null;
                colorImages: Record<string, string[]> | null;
                categoryId: string | null;
                warehouseId: string | null;
                sku: string | null;
                sizes: string[] | null;
                tags: string[] | null;
                variantStock: Record<string, number> | null;
                rating: string | null;
                reviewCount: number | null;
                inStock: boolean | null;
                stockQuantity: number | null;
                lowStockThreshold: number | null;
                discount: number | null;
                weight: string | null;
                isActive: boolean | null;
                isFeatured: boolean | null;
                isDigital: boolean | null;
                createdAt: Date;
                updatedAt: Date;
            };
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            product: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                price: string;
                originalPrice: string | null;
                colorImages: Record<string, string[]> | null;
                categoryId: string | null;
                warehouseId: string | null;
                sku: string | null;
                sizes: string[] | null;
                tags: string[] | null;
                variantStock: Record<string, number> | null;
                rating: string | null;
                reviewCount: number | null;
                inStock: boolean | null;
                stockQuantity: number | null;
                lowStockThreshold: number | null;
                discount: number | null;
                weight: string | null;
                isActive: boolean | null;
                isFeatured: boolean | null;
                isDigital: boolean | null;
                createdAt: Date;
                updatedAt: Date;
            };
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        shippingAddress: import("zod").ZodString;
        paymentMethodId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        orderNumber: string;
        subtotal: string;
        total: string;
        currency: string;
        status: "pending";
        shippingAddressId: string;
        paymentMethodId: null;
        paymentStatus: string;
        notes: string;
    }, {
        id: string;
        userId: string;
        orderNumber: string;
        subtotal: string;
        total: string;
        currency: string;
        status: "pending";
        shippingAddressId: string;
        paymentMethodId: null;
        paymentStatus: string;
        notes: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    cancelOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateOrderStatus: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        status: import("zod").ZodEnum<{
            pending: "pending";
            delivered: "delivered";
            processing: "processing";
            shipped: "shipped";
            cancelled: "cancelled";
        }>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateOrderDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        deliveryBoy: import("zod").ZodBoolean;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getOrderWarehouse: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string | null;
    } | null, {
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string | null;
    } | null>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getOrderTracking: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        orderId: string;
        status: string;
        location: string | null;
        latitude: string | null;
        longitude: string | null;
        courierName: string | null;
        courierPhone: string | null;
        courierImage: string | null;
        estimatedArrival: Date | null;
        notes: string | null;
        internalNotes: string | null;
        images: string[] | null;
        signature: string | null;
        metadata: Record<string, any> | null;
        timestamp: Date;
    }[], {
        id: string;
        orderId: string;
        status: string;
        location: string | null;
        latitude: string | null;
        longitude: string | null;
        courierName: string | null;
        courierPhone: string | null;
        courierImage: string | null;
        estimatedArrival: Date | null;
        notes: string | null;
        internalNotes: string | null;
        images: string[] | null;
        signature: string | null;
        metadata: Record<string, any> | null;
        timestamp: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateTracking: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        status: import("zod").ZodString;
        location: import("zod").ZodOptional<import("zod").ZodString>;
        notes: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getTrackingTimeline: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        status: string;
        time: string;
        location: string;
    }[], {
        id: string;
        title: string;
        status: string;
        time: string;
        location: string;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getNotifications: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        type: string;
        category: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        actionText: string | null;
        image: string | null;
        icon: string | null;
        priority: string | null;
        read: boolean | null;
        readAt: Date | null;
        delivered: boolean | null;
        deliveredAt: Date | null;
        data: Record<string, any> | null;
        expiresAt: Date | null;
        createdAt: Date;
    }[], {
        id: string;
        userId: string;
        type: string;
        category: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        actionText: string | null;
        image: string | null;
        icon: string | null;
        priority: string | null;
        read: boolean | null;
        readAt: Date | null;
        delivered: boolean | null;
        deliveredAt: Date | null;
        data: Record<string, any> | null;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    markAsRead: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    markAllAsRead: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    sendNotification: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        userId: import("zod").ZodString;
        title: import("zod").ZodString;
        message: import("zod").ZodString;
        type: import("zod").ZodDefault<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getFavorites: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        product: any;
        id: string;
    }[], {
        product: any;
        id: string;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    addToFavorites: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    removeFromFavorites: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getAddresses: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        fullName: string;
        phone: string | null;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        latitude: string | null;
        longitude: string | null;
        instructions: string | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        userId: string;
        fullName: string;
        phone: string | null;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        latitude: string | null;
        longitude: string | null;
        instructions: string | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    addAddress: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        fullName: import("zod").ZodString;
        addressLine1: import("zod").ZodString;
        addressLine2: import("zod").ZodOptional<import("zod").ZodString>;
        city: import("zod").ZodString;
        state: import("zod").ZodString;
        zipCode: import("zod").ZodString;
        country: import("zod").ZodString;
        phone: import("zod").ZodOptional<import("zod").ZodString>;
        latitude: import("zod").ZodOptional<import("zod").ZodString>;
        longitude: import("zod").ZodOptional<import("zod").ZodString>;
        instructions: import("zod").ZodOptional<import("zod").ZodString>;
        isDefault: import("zod").ZodDefault<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("mysql2").ResultSetHeader, import("mysql2").ResultSetHeader>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateAddress: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        fullName: import("zod").ZodString;
        addressLine1: import("zod").ZodString;
        addressLine2: import("zod").ZodOptional<import("zod").ZodString>;
        city: import("zod").ZodString;
        state: import("zod").ZodString;
        zipCode: import("zod").ZodString;
        country: import("zod").ZodString;
        phone: import("zod").ZodOptional<import("zod").ZodString>;
        latitude: import("zod").ZodOptional<import("zod").ZodString>;
        longitude: import("zod").ZodOptional<import("zod").ZodString>;
        instructions: import("zod").ZodOptional<import("zod").ZodString>;
        isDefault: import("zod").ZodDefault<import("zod").ZodBoolean>;
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteAddress: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getProductReviews: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        productId: string;
        orderId: string | null;
        rating: number;
        title: string | null;
        comment: string | null;
        pros: string | null;
        cons: string | null;
        images: string[] | null;
        isVerifiedPurchase: boolean | null;
        helpful: number | null;
        notHelpful: number | null;
        isApproved: boolean | null;
        size: string | null;
        color: string | null;
        variant: string | null;
        wouldRecommend: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        userName: string | null;
        userImage: string | null;
    }[], {
        id: string;
        userId: string;
        productId: string;
        orderId: string | null;
        rating: number;
        title: string | null;
        comment: string | null;
        pros: string | null;
        cons: string | null;
        images: string[] | null;
        isVerifiedPurchase: boolean | null;
        helpful: number | null;
        notHelpful: number | null;
        isApproved: boolean | null;
        size: string | null;
        color: string | null;
        variant: string | null;
        wouldRecommend: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        userName: string | null;
        userImage: string | null;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    addReview: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
        rating: import("zod").ZodNumber;
        comment: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateReview: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        rating: import("zod").ZodNumber;
        comment: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteReview: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getAdminProducts: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_1> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        search: import("zod").ZodOptional<import("zod").ZodString>;
        category: import("zod").ZodOptional<import("zod").ZodString>;
        status: import("zod").ZodDefault<import("zod").ZodEnum<{
            active: "active";
            inactive: "inactive";
            all: "all";
        }>>;
        stockStatus: import("zod").ZodDefault<import("zod").ZodEnum<{
            in_stock: "in_stock";
            all: "all";
            low_stock: "low_stock";
            out_of_stock: "out_of_stock";
        }>>;
        page: import("zod").ZodDefault<import("zod").ZodNumber>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
        sortBy: import("zod").ZodDefault<import("zod").ZodEnum<{
            name: "name";
            createdAt: "createdAt";
            price: "price";
            stock: "stock";
        }>>;
        sortOrder: import("zod").ZodDefault<import("zod").ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        products: {
            stats: {
                variantCount: number;
                totalVariantStock: number;
                mediaCount: number;
                alertCount: number;
                stockStatus: string;
            };
            id: string;
            name: string;
            slug: string;
            description: string | null;
            sku: string | null;
            price: string;
            originalPrice: string | null;
            discount: number | null;
            stockQuantity: number | null;
            lowStockThreshold: number | null;
            weight: string | null;
            isActive: boolean | null;
            isFeatured: boolean | null;
            isDigital: boolean | null;
            inStock: boolean | null;
            sizes: string[] | null;
            tags: string[] | null;
            colorImages: Record<string, string[]> | null;
            variantStock: Record<string, number> | null;
            categoryId: string | null;
            categoryName: string | null;
            warehouseId: string | null;
            warehouseName: string | null;
            rating: string | null;
            reviewCount: number | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }, {
        products: {
            stats: {
                variantCount: number;
                totalVariantStock: number;
                mediaCount: number;
                alertCount: number;
                stockStatus: string;
            };
            id: string;
            name: string;
            slug: string;
            description: string | null;
            sku: string | null;
            price: string;
            originalPrice: string | null;
            discount: number | null;
            stockQuantity: number | null;
            lowStockThreshold: number | null;
            weight: string | null;
            isActive: boolean | null;
            isFeatured: boolean | null;
            isDigital: boolean | null;
            inStock: boolean | null;
            sizes: string[] | null;
            tags: string[] | null;
            colorImages: Record<string, string[]> | null;
            variantStock: Record<string, number> | null;
            categoryId: string | null;
            categoryName: string | null;
            warehouseId: string | null;
            warehouseName: string | null;
            rating: string | null;
            reviewCount: number | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createProduct: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_2> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        name: import("zod").ZodString;
        slug: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        price: import("zod").ZodString;
        originalPrice: import("zod").ZodOptional<import("zod").ZodString>;
        categoryId: import("zod").ZodOptional<import("zod").ZodString>;
        warehouseId: import("zod").ZodOptional<import("zod").ZodString>;
        sku: import("zod").ZodOptional<import("zod").ZodString>;
        stockQuantity: import("zod").ZodDefault<import("zod").ZodNumber>;
        lowStockThreshold: import("zod").ZodDefault<import("zod").ZodNumber>;
        discount: import("zod").ZodDefault<import("zod").ZodNumber>;
        weight: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodDefault<import("zod").ZodBoolean>;
        isFeatured: import("zod").ZodDefault<import("zod").ZodBoolean>;
        isDigital: import("zod").ZodDefault<import("zod").ZodBoolean>;
        inStock: import("zod").ZodDefault<import("zod").ZodBoolean>;
        sizes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        variantStock: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodNumber>>;
        reviewCount: import("zod").ZodDefault<import("zod").ZodNumber>;
        colorImages: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>>;
        variants: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            color: import("zod").ZodOptional<import("zod").ZodString>;
            size: import("zod").ZodOptional<import("zod").ZodString>;
            material: import("zod").ZodOptional<import("zod").ZodString>;
            price: import("zod").ZodOptional<import("zod").ZodString>;
            stockQuantity: import("zod").ZodDefault<import("zod").ZodNumber>;
            sku: import("zod").ZodString;
            images: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>;
        }, import("better-auth").$strip>>>;
        seo: import("zod").ZodOptional<import("zod").ZodObject<{
            metaTitle: import("zod").ZodOptional<import("zod").ZodString>;
            metaDescription: import("zod").ZodOptional<import("zod").ZodString>;
            metaKeywords: import("zod").ZodOptional<import("zod").ZodString>;
            ogTitle: import("zod").ZodOptional<import("zod").ZodString>;
            ogDescription: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("better-auth").$strip>>;
        attributes: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: string;
        originalPrice: string | null;
        colorImages: Record<string, string[]> | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        sizes: string[] | null;
        tags: string[] | null;
        variantStock: Record<string, number> | null;
        rating: string | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: string;
        originalPrice: string | null;
        colorImages: Record<string, string[]> | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        sizes: string[] | null;
        tags: string[] | null;
        variantStock: Record<string, number> | null;
        rating: string | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateProduct: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_3> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        data: import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodString>;
            slug: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            description: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            price: import("zod").ZodOptional<import("zod").ZodString>;
            originalPrice: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            categoryId: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            warehouseId: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            sku: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            stockQuantity: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            lowStockThreshold: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            discount: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            weight: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            isActive: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            isFeatured: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            isDigital: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            inStock: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            sizes: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>>;
            tags: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>>;
            variantStock: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodNumber>>>;
            reviewCount: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            colorImages: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>>>;
            variants: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                color: import("zod").ZodOptional<import("zod").ZodString>;
                size: import("zod").ZodOptional<import("zod").ZodString>;
                material: import("zod").ZodOptional<import("zod").ZodString>;
                price: import("zod").ZodOptional<import("zod").ZodString>;
                stockQuantity: import("zod").ZodDefault<import("zod").ZodNumber>;
                sku: import("zod").ZodString;
                images: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>;
            }, import("better-auth").$strip>>>>;
            seo: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodObject<{
                metaTitle: import("zod").ZodOptional<import("zod").ZodString>;
                metaDescription: import("zod").ZodOptional<import("zod").ZodString>;
                metaKeywords: import("zod").ZodOptional<import("zod").ZodString>;
                ogTitle: import("zod").ZodOptional<import("zod").ZodString>;
                ogDescription: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("better-auth").$strip>>>;
            attributes: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>>;
        }, import("better-auth").$strip>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: string;
        originalPrice: string | null;
        colorImages: Record<string, string[]> | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        sizes: string[] | null;
        tags: string[] | null;
        variantStock: Record<string, number> | null;
        rating: string | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        price: string;
        originalPrice: string | null;
        colorImages: Record<string, string[]> | null;
        categoryId: string | null;
        warehouseId: string | null;
        sku: string | null;
        sizes: string[] | null;
        tags: string[] | null;
        variantStock: Record<string, number> | null;
        rating: string | null;
        reviewCount: number | null;
        inStock: boolean | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        discount: number | null;
        weight: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        isDigital: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteProduct: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_4> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getProductAnalytics: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_5> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        productId: import("zod").ZodOptional<import("zod").ZodString>;
        period: import("zod").ZodDefault<import("zod").ZodEnum<{
            "7d": "7d";
            "30d": "30d";
            "90d": "90d";
            "1y": "1y";
        }>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        transactions: {
            date: string;
            type: string;
            quantity: number;
            count: number;
        }[];
        alerts: {
            alertType: string;
            count: number;
        }[];
        period: "7d" | "30d" | "90d" | "1y";
    }, {
        transactions: {
            date: string;
            type: string;
            quantity: number;
            count: number;
        }[];
        alerts: {
            alertType: string;
            count: number;
        }[];
        period: "7d" | "30d" | "90d" | "1y";
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getProductVariants: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_6> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        images: any;
        dimensions: any;
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        images: any;
        dimensions: any;
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createProductVariant: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_7> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
        sku: import("zod").ZodString;
        color: import("zod").ZodOptional<import("zod").ZodString>;
        size: import("zod").ZodOptional<import("zod").ZodString>;
        material: import("zod").ZodOptional<import("zod").ZodString>;
        price: import("zod").ZodOptional<import("zod").ZodString>;
        originalPrice: import("zod").ZodOptional<import("zod").ZodString>;
        stockQuantity: import("zod").ZodDefault<import("zod").ZodNumber>;
        lowStockThreshold: import("zod").ZodDefault<import("zod").ZodNumber>;
        weight: import("zod").ZodOptional<import("zod").ZodString>;
        dimensions: import("zod").ZodOptional<import("zod").ZodObject<{
            length: import("zod").ZodNumber;
            width: import("zod").ZodNumber;
            height: import("zod").ZodNumber;
        }, import("better-auth").$strip>>;
        images: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>;
        isActive: import("zod").ZodDefault<import("zod").ZodBoolean>;
        isDefault: import("zod").ZodDefault<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        dimensions: {
            length: number;
            width: number;
            height: number;
        } | null;
        images: string[] | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        dimensions: {
            length: number;
            width: number;
            height: number;
        } | null;
        images: string[] | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateProductVariant: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_8> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        data: import("zod").ZodObject<{
            isActive: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            price: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            originalPrice: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            sku: import("zod").ZodOptional<import("zod").ZodString>;
            stockQuantity: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            lowStockThreshold: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            weight: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            isDefault: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
            size: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            color: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            images: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodCustom<import("buffer").File, import("buffer").File>]>>>>;
            material: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
            dimensions: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodObject<{
                length: import("zod").ZodNumber;
                width: import("zod").ZodNumber;
                height: import("zod").ZodNumber;
            }, import("better-auth").$strip>>>;
        }, import("better-auth").$strip>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        dimensions: {
            length: number;
            width: number;
            height: number;
        } | null;
        images: string[] | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        productId: string;
        sku: string;
        color: string | null;
        size: string | null;
        material: string | null;
        price: string | null;
        originalPrice: string | null;
        stockQuantity: number | null;
        lowStockThreshold: number | null;
        weight: string | null;
        dimensions: {
            length: number;
            width: number;
            height: number;
        } | null;
        images: string[] | null;
        isActive: boolean | null;
        isDefault: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteProductVariant: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_9> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    bulkUpdateVariantStock: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_10> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        updates: import("zod").ZodArray<import("zod").ZodObject<{
            variantId: import("zod").ZodString;
            stockQuantity: import("zod").ZodNumber;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("better-auth").$strip>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        results: {
            variantId: string;
            previousStock: number;
            newStock: number;
            difference: number;
        }[];
    }, {
        success: boolean;
        results: {
            variantId: string;
            previousStock: number;
            newStock: number;
            difference: number;
        }[];
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getInventoryTransactions: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_11> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        productId: import("zod").ZodOptional<import("zod").ZodString>;
        variantId: import("zod").ZodOptional<import("zod").ZodString>;
        type: import("zod").ZodOptional<import("zod").ZodEnum<{
            purchase: "purchase";
            transfer: "transfer";
            adjustment: "adjustment";
            sale: "sale";
            return: "return";
            damage: "damage";
        }>>;
        startDate: import("zod").ZodOptional<import("zod").ZodString>;
        endDate: import("zod").ZodOptional<import("zod").ZodString>;
        page: import("zod").ZodDefault<import("zod").ZodNumber>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        transactions: {
            id: string;
            productId: string;
            productName: string | null;
            variantId: string | null;
            type: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            unitCost: string | null;
            totalCost: string | null;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
            notes: string | null;
            batchNumber: string | null;
            expiryDate: Date | null;
            performedBy: string | null;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }, {
        transactions: {
            id: string;
            productId: string;
            productName: string | null;
            variantId: string | null;
            type: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            unitCost: string | null;
            totalCost: string | null;
            referenceType: string | null;
            referenceId: string | null;
            reason: string | null;
            notes: string | null;
            batchNumber: string | null;
            expiryDate: Date | null;
            performedBy: string | null;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createInventoryAdjustment: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_12> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        productId: import("zod").ZodString;
        variantId: import("zod").ZodOptional<import("zod").ZodString>;
        quantity: import("zod").ZodNumber;
        reason: import("zod").ZodString;
        notes: import("zod").ZodOptional<import("zod").ZodString>;
        unitCost: import("zod").ZodOptional<import("zod").ZodString>;
        batchNumber: import("zod").ZodOptional<import("zod").ZodString>;
        expiryDate: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        newStock: number;
        previousStock: number;
    }, {
        success: boolean;
        newStock: number;
        previousStock: number;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getStockAlerts: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_13> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        alertType: import("zod").ZodOptional<import("zod").ZodEnum<{
            low_stock: "low_stock";
            out_of_stock: "out_of_stock";
            overstock: "overstock";
            expiry: "expiry";
        }>>;
        isResolved: import("zod").ZodOptional<import("zod").ZodBoolean>;
        page: import("zod").ZodDefault<import("zod").ZodNumber>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        alerts: {
            id: string;
            productId: string;
            productName: string | null;
            variantId: string | null;
            alertType: string;
            threshold: number | null;
            currentStock: number | null;
            message: string | null;
            isResolved: boolean | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }, {
        alerts: {
            id: string;
            productId: string;
            productName: string | null;
            variantId: string | null;
            alertType: string;
            threshold: number | null;
            currentStock: number | null;
            message: string | null;
            isResolved: boolean | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    resolveStockAlert: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_14> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        alertId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    generateStockReport: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_15> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        includeVariants: import("zod").ZodDefault<import("zod").ZodBoolean>;
        lowStockOnly: import("zod").ZodDefault<import("zod").ZodBoolean>;
        categoryId: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        summary: {
            totalProducts: number;
            lowStockProducts: number;
            outOfStockProducts: number;
            totalStockValue: string;
        };
        products: {
            id: string;
            name: string;
            sku: string | null;
            stockQuantity: number | null;
            lowStockThreshold: number | null;
            price: string;
            inStock: boolean | null;
        }[];
        variants: any[];
        generatedAt: Date;
    }, {
        summary: {
            totalProducts: number;
            lowStockProducts: number;
            outOfStockProducts: number;
            totalStockValue: string;
        };
        products: {
            id: string;
            name: string;
            sku: string | null;
            stockQuantity: number | null;
            lowStockThreshold: number | null;
            price: string;
            inStock: boolean | null;
        }[];
        variants: any[];
        generatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminGetCategories: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        search: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminCreateCategory: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_16> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        image: import("zod").ZodOptional<import("zod").ZodCustom<import("buffer").File, import("buffer").File>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminUpdateCategory: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_17> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        image: import("zod").ZodOptional<import("zod").ZodCustom<import("buffer").File, import("buffer").File>>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminDeleteCategory: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_18> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getWarehouses: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getWarehouse: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createWarehouse: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        name: import("zod").ZodString;
        address: import("zod").ZodString;
        latitude: import("zod").ZodNumber;
        longitude: import("zod").ZodNumber;
        phone: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean;
    }, {
        id: string;
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        phone: string | null;
        isActive: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateWarehouse: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        address: import("zod").ZodOptional<import("zod").ZodString>;
        latitude: import("zod").ZodOptional<import("zod").ZodNumber>;
        longitude: import("zod").ZodOptional<import("zod").ZodNumber>;
        phone: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteWarehouse: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getDeliveryBoys: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        isActive: boolean | null;
        isAvailable: boolean | null;
        totalDeliveries: number | null;
        currentAssignedOrders: number | null;
        rating: string | null;
        notes: string | null;
        createdAt: Date;
    }[], {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        isActive: boolean | null;
        isAvailable: boolean | null;
        totalDeliveries: number | null;
        currentAssignedOrders: number | null;
        rating: string | null;
        notes: string | null;
        createdAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        phone: string;
        password: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        isActive: boolean | null;
        isAvailable: boolean | null;
        totalDeliveries: number | null;
        currentAssignedOrders: number | null;
        rating: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        phone: string;
        password: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        isActive: boolean | null;
        isAvailable: boolean | null;
        totalDeliveries: number | null;
        currentAssignedOrders: number | null;
        rating: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        name: import("zod").ZodString;
        phone: import("zod").ZodString;
        password: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
        photo: import("zod").ZodOptional<import("zod").ZodString>;
        vehicleType: import("zod").ZodOptional<import("zod").ZodString>;
        vehiclePlateNumber: import("zod").ZodOptional<import("zod").ZodString>;
        warehouseId: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
        isAvailable: import("zod").ZodOptional<import("zod").ZodBoolean>;
        notes: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        name: string;
        phone: string;
        password: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        isActive: boolean;
        isAvailable: boolean;
        notes: string | null;
        totalDeliveries: number;
        currentAssignedOrders: number;
        rating: string;
    }, {
        id: string;
        name: string;
        phone: string;
        password: string;
        email: string | null;
        photo: string | null;
        vehicleType: string | null;
        vehiclePlateNumber: string | null;
        warehouseId: string | null;
        isActive: boolean;
        isAvailable: boolean;
        notes: string | null;
        totalDeliveries: number;
        currentAssignedOrders: number;
        rating: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        phone: import("zod").ZodOptional<import("zod").ZodString>;
        password: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
        photo: import("zod").ZodOptional<import("zod").ZodString>;
        vehicleType: import("zod").ZodOptional<import("zod").ZodString>;
        vehiclePlateNumber: import("zod").ZodOptional<import("zod").ZodString>;
        warehouseId: import("zod").ZodOptional<import("zod").ZodString>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
        isAvailable: import("zod").ZodOptional<import("zod").ZodBoolean>;
        notes: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getDeliveryBoyStats: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        total: number;
        active: number;
        available: number;
        onDelivery: number;
    } | undefined, {
        total: number;
        active: number;
        available: number;
        onDelivery: number;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    assignDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        deliveryBoyId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getAdminOrders: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        orderNumber: string;
        userId: string;
        userName: string | null;
        userEmail: string | null;
        status: string;
        total: string;
        currency: string | null;
        paymentStatus: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        deliveryBoyName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        orderNumber: string;
        userId: string;
        userName: string | null;
        userEmail: string | null;
        status: string;
        total: string;
        currency: string | null;
        paymentStatus: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        deliveryBoyName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getAdminOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            color: string | null;
            size: string | null;
            productName: string;
            productImage: string | null;
        }[];
        id: string;
        orderNumber: string;
        userId: string;
        userName: string | null;
        userEmail: string | null;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        paymentStatus: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        deliveryBoyName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            color: string | null;
            size: string | null;
            productName: string;
            productImage: string | null;
        }[];
        id: string;
        orderNumber: string;
        userId: string;
        userName: string | null;
        userEmail: string | null;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        paymentStatus: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        deliveryBoyName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminAssignDeliveryBoy: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        deliveryBoyId: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminUpdateOrderStatus: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodObject<{
        orderId: import("zod").ZodString;
        status: import("zod").ZodEnum<{
            returned: "returned";
            pending: "pending";
            delivered: "delivered";
            processing: "processing";
            shipped: "shipped";
            cancelled: "cancelled";
            confirmed: "confirmed";
            packed: "packed";
            out_for_delivery: "out_for_delivery";
            refunded: "refunded";
        }>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getLogFiles: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<string[], string[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getLogContent: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<any[], any[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getErrorFiles: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<string[], string[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getErrorContent: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<Record<never, never>, never> & Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user">, Record<never, never>>, Omit<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }>, "user"> & Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<any, any>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getDashboardStats: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        stats: {
            totalProducts: number | undefined;
            totalCategories: number | undefined;
            totalOrders: number | undefined;
            totalUsers: number | undefined;
            totalRevenue: number;
            recentOrders: number;
            lowStockProducts: number;
        };
        topProducts: {
            id: string;
            name: string;
            price: string;
            stockQuantity: number | null;
        }[];
        monthlySales: {
            month: string;
            sales: number;
            orders: number;
        }[];
    }, {
        stats: {
            totalProducts: number | undefined;
            totalCategories: number | undefined;
            totalOrders: number | undefined;
            totalUsers: number | undefined;
            totalRevenue: number;
            recentOrders: number;
            lowStockProducts: number;
        };
        topProducts: {
            id: string;
            name: string;
            price: string;
            stockQuantity: number | null;
        }[];
        monthlySales: {
            month: string;
            sales: number;
            orders: number;
        }[];
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getHelpArticles: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        category: import("zod").ZodOptional<import("zod").ZodString>;
        search: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getHelpArticle: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, {
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminGetHelpArticles: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    createHelpArticle: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_19> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        title: import("zod").ZodString;
        content: import("zod").ZodString;
        category: import("zod").ZodString;
        image: import("zod").ZodOptional<import("zod").ZodAny>;
        order: import("zod").ZodDefault<import("zod").ZodNumber>;
        isActive: import("zod").ZodDefault<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateHelpArticle: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_20> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
        title: import("zod").ZodOptional<import("zod").ZodString>;
        content: import("zod").ZodOptional<import("zod").ZodString>;
        category: import("zod").ZodOptional<import("zod").ZodString>;
        image: import("zod").ZodOptional<import("zod").ZodAny>;
        order: import("zod").ZodOptional<import("zod").ZodNumber>;
        isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined, {
        id: string;
        title: string;
        content: string;
        category: string;
        image: string | null;
        order: number | null;
        isActive: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteHelpArticle: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_21> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    getAppSettings: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<Record<string, string>, Record<string, string>>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    adminGetAppSettings: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date;
    }[], {
        id: string;
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    updateAppSetting: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_22> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        key: import("zod").ZodString;
        value: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date;
    } | undefined, {
        id: string;
        key: string;
        value: string;
        description: string | null;
        updatedAt: Date;
    } | undefined>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    bulkUpdateAppSettings: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_23> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodString>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    deleteAppSetting: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext_24> & {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: string;
            emailVerified?: boolean;
        };
        session: {
            id: string;
            userId: string;
            expiresAt: Date;
        } | undefined;
        role: string | undefined;
    }, import("zod").ZodObject<{
        key: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
    }, {
        success: boolean;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appLogin: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        password: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
    } | {
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
        };
        error?: never;
    }, {
        success: boolean;
        error: string;
    } | {
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
        };
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appSendRegisterOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        password: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        message?: never;
        expiresAt?: never;
    } | {
        success: boolean;
        message: string;
        expiresAt: Date;
        error?: never;
    }, {
        success: boolean;
        error: string;
        message?: never;
        expiresAt?: never;
    } | {
        success: boolean;
        message: string;
        expiresAt: Date;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appVerifyRegisterOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        otp: import("zod").ZodString;
        password: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string;
            phoneNumberVerified: boolean;
            role: string;
        };
        success?: never;
        error?: never;
    }, {
        success: boolean;
        error: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string;
            phoneNumberVerified: boolean;
            role: string;
        };
        success?: never;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetSession: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        token: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        user?: never;
    } | {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
        success?: never;
        error?: never;
    }, {
        success: boolean;
        error: string;
        user?: never;
    } | {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
        success?: never;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appRefreshToken: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        refreshToken: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<import("../utils/jwt.js").TokenPair | {
        success: boolean;
        error: string;
    }, import("../utils/jwt.js").TokenPair | {
        success: boolean;
        error: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appLogout: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        success: boolean;
        message: string;
    }, {
        success: boolean;
        message: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appSendResetPasswordOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        message: string;
        expiresAt?: never;
    } | {
        success: boolean;
        message: string;
        expiresAt: Date;
    }, {
        success: boolean;
        message: string;
        expiresAt?: never;
    } | {
        success: boolean;
        message: string;
        expiresAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appVerifyResetPasswordOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        otp: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        message?: never;
    } | {
        success: boolean;
        message: string;
        error?: never;
    }, {
        success: boolean;
        error: string;
        message?: never;
    } | {
        success: boolean;
        message: string;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appResetPassword: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        otp: import("zod").ZodString;
        newPassword: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        message?: never;
    } | {
        success: boolean;
        message: string;
        error?: never;
    }, {
        success: boolean;
        error: string;
        message?: never;
    } | {
        success: boolean;
        message: string;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appDeleteAccount: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        password: import("zod").ZodString;
        confirmation: import("zod").ZodLiteral<"DELETE">;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        message: string;
    }, {
        success: boolean;
        message: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appResendRegisterOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        message: string;
        expiresAt: Date;
    }, {
        success: boolean;
        message: string;
        expiresAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appResendResetPasswordOTP: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        message: string;
        expiresAt: Date;
    }, {
        success: boolean;
        message: string;
        expiresAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appUpdateProfile: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        name: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
        image: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        message?: never;
        user?: never;
    } | {
        success: boolean;
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
        };
        error?: never;
    }, {
        success: boolean;
        error: string;
        message?: never;
        user?: never;
    } | {
        success: boolean;
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
        };
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetProfile: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, {
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appUploadAvatar: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodAny, import("@orpc/contract").Schema<{
        success: boolean;
        error: string;
        imageUrl?: never;
    } | {
        success: boolean;
        imageUrl: string;
        error?: never;
    }, {
        success: boolean;
        error: string;
        imageUrl?: never;
    } | {
        success: boolean;
        imageUrl: string;
        error?: never;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetOrders: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            productName: string;
            productImage: string | null;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            size: string | null;
            color: string | null;
            variant: string | null;
            sku: string | null;
            weight: string | null;
            customizations: Record<string, any> | null;
            giftMessage: string | null;
            isGift: string | null;
            returnStatus: string | null;
            returnReason: string | null;
            createdAt: Date;
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }[], {
        items: {
            id: string;
            orderId: string;
            productId: string;
            productName: string;
            productImage: string | null;
            quantity: number;
            unitPrice: string;
            totalPrice: string;
            size: string | null;
            color: string | null;
            variant: string | null;
            sku: string | null;
            weight: string | null;
            customizations: Record<string, any> | null;
            giftMessage: string | null;
            isGift: string | null;
            returnStatus: string | null;
            returnReason: string | null;
            createdAt: Date;
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<{
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            product: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                price: string;
                originalPrice: string | null;
                colorImages: Record<string, string[]> | null;
                categoryId: string | null;
                warehouseId: string | null;
                sku: string | null;
                sizes: string[] | null;
                tags: string[] | null;
                variantStock: Record<string, number> | null;
                rating: string | null;
                reviewCount: number | null;
                inStock: boolean | null;
                stockQuantity: number | null;
                lowStockThreshold: number | null;
                discount: number | null;
                weight: string | null;
                isActive: boolean | null;
                isFeatured: boolean | null;
                isDigital: boolean | null;
                createdAt: Date;
                updatedAt: Date;
            };
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }, {
        items: {
            id: string;
            quantity: number;
            unitPrice: string;
            product: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                price: string;
                originalPrice: string | null;
                colorImages: Record<string, string[]> | null;
                categoryId: string | null;
                warehouseId: string | null;
                sku: string | null;
                sizes: string[] | null;
                tags: string[] | null;
                variantStock: Record<string, number> | null;
                rating: string | null;
                reviewCount: number | null;
                inStock: boolean | null;
                stockQuantity: number | null;
                lowStockThreshold: number | null;
                discount: number | null;
                weight: string | null;
                isActive: boolean | null;
                isFeatured: boolean | null;
                isDigital: boolean | null;
                createdAt: Date;
                updatedAt: Date;
            };
        }[];
        id: string;
        userId: string;
        orderNumber: string;
        status: string;
        subtotal: string;
        tax: string | null;
        shipping: string | null;
        discount: string | null;
        total: string;
        currency: string | null;
        shippingAddressId: string | null;
        billingAddressId: string | null;
        paymentMethodId: string | null;
        paymentStatus: string | null;
        shippingMethod: string | null;
        trackingNumber: string | null;
        courierService: string | null;
        deliveryBoy: boolean | null;
        deliveryBoyId: string | null;
        estimatedDelivery: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        notes: string | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appCreateOrder: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodObject<{
        shippingAddress: import("zod").ZodString;
        paymentMethodId: import("zod").ZodString;
    }, import("better-auth").$strip>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        orderNumber: string;
        subtotal: string;
        total: string;
        currency: string;
        status: "pending";
        shippingAddressId: string;
        paymentMethodId: null;
        paymentStatus: string;
        notes: string;
    }, {
        id: string;
        userId: string;
        orderNumber: string;
        subtotal: string;
        total: string;
        currency: string;
        status: "pending";
        shippingAddressId: string;
        paymentMethodId: null;
        paymentStatus: string;
        notes: string;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetNotifications: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        id: string;
        userId: string;
        type: string;
        category: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        actionText: string | null;
        image: string | null;
        icon: string | null;
        priority: string | null;
        read: boolean | null;
        readAt: Date | null;
        delivered: boolean | null;
        deliveredAt: Date | null;
        data: Record<string, any> | null;
        expiresAt: Date | null;
        createdAt: Date;
    }[], {
        id: string;
        userId: string;
        type: string;
        category: string | null;
        title: string;
        message: string;
        actionUrl: string | null;
        actionText: string | null;
        image: string | null;
        icon: string | null;
        priority: string | null;
        read: boolean | null;
        readAt: Date | null;
        delivered: boolean | null;
        deliveredAt: Date | null;
        data: Record<string, any> | null;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appGetUnreadCount: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        count: number;
    }, {
        count: number;
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appMarkAsRead: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("zod").ZodString, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    appMarkAllAsRead: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never> & Omit<{
        request?: Request;
    } & Record<never, never>, never>, Record<never, never>>, Omit<Record<never, never>, keyof UOutContext> & {
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            phoneNumberVerified: boolean | null;
            image: string | null;
            role: string | null;
            banned: false | null;
        };
    }, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<import("drizzle-orm/mysql2").MySqlRawQueryResult, import("drizzle-orm/mysql2").MySqlRawQueryResult>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
    handshake: import("@orpc/server").Procedure<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
        service: string;
        version: string;
        env: string;
        auth: {
            login: string | undefined;
            register: string | undefined;
            forgotPassword: string | undefined;
            otp: boolean;
        };
        stats: {
            totalUsers: string;
            recentUsers: {
                name: string;
                avatar: null;
            }[];
        };
    }, {
        service: string;
        version: string;
        env: string;
        auth: {
            login: string | undefined;
            register: string | undefined;
            forgotPassword: string | undefined;
            otp: boolean;
        };
        stats: {
            totalUsers: string;
            recentUsers: {
                name: string;
                avatar: null;
            }[];
        };
    }>, import("@orpc/contract").MergedErrorMap<Record<never, never>, Record<never, never>>, Record<never, never>>;
};
export type AppRouter = typeof router;
//# sourceMappingURL=_app.d.ts.map