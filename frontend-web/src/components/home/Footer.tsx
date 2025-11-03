import { ECommerceLogo } from "../icons/ECommerceLogo"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            
              <ECommerceLogo className="w-5 h-5 text-white" />
        
            <span className="text-xl font-bold text-white">ShopSpace</span>
          </div>
          <p className="text-gray-400 text-center md:text-right">
            © 2024 ShopSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}