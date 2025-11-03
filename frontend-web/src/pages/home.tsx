import { Navigation } from "@/components/home/Navigation"
import { HeroSection } from "@/components/home/HeroSection"
import { Footer } from "@/components/home/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  )
}