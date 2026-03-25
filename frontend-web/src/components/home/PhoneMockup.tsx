import { Iphone16Pro } from "@/components/ui/iphone-16-pro";
import { ShoppingBag, ArrowLeft, Heart, Star } from "lucide-react";
import { useState } from "react";

interface PhoneMockupProps {
  type: "product" | "cart" | "home";
  className?: string;
}

export function PhoneMockup({ type, className = "" }: PhoneMockupProps) {
  const [selectedColor, setSelectedColor] = useState('pink');
  const [cartItems] = useState([
    { id: 1, name: 'Minimalist Chair', price: 235, color: 'bg-pink-300', quantity: 1 },
    { id: 2, name: 'Modern Lamp', price: 89, color: 'bg-blue-300', quantity: 2 },
  ]);

  const colors = [
    { name: 'pink', bg: 'bg-pink-300', border: 'border-pink-400' },
    { name: 'black', bg: 'bg-gray-800', border: 'border-gray-900' },
    { name: 'blue', bg: 'bg-blue-800', border: 'border-blue-900' }
  ];

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Create a unique clipPath ID for each phone instance
  const clipPathId = `phone-screen-${type}-${Math.random().toString(36).substr(2, 9)}`;

  const renderContent = () => {
    switch (type) {
      case "product":
        return (
          <div className="w-full h-full flex flex-col">
            {/* Status Bar */}
            <div className="h-8 flex items-center justify-center">
              <div className="w-16 h-2 bg-black rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-sm">Product</span>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center relative">
                <ShoppingBag className="w-3 h-3 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </div>
            </div>
            
            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-lg p-3 mx-3 flex-1">
              {/* Product Image */}
              <div className={`w-full h-24 bg-gradient-to-br ${selectedColor === 'pink' ? 'from-pink-200 to-pink-300' : selectedColor === 'blue' ? 'from-blue-300 to-blue-400' : 'from-gray-700 to-gray-800'} rounded-xl mb-3 flex items-center justify-center relative overflow-hidden`}>
                <div className={`w-8 h-12 ${selectedColor === 'pink' ? 'bg-pink-400' : selectedColor === 'blue' ? 'bg-blue-600' : 'bg-gray-900'} rounded-lg transform rotate-12 opacity-80`} />
                <button className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Heart className="w-2 h-2 text-red-500" />
                </button>
              </div>
              
              {/* Product Info */}
              <div className="text-red-500 text-lg font-bold mb-1">Birr 115.00</div>
              <div className="font-bold text-gray-800 text-xs mb-1">Minimal Chair</div>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(4.8)</span>
              </div>
              
              {/* Color Options */}
              <div className="flex space-x-1 mb-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-4 h-4 ${color.bg} rounded-full border ${selectedColor === color.name ? color.border + ' ring-1 ring-offset-1 ring-gray-400' : 'border-transparent'}`}
                  />
                ))}
              </div>
              
              {/* Add to Cart Button */}
              <button className="w-full bg-gray-900 text-white rounded-xl py-2 text-xs font-semibold">
                Add to Cart
              </button>
            </div>
          </div>
        );

      case "cart":
        return (
          <div className="w-full h-full flex flex-col">
            {/* Status Bar */}
            <div className="h-8 flex items-center justify-center">
              <div className="w-16 h-2 bg-black rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-sm">Cart</span>
              <div className="w-5" />
            </div>
            
            {/* Cart Items */}
            <div className="space-y-2 mb-4 px-3 flex-1 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-2 flex items-center space-x-2 shadow-sm">
                  <div className={`w-8 h-8 ${item.color} rounded-lg`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{item.name}</div>
                    <div className="text-red-500 font-bold text-xs">Birr{item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                      -
                    </button>
                    <span className="text-gray-600 text-xs w-3 text-center">{item.quantity}</span>
                    <button className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="bg-white rounded-xl p-3 mb-3 mx-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">Birr{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">Free</span>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-red-500">Birr{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <div className="px-3 pb-3">
              <button className="w-full bg-gray-900 text-white rounded-xl py-2 text-xs font-semibold">
                Checkout
              </button>
            </div>
          </div>
        );

      case "home":
        return (
          <div className="w-full h-full flex flex-col">
            {/* Status Bar */}
            <div className="h-8 flex items-center justify-center">
              <div className="w-16 h-2 bg-black rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-gray-500 text-xs">Good Morning</div>
                <div className="font-bold text-gray-800 text-sm">Welcome Back!</div>
              </div>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center relative">
                <ShoppingBag className="w-3 h-3 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 mb-3 mx-3 shadow-sm">
              <div className="text-gray-400 text-xs">Search products...</div>
            </div>
            
            {/* Categories */}
            <div className="flex space-x-1 mb-3 px-3">
              {['All', 'Furniture', 'Electronics'].map((category) => (
                <div key={category} className={`px-2 py-1 rounded-full text-xs font-medium ${category === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600'}`}>
                  {category}
                </div>
              ))}
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-2 px-3 flex-1">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl p-2 shadow-sm">
                  <div className="w-full h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg mb-1 flex items-center justify-center">
                    <div className="w-4 h-6 bg-pink-400 rounded transform rotate-12 opacity-80" />
                  </div>
                  <div className="text-xs font-medium text-gray-800 mb-1">Chair {item}</div>
                  <div className="text-red-500 font-bold text-xs">Birr{(100 + item * 15).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width="200"
        height="400"
        viewBox="0 0 200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* iPhone Frame */}
        <path
          fill="#303333"
          d="M196.11,128.09c0-.25-.2-.45-.45-.45-.11.04-.37.03-.69,0V36.69c0-17.84-14.46-32.31-32.31-32.31H37.48C19.63,4.39,5.17,18.85,5.17,36.69v48.99c-.3.02-.55.03-.66-.02-.25,0-.45.2-.45.45,0,0,0,17.29,0,17.29-.03.41.5.49,1.11.48v13.63c-.61,0-1.14.08-1.11.48,0,0,0,28.54,0,28.54-.03.42.5.49,1.11.48v7.95c-.61,0-1.14.08-1.11.48,0,0,0,28.54,0,28.54-.03.42.5.49,1.11.48v178.86c0,17.84,14.46,32.31,32.31,32.31h125.2c17.84,0,32.31-14.46,32.31-32.31v-188.87c.32-.02.58-.03.69.04,1.26.1.03-45.94.45-46.38ZM186.07,362.63c0,13.56-10.99,24.56-24.56,24.56H38.64c-13.56,0-24.56-10.99-24.56-24.56V37.37c0-13.56,10.99-24.56,24.56-24.56h122.87c13.56,0,24.56,10.99,24.56,24.56v325.26Z"
        />
        <path
          fill="#000000"
          d="M161.38,7.29H38.78c-16.54,0-29.95,13.41-29.95,29.95v325.52c0,16.54,13.41,29.95,29.95,29.95h122.6c16.54,0,29.95-13.41,29.95-29.95V37.24c0-16.54-13.41-29.95-29.95-29.95ZM186.07,362.57c0,13.6-11.02,24.62-24.62,24.62H38.7c-13.6,0-24.62-11.02-24.62-24.62V37.43c0-13.6,11.02-24.62,24.62-24.62h122.75c13.6,0,24.62,11.02,24.62,24.62v325.14Z"
        />
        
        {/* Screen Background */}
        <rect
          fill="#f3f4f6"
          x="14.08"
          y="12.81"
          width="171.98"
          height="374.37"
          rx="24.62"
          ry="24.62"
        />
        
        {/* Dynamic Island */}
        <path
          fill="#000000"
          d="M119.61,33.86h-38.93c-10.48-.18-10.5-15.78,0-15.96,0,0,38.93,0,38.93,0,4.41,0,7.98,3.57,7.98,7.98,0,4.41-3.57,7.98-7.98,7.98Z"
        />
        <path
          fill="#080d4c"
          d="M118.78,29.21c-4.32.06-4.32-6.73,0-6.66,4.32-.06,4.32,6.73,0,6.66Z"
        />
        
        {/* Define clipping path for screen content */}
        <defs>
          <clipPath id={clipPathId}>
            <rect
              x="14.08"
              y="12.81"
              width="171.98"
              height="374.37"
              rx="24.62"
              ry="24.62"
            />
          </clipPath>
        </defs>
        
        {/* Screen Content */}
        <g clipPath={`url(#${clipPathId})`}>
          <foreignObject
            x="14.08"
            y="12.81"
            width="171.98"
            height="374.37"
          >
            <div className="w-full h-full bg-gray-100 p-3 overflow-hidden">
              {renderContent()}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}