import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/auth/auth-client"
import { useFetchConfig } from "@/hooks/FetchConfig"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const { data: session } = useSession()
  const { data: handshake } = useFetchConfig()
  const navigate = useNavigate()
  
  const [selectedColor, setSelectedColor] = useState('pink')
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Minimalist Chair', price: 235, color: 'bg-pink-300', quantity: 1 },
  ])
  const [showPayment, setShowPayment] = useState(false)
  
  const colors = [
    { name: 'pink', bg: 'bg-pink-300', border: 'border-pink-400' },
    { name: 'black', bg: 'bg-gray-800', border: 'border-gray-900' },
    {name : 'blue', bg: 'bg-blue-800', border: 'border-blue-900' }
  ]
  
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      pink: 'bg-pink-300',
      black: 'bg-gray-800',
      blue: 'bg-blue-800'
    }
    return colorMap[colorName] || 'bg-pink-300'
  }
  
  const handleAddToCart = () => {
    const newItem = {
      id: Date.now(),
      name: 'Minimal Chair',
      price: 115,
      color: getColorClass(selectedColor),
      quantity: quantity
    }
    setCartItems([...cartItems, newItem])
    setQuantity(1)
  }
  
  const updateCartQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }
  
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-300 to-transparent opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
              Unlock Your Shopping:
              <br />
              The Ultimate E-Commerce
              <br />
              Experience 🛍️
            </h1>
            <p className="text-md text-gray-400 mb-12 max-w-lg leading-relaxed">
              Discover a seamless shopping experience with our mobile-first platform. 
              Browse thousands of products, enjoy secure payments, and get your 
              favorite items delivered right to your doorstep.
            </p>
            
            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="bg-white text-black rounded-2xl px-6 py-3 flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-white text-black rounded-2xl px-6 py-3 flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-4xl font-bold text-white">{handshake?.stats?.totalUsers || '1.5M'}</div>
                <div className="text-gray-400">Users using this app</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {(handshake?.stats?.recentUsers || [{ name: 'User' }, { name: 'User' }, { name: 'User' }]).map((user, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center">
               
                        <span className="text-white font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      
                    </div>
                  ))}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </div>
          </div>
          
          {/* Right Content - Mobile Mockups */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Main Phone - Product View */}
              <div className="relative z-10 w-80 h-[650px] bg-black rounded-[3rem] p-3 shadow-2xl transform rotate-3 transition-all duration-500 ease-in-out hover:rotate-6 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-100  h-8 rounded-t-[2.5rem] flex items-center justify-center">
                    <div className="w-32 h-4 bg-black rounded-full" />
                  </div>
                  <div className="bg-gray-100 p-4 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <ArrowRight className="w-6 h-6 rotate-180 text-gray-600" />
                      <span className="font-semibold text-gray-800">Product</span>
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center relative">
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">2</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Card */}
                    <div className="bg-white rounded-3xl shadow-lg p-4">
                      {/* Product Image */}
                      <div className={`w-full h-48 bg-gradient-to-br ${selectedColor === 'pink' ? 'from-pink-200 to-pink-300' : selectedColor === 'blue' ? 'from-blue-300 to-blue-400' : 'from-gray-700 to-gray-800'} rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden transition-all duration-500`}>
                        <div className={`w-24 h-32 ${selectedColor === 'pink' ? 'bg-pink-400' : selectedColor === 'blue' ? 'bg-blue-600' : 'bg-gray-900'} rounded-2xl transform rotate-12 opacity-80 transition-all duration-500`} />
                        <button className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all duration-300 hover:bg-red-50 active:scale-95">
                          <div className="w-3 h-3 bg-red-500 rounded-full transition-colors hover:bg-red-600" />
                        </button>
                      </div>
                      
                      {/* Product Info */}
                      <div className="text-red-500 text-2xl font-bold mb-2">Birr {(115 * quantity).toFixed(2)}</div>
                      <div className="font-bold text-gray-800 text-base mb-1">Minimal Chair</div>
                      <div className="text-xs text-gray-500 mb-3">Color option</div>
                      
                      {/* Color Options */}
                      <div className="flex space-x-2 mb-4">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`w-6 h-6 ${color.bg} rounded-full border-2 ${selectedColor === color.name ? color.border + ' ring-2 ring-offset-2 ring-gray-400' : 'border-transparent'} hover:scale-125 transition-all duration-300 active:scale-95`}
                          />
                        ))}
                      </div>
                      
                      
                      {/* Description */}
                      <div className="text-xs text-gray-500 mb-4">
                        <div className="font-semibold mb-1">Description</div>
                        <div className="text-gray-400 leading-relaxed">
                          Minimal chair made with high quality materials.
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-gray-900 text-white rounded-2xl py-3 text-sm font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 hover:shadow-lg"
                      >
                        <span className="transition-transform duration-300">+</span>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Secondary Phone - Cart View */}
              <div className="absolute -right-20 top-16 w-72 h-[580px] bg-black rounded-[2.5rem] p-3 shadow-xl transform -rotate-2 transition-all duration-700 ease-in-out group-hover:rotate-2 group-hover:scale-110 group-hover:translate-x-4 group-hover:-translate-y-4 cursor-pointer hover:z-20">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-100 h-7 rounded-t-[2rem] flex items-center justify-center">
                    <div className="w-24 h-3 bg-black rounded-full" />
                  </div>
                  <div className="bg-gray-100 p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
                      </button>
                      <span className="font-semibold text-gray-800 text-lg">Cart</span>
                      <div className="w-6" />
                    </div>
                    
                    {/* Cart Items */}
                    <div className="space-y-3 mb-4 flex-1 overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
                          <div className={`w-10 h-10 ${item.color} rounded-xl`} />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-800">{item.name}</div>
                            <div className="text-red-500 font-bold text-sm">Birr{(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              -
                            </button>
                            <span className="text-gray-600 text-xs w-4 text-center transition-all duration-300">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary */}
                    <div className="bg-white rounded-2xl p-3 mb-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal Items</span>
                          <span className="text-gray-800">Birr{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping Fee</span>
                          <span className="text-gray-800">Birr0.00</span>
                        </div>
                        <hr className="my-1" />
                        <div className="flex justify-between font-bold text-sm">
                          <span>Subtotal</span>
                          <span className="text-red-500">Birr{cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Options */}
                    {showPayment && (
                      <div className="bg-white rounded-2xl p-3 mb-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-800 mb-2">Payment Method</div>
                        <button className="w-full bg-blue-600 text-white rounded-xl py-2 text-xs font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95">
                          💳 Credit Card
                        </button>
                        <button className="w-full bg-green-600 text-white rounded-xl py-2 text-xs font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95">
                          💰 Cash on Delivery
                        </button>
                        <button className="w-full bg-purple-600 text-white rounded-xl py-2 text-xs font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95">
                          📱 Mobile Money
                        </button>
                      </div>
                    )}
                    
                    {/* Checkout Button */}
                    <button
                      onClick={() => setShowPayment(!showPayment)}
                      className="w-full mb-10 bg-gray-900 text-white rounded-2xl py-3 text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
                    >
                      {showPayment ? 'Hide Payment' : 'Checkout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}