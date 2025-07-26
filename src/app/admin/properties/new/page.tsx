"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import toast from 'react-hot-toast';
import { ImageUploader } from "@/components/ImageUploader";

type PropertyFormData = {
  title: string;
  description: string;
  price: string;
  currency: string;
  propertyType: string;
  listingType: string;
  locality: string;
  city: string;
  state: string;
  furnishing: string;
  images: string[];
  videos: string[];
  features: string[];
  area: string;
  bedrooms: string;
  bathrooms: string;
};

const PROPERTY_TYPES = [
  "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "Studio", "Penthouse", "Villa", "Plot"
];

const FURNISHING_OPTIONS = [
  "FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"
];

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

const COMMON_FEATURES = [
  "Air Conditioning", "Parking", "Swimming Pool", "Gym", "Security", "Elevator",
  "Balcony", "Garden", "Pets Allowed", "WiFi", "Power Backup", "Water Supply",
  "Maintenance Staff", "Club House", "Kids Play Area", "CCTV", "Intercom"
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    currency: "INR",
    propertyType: "",
    listingType: "",
    locality: "",
    city: "",
    state: "",
    furnishing: "",
    images: [],
    videos: [],
    features: [],
    area: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [propertyId] = useState(() => `temp_${Date.now()}`);

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  const updateFormData = (field: keyof PropertyFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      updateFormData("features", [...formData.features, feature]);
    }
  };

  const removeFeature = (feature: string) => {
    updateFormData("features", formData.features.filter(f => f !== feature));
  };

  const handleImagesChange = (images: string[]) => {
    updateFormData("images", images);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          area: formData.area ? parseInt(formData.area) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        }),
      });

      if (response.ok) {
        toast.success('Property added successfully!');
        router.push('/admin/properties');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error adding property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Error adding property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/properties')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600">Create a new property listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="e.g., Spacious 2BHK Apartment in Bandra"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Detailed description of the property..."
                  required
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Listing Type *</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => updateFormData("listingType", e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">Select listing type</option>
                    <option value="RENT">For Rent</option>
                    <option value="BUY">For Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => updateFormData("propertyType", e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price ({formData.currency}) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Locality *</label>
                <select
                  value={formData.locality}
                  onChange={(e) => updateFormData("locality", e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <option value="">Select locality</option>
                  {MUMBAI_LOCALITIES.map(locality => (
                    <option key={locality.value} value={locality.value}>
                      {locality.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    placeholder="e.g., Maharashtra"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData("bedrooms", e.target.value)}
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData("bathrooms", e.target.value)}
                    placeholder="Number of bathrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Area (sq ft)</label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => updateFormData("area", e.target.value)}
                    placeholder="Area in square feet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Furnishing Status *</label>
                <select
                  value={formData.furnishing}
                  onChange={(e) => updateFormData("furnishing", e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <option value="">Select furnishing status</option>
                  {FURNISHING_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={formData.images}
                onImagesChange={handleImagesChange}
                propertyId={propertyId}
                maxImages={15}
              />
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {COMMON_FEATURES.map((feature) => (
                  <Button
                    key={feature}
                    type="button"
                    variant={formData.features.includes(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      formData.features.includes(feature) 
                        ? removeFeature(feature)
                        : addFeature(feature)
                    }
                    className="justify-start text-xs"
                  >
                    {feature}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add custom feature"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    addFeature(newFeature);
                    setNewFeature("");
                  }}
                >
                  Add
                </Button>
              </div>

              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <div key={feature} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/properties')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 