export declare const deliveryBoyWarehouses: import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
    name: "delivery_boy_warehouses";
    schema: undefined;
    columns: {
        deliveryBoyId: import("drizzle-orm/mysql-core").MySqlColumn<{
            name: "delivery_boy_id";
            tableName: "delivery_boy_warehouses";
            dataType: "string";
            columnType: "MySqlVarChar";
            data: string;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        warehouseId: import("drizzle-orm/mysql-core").MySqlColumn<{
            name: "warehouse_id";
            tableName: "delivery_boy_warehouses";
            dataType: "string";
            columnType: "MySqlVarChar";
            data: string;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/mysql-core").MySqlColumn<{
            name: "created_at";
            tableName: "delivery_boy_warehouses";
            dataType: "date";
            columnType: "MySqlTimestamp";
            data: Date;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "mysql";
}>;
export declare const deliveryBoyWarehousesRelations: import("drizzle-orm").Relations<"delivery_boy_warehouses", {
    deliveryBoy: import("drizzle-orm").One<"delivery_boys", true>;
    warehouse: import("drizzle-orm").One<"warehouses", true>;
}>;
//# sourceMappingURL=delivery-boy-warehouses.d.ts.map