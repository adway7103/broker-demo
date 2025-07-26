"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Eye,
  Home,
  MapPin,
  Star,
  Users,
  Building,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Heart,
  Bed,
  Bath,
  Square
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  locality: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

interface Stats {
  totalProperties: number;
  forRent: number;
  forSale: number;
  totalShortlists: number;
}

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    forRent: 0,
    forSale: 0,
    totalShortlists: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured properties
      const propertiesResponse = await fetch('/api/properties?limit=6');
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setFeaturedProperties(propertiesData.properties || []);

        // Calculate stats from properties
        const properties = propertiesData.properties || [];
        const rentProperties = properties.filter((p: Property) => p.listingType === 'RENT').length;
        const saleProperties = properties.filter((p: Property) => p.listingType === 'BUY').length;

        setStats({
          totalProperties: properties.length,
          forRent: rentProperties,
          forSale: saleProperties,
          totalShortlists: Math.floor(properties.length * 0.3) // Estimated shortlists
        });
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string = "INR") => {
    if (currency === "INR") {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const getLocalityLabel = (locality: string) => {
    return locality.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden min-h-screen flex items-center -mt-16 pt-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-blue-400/30">
              <Star className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Mumbai's Trusted Property Partner</span>
            </div>

                         <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
               Find Your Perfect
               <br />
               <span className="text-blue-400">Dream Home</span>
             </h1>
             
             <p className="text-lg md:text-xl lg:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed">
               Discover premium properties across Mumbai with our expert guidance. 
               From luxury apartments to cozy homes, we make your property dreams come true.
             </p>


                         {/* Main Action Buttons */}
             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
               <Link href="/search">
                 <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-12 py-5 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                   <Search className="mr-3 h-6 w-6" />
                   Start Your Search
                 </Button>
               </Link>

               <Link href="/listings">
                 <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-slate-900 px-12 py-5 text-xl font-semibold backdrop-blur-sm bg-white/10 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                   <Eye className="mr-3 h-6 w-6" />
                   Browse Properties
                 </Button>
               </Link>
             </div>

             {/* Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-400">{stats.totalProperties}+</div>
                <div className="text-sm text-slate-300">Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{stats.forRent}+</div>
                <div className="text-sm text-slate-300">For Rent</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">{stats.forSale}+</div>
                <div className="text-sm text-slate-300">For Sale</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">{stats.totalShortlists}+</div>
                <div className="text-sm text-slate-300">Happy Clients</div>
              </div>
            </div>


          </div>
        </div>

                 {/* Floating Elements */}
         <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
         <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/15 rounded-full blur-lg animate-pulse delay-500"></div>
         <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-yellow-500/15 rounded-full blur-lg animate-pulse delay-700"></div>
      </section>

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Featured Properties
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Handpicked premium properties that offer the best value and location advantages
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredProperties.slice(0, 6).map((property) => (
                <Card key={property.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
                  <div className="relative overflow-hidden">
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <Home className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="h-4 w-4 text-slate-600" />
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center text-slate-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{getLocalityLabel(property.locality)}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(property.price, property.currency)}
                      </div>
                      <div className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {property.propertyType}
                      </div>
                    </div>

                    {(property.bedrooms || property.bathrooms || property.area) && (
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms}
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {property.area} sqft
                          </div>
                        )}
                      </div>
                    )}

                    <Link href={`/properties/${property.id}`}>
                      <Button className="w-full group-hover:bg-blue-700 transition-colors">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/listings">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Why Choose PropertyBroker?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We provide end-to-end property solutions with personalized service and expert guidance
              to help you make the right property decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Home className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Premium Properties</h3>
              <p className="text-slate-600 leading-relaxed">Carefully curated properties that meet high standards of quality, location, and value.</p>
            </div>

            <div className="text-center group hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Prime Locations</h3>
              <p className="text-slate-600 leading-relaxed">Properties in Mumbai's most desirable neighborhoods with excellent connectivity.</p>
            </div>

            <div className="text-center group hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Expert Guidance</h3>
              <p className="text-slate-600 leading-relaxed">Professional consultation throughout your property search and transaction process.</p>
            </div>

            <div className="text-center group hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Market Insights</h3>
              <p className="text-slate-600 leading-relaxed">Data-driven insights and market analysis to help you make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What Our Clients Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real stories from satisfied customers who found their dream properties with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "Exceptional service! Found my perfect 2BHK in Bandra within a week. The team was professional and understanding of my requirements."
                </p>
                <div>
                  <div className="font-semibold text-slate-900">Priya Sharma</div>
                  <div className="text-sm text-slate-500">Software Engineer</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "Great experience buying my first home. The team guided me through every step and helped negotiate a great deal."
                </p>
                <div>
                  <div className="font-semibold text-slate-900">Rahul Verma</div>
                  <div className="text-sm text-slate-500">Marketing Manager</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "Smooth rental process with transparent communication. Found a beautiful apartment in Powai that exceeded my expectations."
                </p>
                <div>
                  <div className="font-semibold text-slate-900">Anjali Patel</div>
                  <div className="text-sm text-slate-500">Business Analyst</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            Join thousands of satisfied customers who found their perfect homes with PropertyBroker.
            Start your journey today and let us help you find the property of your dreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/search">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <Search className="mr-3 h-6 w-6" />
                Start Your Search
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg font-semibold backdrop-blur-sm bg-white/10 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <Building className="mr-3 h-6 w-6" />
                Browse All Properties
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <span>info@propertybroker.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
