# E-Commerce Shop Features

This document describes the newly implemented e-commerce shopping features in the mobile app.

## Screens

### 1. Shop Home (`/shop-home`)
- **Search Bar**: Tap to navigate to search screen
- **Filter Button**: Opens filtering options
- **Promotional Banner**: Dismissible 25% off banner
- **Category Filters**: Horizontal scrollable chips (All, Bag, Shoes, Watch, Clothes, Electronic, Accessories)
- **Product Grid**: 2-column grid of product cards
- **Features**:
  - Category filtering
  - Product card navigation to detail page
  - Responsive layout

### 2. Search Screen (`/shop-search`)
- **Search Input**: Auto-focused search bar with clear button
- **Last Search**: History of recent searches with clear all option
- **Popular Search**: Colored chips for trending searches
- **Features**:
  - Search history management
  - Popular search suggestions

### 3. Product Detail (`/product-detail`)
- **Product Image**: Full-width hero image
- **Product Info**: Name, price, rating
- **Color Selector**: Interactive color dots
- **Description**: Full product description
- **Add to Cart Button**: Fixed footer with price and action button
- **Features**:
  - Color variant selection
  - Add to cart functionality

### 4. Shopping Cart (`/shop-cart`)
- **Cart Items**: List of added products with images
- **Quantity Controls**: +/- buttons for each item
- **Subtotal**: Auto-calculated total
- **Checkout Button**: Navigate to address selection
- **Features**:
  - Real-time quantity updates
  - Price calculation
  - Remove items (quantity to 0)

### 5. Checkout (`/shop-checkout`)
- **Address Selection**: List of saved addresses with radio buttons
- **Continue Button**: Proceed to payment
- **Features**:
  - Address selection
  - Default address indicator

### 6. Payment (`/shop-payment`)
- **Payment Methods**: List of saved cards with radio buttons
- **Confirm Button**: Place order
- **Features**:
  - Payment method selection
  - Order confirmation alert

## Components

### Reusable Components
- `ProductCard`: Product display with image, name, price
- `CategoryChip`: Filter chip with active state
- `QuantityControl`: +/- buttons with quantity display
- `CartItem`: Cart item with image, info, and controls
- `RadioButton`: Custom radio button for selections
- `AddressCard`: Address display with selection
- `PaymentCard`: Payment method display with selection

## Data Structure

### Types
- `Product`: Product information
- `CartItem`: Cart item with quantity
- `Address`: Delivery address
- `PaymentMethodData`: Payment card information
- `PopularSearch`: Search suggestion with color

### Mock Data
All mock data is stored in `/data/shopMockData.ts`:
- `mockProducts`: Sample products
- `mockCartItems`: Cart items
- `mockAddresses`: Saved addresses
- `mockPaymentMethods`: Payment methods
- `mockSearchHistory`: Recent searches
- `mockPopularSearches`: Popular search terms

## Theme
Custom theme defined in `/constants/app-theme.ts`:
- Primary color: #5B4CCC (Purple)
- Consistent spacing, border radius, and typography
- Light mode optimized

## Navigation Flow
```
Shop Home → Product Detail → Cart → Checkout → Payment → Confirmation
     ↓
  Search
```

## Icons
Using `lucide-react-native` for all icons:
- Search, Filter, Heart, Bell
- Home, Category, Cart
- Plus, Minus, Close
- Location, ChevronRight, ChevronDown

## Future Enhancements
- Product filtering by price, rating
- Wishlist functionality
- Order history
- User profile
- Product reviews
- Image gallery carousel
- Search results page
- Bottom tab navigation