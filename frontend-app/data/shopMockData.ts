export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    rating: 4.5,
    reviews: 128,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation.',
    inStock: true,
    discount: 23,
    colors: ['#000000', '#FFFFFF', '#FF0000']
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    rating: 4.3,
    reviews: 89,
    category: 'Electronics',
    description: 'Feature-rich smartwatch with health monitoring.',
    inStock: true,
    discount: 20,
    colors: ['#000000', '#C0C0C0', '#FFD700']
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    rating: 4.7,
    reviews: 203,
    category: 'Shoes',
    description: 'Comfortable running shoes for daily workouts.',
    inStock: true,
    discount: 20,
    colors: ['#0000FF', '#000000', '#FFFFFF']
  },
  {
    id: '4',
    name: 'Backpack',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    rating: 4.2,
    reviews: 156,
    category: 'Bags',
    description: 'Durable backpack perfect for travel and work.',
    inStock: true,
    discount: 29,
    colors: ['#8B4513', '#000000', '#228B22']
  }

];

export const mockCartItems = [
  {
    id: '1',
    productId: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    quantity: 1,
    size: 'One Size',
    color: 'Black'
  },
  {
    id: '2',
    productId: '3',
    name: 'Running Shoes',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    quantity: 2,
    size: '42',
    color: 'Blue'
  }
];

export const mockSearchHistory = [
  'Wireless Headphones',
  'Running Shoes',
  'Smart Watch'
];

export const mockPopularSearches = [
  { term: 'Electronics', color: '#E3F2FD' },
  { term: 'Shoes', color: '#F3E5F5' },
  { term: 'Bags', color: '#E8F5E8' },
  { term: 'Watches', color: '#FFF3E0' }
];