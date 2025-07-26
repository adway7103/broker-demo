"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Phone, 
  Mail, 
  Car,
  Wifi,
  Shield,
  ArrowUpDown,
  Zap,
  Droplets,
  Trees,
  Users,
  Camera,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  locality: string;
  city?: string;
  state?: string;
  furnishing: string;
  images: string[];
  videos: string[];
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  isRented: boolean;
  createdAt: string;
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

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes('parking') || lowerFeature.includes('car')) return Car;
  if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi;
  if (lowerFeature.includes('security') || lowerFeature.includes('cctv')) return Shield;
  if (lowerFeature.includes('elevator') || lowerFeature.includes('lift')) return ArrowUpDown;
  if (lowerFeature.includes('power') || lowerFeature.includes('backup')) return Zap;
  if (lowerFeature.includes('water')) return Droplets;
  if (lowerFeature.includes('garden') || lowerFeature.includes('balcony')) return Trees;
  if (lowerFeature.includes('gym') || lowerFeature.includes('club')) return Users;
  return Shield; // Default icon
};

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error('Property not found');
        router.push('/listings');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property');
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!phoneNumber) {
      setShowContactForm(true);
      return;
    }

    try {
      const response = await fetch('/api/shortlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          phoneNumber,
          email: email || null,
        }),
      });

      if (response.ok) {
        toast.success('Property added to shortlist! Our team will contact you soon.');
      } else {
        toast.error('Error adding to shortlist. Property may already be shortlisted.');
      }
    } catch (error) {
      console.error('Error shortlisting property:', error);
      toast.error('Error adding to shortlist');
    }
  };

  const submitContactInfo = () => {
    if (phoneNumber.trim()) {
      setShowContactForm(false);
      handleShortlist();
    }
  };

  const getLocalityLabel = (value: string) => {
    const locality = MUMBAI_LOCALITIES.find(l => l.value === value);
    return locality ? locality.label : value;
  };

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Button onClick={() => router.push('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/listings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {property.images.length > 0 ? (
                    <div className="relative h-96 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={property.images[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />
                      
                      {/* Image Navigation */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {property.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                        property.isRented 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {property.isRented ? 'Rented' : 'Available'}
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <Square className="h-32 w-32 text-gray-400" />
                    </div>
                  )}

                  {/* Thumbnail Strip */}
                  {property.images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                            index === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${property.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{getLocalityLabel(property.locality)}</span>
                      {property.city && <span>, {property.city}</span>}
                      {property.state && <span>, {property.state}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(property.price, property.currency)}
                    </div>
                    <div className="text-sm text-gray-600">
                      For {property.listingType === 'RENT' ? 'Rent' : 'Sale'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Property Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyType}</div>
                    <div className="text-sm text-gray-600">Property Type</div>
                  </div>
                  {property.bedrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Bed className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Bath className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Square className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {/* Furnishing */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Furnishing</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {property.furnishing.replace('_', ' ')}
                  </span>
                </div>

                {/* Features & Amenities */}
                {property.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => {
                        const IconComponent = getFeatureIcon(feature);
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Interested in this property?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleShortlist}
                    disabled={property.isRented}
                    className="w-full flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <Heart className="h-5 w-5" />
                    {property.isRented ? 'Property Rented' : 'Add to Shortlist'}
                  </Button>
                  
                  {!property.isRented && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-4">
                        Get instant updates and schedule a visit
                      </p>
                      <div className="space-y-3">
                        <Input
                          placeholder="Your phone number *"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          type="tel"
                        />
                        <Input
                          placeholder="Email (optional)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                        />
                        <Button 
                          onClick={submitContactInfo}
                          disabled={!phoneNumber.trim()}
                          variant="outline"
                          className="w-full"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Request Callback
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Property Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-medium">{property.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed On</span>
                    <span className="font-medium">
                      {new Date(property.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listing Type</span>
                    <span className="font-medium">
                      For {property.listingType === 'RENT' ? 'Rent' : 'Sale'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${
                      property.isRented ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {property.isRented ? 'Rented' : 'Available'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Get Property Updates</h3>
                <p className="text-gray-600 mb-4">
                  Please provide your contact details to shortlist this property and receive updates.
                </p>
                <div className="space-y-4">
                  <Input
                    placeholder="Phone number *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                  />
                  <Input
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                  <div className="flex gap-3">
                    <Button onClick={submitContactInfo} disabled={!phoneNumber.trim()}>
                      Continue
                    </Button>
                    <Button variant="outline" onClick={() => setShowContactForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && property.images.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full p-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="max-w-full max-h-full object-contain"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 