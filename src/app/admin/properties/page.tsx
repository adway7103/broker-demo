"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search, MapPin, Home, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from 'react-hot-toast';
import { ConfirmDialog } from "@/components/ConfirmDialog";

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
  isRented: boolean;
  createdAt: string;
};

export default function PropertiesListPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; propertyId: string; title: string }>({
    open: false,
    propertyId: "",
    title: ""
  });

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }

    fetchProperties();
  }, [router]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (propertyId: string, title: string) => {
    setDeleteDialog({ open: true, propertyId, title });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${deleteDialog.propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== deleteDialog.propertyId));
        toast.success('Property deleted successfully!');
      } else {
        toast.error('Error deleting property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const toggleRentedStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRented: !currentStatus }),
      });

      if (response.ok) {
        setProperties(properties.map(p => 
          p.id === propertyId ? { ...p, isRented: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.locality.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "ALL") return matchesSearch;
    if (filter === "RENT") return matchesSearch && property.listingType === "RENT";
    if (filter === "BUY") return matchesSearch && property.listingType === "BUY";
    if (filter === "RENTED") return matchesSearch && property.isRented;
    if (filter === "AVAILABLE") return matchesSearch && !property.isRented;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Button onClick={() => router.push('/admin/properties/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search properties by title or locality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["ALL", "RENT", "BUY", "AVAILABLE", "RENTED"].map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? "default" : "outline"}
                    onClick={() => setFilter(filterOption)}
                    size="sm"
                  >
                    {filterOption}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
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
                    <Home className="h-16 w-16" />
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
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatPrice(property.price, property.currency)}
                </div>
              </div>

              <CardContent className="p-4">
                {/* Property Details */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.locality}
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{property.propertyType}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{property.listingType}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {property.furnishing.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.id}`);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/properties/${property.id}/edit`);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRentedStatus(property.id, property.isRented);
                    }}
                    className={`flex items-center gap-1 ${
                      property.isRented ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {property.isRented ? 'Available' : 'Rented'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(property.id, property.title);
                    }}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Properties Message */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {properties.length === 0 ? 'No Properties Yet' : 'No Properties Match Your Search'}
            </h3>
            <p className="text-gray-600 mb-4">
              {properties.length === 0 
                ? 'Start by adding your first property listing.'
                : 'Try adjusting your search criteria or filters.'
              }
            </p>
            {properties.length === 0 && (
              <Button onClick={() => router.push('/admin/properties/new')}>
                Add Your First Property
              </Button>
            )}
          </div>
        )}
      </div>
      
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title="Delete Property"
        description={`Are you sure you want to delete "${deleteDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
} 