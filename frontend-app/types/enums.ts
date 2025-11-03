export enum ProductCategory {
  BAG = "Bag",
  SHOES = "Shoes", 
  WATCH = "Watch",
  CLOTHES = "Clothes",
  ELECTRONIC = "Electronic",
  ACCESSORIES = "Accessories"
}

export enum PaymentMethod {
  MASTER_CARD = "Master Card",
  VISA = "Visa",
  PAYPAL = "PayPal",
  APPLE_PAY = "Apple Pay"
}

export enum OrderStatus {
  PLACED = "Order Placed",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

export enum NotificationType {
  ORDER_UPDATE = "Order Update",
  PROMOTIONAL = "Promotional",
  SYSTEM = "System"
}