"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Mail, MapPin, Home, Calendar, Trash2, Heart } from "lucide-react";
import toast from 'react-hot-toast';
import { ConfirmDialog } from "@/components/ConfirmDialog";

type Shortlist = {
  id: string;
  phoneNumber: string;
  email?: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
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
  };
};

export default function AdminShortlistsPage() {
  const router = useRouter();
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; shortlistId: string; propertyTitle: string }>({
    open: false,
    shortlistId: "",
    propertyTitle: ""
  });

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }

    fetchShortlists();
  }, [router, pagination.page]);

  const fetchShortlists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/shortlists?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setShortlists(data.shortlists || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching shortlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (shortlistId: string, propertyTitle: string) => {
    setDeleteDialog({ open: true, shortlistId, propertyTitle });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/shortlists/${deleteDialog.shortlistId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShortlists(shortlists.filter(s => s.id !== deleteDialog.shortlistId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        toast.success('Shortlist removed successfully!');
      } else {
        toast.error('Error removing shortlist');
      }
    } catch (error) {
      console.error('Error removing shortlist:', error);
      toast.error('Error removing shortlist');
    }
  };

  const formatPrice = (price: number, currency: string = "INR") => {
    if (currency === "INR") {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && shortlists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <CardTitle>Customer Shortlists</CardTitle>
                  <p className="text-sm text-gray-600">
                    {pagination.total} shortlisted properties from potential customers
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && shortlists.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : shortlists.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shortlists Yet</h3>
                <p className="text-gray-600">
                  Customer shortlists will appear here when they save properties they're interested in.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortlists.map((shortlist) => (
                  <Card key={shortlist.id} className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Property Information */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{shortlist.property.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{shortlist.property.locality.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>
                              {shortlist.property.propertyType} • {shortlist.property.listingType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Shortlisted on {formatDate(shortlist.createdAt)}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(shortlist.property.price, shortlist.property.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Customer Contact</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <a href={`tel:${shortlist.phoneNumber}`} className="text-blue-600 hover:underline">
                                {shortlist.phoneNumber}
                              </a>
                            </div>
                            {shortlist.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <a href={`mailto:${shortlist.email}`} className="text-blue-600 hover:underline">
                                  {shortlist.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/properties/${shortlist.property.id}`)}
                            className="flex items-center gap-2"
                          >
                            View Property
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(shortlist.id, shortlist.property.title)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>

                  <span className="flex items-center px-3 py-1 text-sm">
                    Page {pagination.page}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title="Remove Shortlist"
        description={`Are you sure you want to remove "${deleteDialog.propertyTitle}" from shortlists? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
} 