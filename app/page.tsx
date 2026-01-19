import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedProducts } from "@/components/featured-products"
import { ShippingPaymentInfo } from "@/components/shipping-payment-info"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <ShippingPaymentInfo />
      </main>
      <Footer />
    </div>
  )
}
