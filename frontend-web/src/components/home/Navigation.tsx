import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/auth/auth-client"
import { useFetchConfig } from "@/hooks/FetchConfig"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ECommerceLogo } from "../icons/ECommerceLogo"

export function Navigation() {
  const { data: session } = useSession()
  const { data: handshake } = useFetchConfig()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          <div className="flex items-center space-x-3">
            <div>
              <ECommerceLogo className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold text-xl">
              ShopSpace
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#products" className="text-gray-300 hover:text-white transition-colors">Products</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
            <a href="#contacts" className="text-gray-300 hover:text-white transition-colors">Contacts</a> */}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-white text-black hover:bg-gray-100 rounded-lg px-6">
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                {handshake?.auth?.register === 'true' && (
                  <Button className="bg-white text-black hover:bg-gray-100 rounded-lg px-6" onClick={() => navigate('/register')}>
                    Login
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}