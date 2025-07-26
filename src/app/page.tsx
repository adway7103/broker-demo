import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Eye, Home, MapPin, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Your Dream Property Partner
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100">
              Professional real estate broker helping you find the perfect property for rent or purchase. 
              Your trusted guide in the property market.
            </p>
            
            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                  <Search className="mr-2 h-6 w-6" />
                  Start Your Search
                </Button>
              </Link>
              
              <Link href="/listings">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg font-semibold">
                  <Eye className="mr-2 h-6 w-6" />
                  Browse Freely
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide personalized service to help you find the perfect property that matches your needs and budget.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Properties</h3>
              <p className="text-gray-600">Carefully curated properties that meet high standards of quality and value.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Properties in desirable neighborhoods with excellent connectivity and amenities.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Service</h3>
              <p className="text-gray-600">Professional guidance throughout your property search and transaction process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Property?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to rent or buy, we have the perfect property waiting for you. 
            Start your search today or browse our extensive collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
