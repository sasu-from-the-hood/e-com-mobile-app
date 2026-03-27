export declare const getDashboardStats: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
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
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=dashboard.d.ts.map