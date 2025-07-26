"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Bed, Bath, Square, Star, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from 'react-hot-toast';

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  locality: string;
  furnishing: string;
  images: string[];
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  isRented: boolean;
};

const MUMBAI_LOCALITIES = [
  { value: "ANDHERI_EAST", label: "Andheri East" },
  { value: "ANDHERI_WEST", label: "Andheri West" },
  { value: "BANDRA_EAST", label: "Bandra East" },
  { value: "BANDRA_WEST", label: "Bandra West" },
  { value: "BORIVALI_EAST", label: "Borivali East" },
  { value: "BORIVALI_WEST", label: "Borivali West" },
  { value: "CHEMBUR", label: "Chembur" },
  { value: "DADAR_EAST", label: "Dadar East" },
  { value: "DADAR_WEST", label: "Dadar West" },
  { value: "GHATKOPAR_EAST", label: "Ghatkopar East" },
  { value: "GHATKOPAR_WEST", label: "Ghatkopar West" },
  { value: "GOREGAON_EAST", label: "Goregaon East" },
  { value: "GOREGAON_WEST", label: "Goregaon West" },
  { value: "JUHU", label: "Juhu" },
  { value: "KANDIVALI_EAST", label: "Kandivali East" },
  { value: "KANDIVALI_WEST", label: "Kandivali West" },
  { value: "KHAR_WEST", label: "Khar West" },
  { value: "KURLA_EAST", label: "Kurla East" },
  { value: "KURLA_WEST", label: "Kurla West" },
  { value: "LOWER_PAREL", label: "Lower Parel" },
  { value: "MALAD_EAST", label: "Malad East" },
  { value: "MALAD_WEST", label: "Malad West" },
  { value: "MIRA_ROAD", label: "Mira Road" },
  { value: "MULUND_EAST", label: "Mulund East" },
  { value: "MULUND_WEST", label: "Mulund West" },
  { value: "NAVI_MUMBAI", label: "Navi Mumbai" },
  { value: "POWAI", label: "Powai" },
  { value: "SANTACRUZ_EAST", label: "Santacruz East" },
  { value: "SANTACRUZ_WEST", label: "Santacruz West" },
  { value: "THANE_EAST", label: "Thane East" },
  { value: "THANE_WEST", label: "Thane West" },
  { value: "VERSOVA", label: "Versova" },
  { value: "VIKHROLI_EAST", label: "Vikhroli East" },
  { value: "VIKHROLI_WEST", label: "Vikhroli West" },
  { value: "VILE_PARLE_EAST", label: "Vile Parle East" },
  { value: "VILE_PARLE_WEST", label: "Vile Parle West" },
  { value: "WORLI", label: "Worli" },
];

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get phone number from URL if coming from search
  useEffect(() => {
    const phoneFromUrl = searchParams.get('phone');
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
    }
  }, [searchParams]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          // Fix: Extract properties array from the response object
          setProperties(data.properties || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  const handleShortlist = async (propertyId: string) => {
    if (!phoneNumber) {
      setShowPhoneForm(true);
      return;
    }

    try {
      const response = await fetch('/api/shortlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          phoneNumber,
        }),
      });

      if (response.ok) {
        toast.success('Property added to shortlist!');
      } else {
        toast.error('Error adding to shortlist. Property may already be shortlisted.');
      }
    } catch (error) {
      console.error('Error shortlisting property:', error);
      toast.error('Error adding to shortlist');
    }
  };

  const submitPhoneNumber = () => {
    if (phoneNumber.trim()) {
      setShowPhoneForm(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    router.push('/listings');
  };

  const getLocalityLabel = (value: string) => {
    const locality = MUMBAI_LOCALITIES.find(l => l.value === value);
    return locality ? locality.label : value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Properties</h1>
          <p className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
          
          {/* Search Bar */}
          <div className="mt-4 flex gap-4 items-center">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            {(searchParams.toString() || searchTerm) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {searchParams.toString() && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchParams.get('listingType') && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {searchParams.get('listingType') === 'RENT' ? 'For Rent' : 'For Sale'}
                </span>
              )}
              {searchParams.get('propertyType') && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {searchParams.get('propertyType')}
                </span>
              )}
              {searchParams.get('locality') && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {getLocalityLabel(searchParams.get('locality')!)}
                </span>
              )}
              {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  ₹{searchParams.get('minPrice') || '0'} - ₹{searchParams.get('maxPrice') || '∞'}
                </span>
              )}
              {searchParams.get('furnishing') && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  {searchParams.get('furnishing')?.replace('_', ' ')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Phone Number Form */}
        {showPhoneForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Enter Your Phone Number</h3>
                <p className="text-gray-600 mb-4">
                  Please provide your phone number to shortlist properties and get personalized assistance.
                </p>
                <div className="space-y-4">
                  <Input
                    placeholder="Phone number *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                    className="h-12"
                  />
                  <div className="flex gap-3">
                    <Button onClick={submitPhoneNumber} disabled={!phoneNumber.trim()}>
                      Continue
                    </Button>
                    <Button variant="outline" onClick={() => setShowPhoneForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card 
              key={property.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/properties/${property.id}`)}
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                {property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Square className="h-16 w-16" />
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatPrice(property.price, property.currency)}
                </div>
                
                {/* Listing Type Badge */}
                <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {property.listingType}
                </div>
              </div>

              <CardContent className="p-4">
                {/* Property Details */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.locality}
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms || 'N/A'}
                  </div>
                  {property.area && (
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.area} sq ft
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                {/* Property Type & Furnishing */}
                <div className="flex gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {property.propertyType}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {property.furnishing.replace('_', ' ')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.id}`);
                    }}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShortlist(property.id);
                    }}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    disabled={property.isRented}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Properties Found */}
        {properties.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Star className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all available properties.
            </p>
            <Button onClick={() => window.location.href = '/listings'}>
              View All Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 