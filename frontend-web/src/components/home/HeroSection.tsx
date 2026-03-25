import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/auth/auth-client"
import { useFetchConfig } from "@/hooks/FetchConfig"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { PhoneMockup } from "./PhoneMockup"

export function HeroSection() {
  const { data: session } = useSession()
  const { data: handshake } = useFetchConfig()
  const navigate = useNavigate()

  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-300 to-transparent opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
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
          <div className="relative flex justify-center overflow-hidden">
            <div className="relative group max-w-full">
              {/* Main Phone - Product View */}
              <div className="relative z-10 transform rotate-1 lg:rotate-3 transition-all duration-500 ease-in-out hover:rotate-6 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                <PhoneMockup 
                  type="product" 
                  className="w-64 sm:w-72 lg:w-80 h-auto drop-shadow-2xl" 
                />
              </div>
              
              {/* Secondary Phone - Cart View */}
              <div className="absolute -right-4 sm:-right-6 lg:-right-12 top-8 sm:top-12 lg:top-16 transform -rotate-1 lg:-rotate-2 transition-all duration-700 ease-in-out group-hover:rotate-2 group-hover:scale-110 group-hover:translate-x-2 lg:group-hover:translate-x-4 group-hover:-translate-y-4 cursor-pointer hover:z-20">
                <PhoneMockup 
                  type="cart" 
                  className="w-56 sm:w-64 lg:w-72 h-auto drop-shadow-xl opacity-90 hover:opacity-100" 
                />
              </div>

              {/* Third Phone - Home View (Background) */}
              <div className="absolute -left-8 sm:-left-12 lg:-left-16 top-20 sm:top-24 lg:top-32 transform rotate-2 lg:rotate-3 transition-all duration-1000 ease-in-out group-hover:-rotate-1 group-hover:scale-95 group-hover:-translate-x-2 lg:group-hover:-translate-x-4 group-hover:translate-y-2 cursor-pointer opacity-60 hover:opacity-80">
                <PhoneMockup 
                  type="home" 
                  className="w-48 sm:w-56 lg:w-64 h-auto drop-shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}