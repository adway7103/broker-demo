"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Filter, X, Phone, Mail, User, MapPin, Home, Calendar } from "lucide-react";

type Lead = {
  id: string;
  phoneNumber: string;
  email?: string;
  name?: string;
  budget?: string;
  propertyType?: string;
  locality?: string;
  furnishing?: string;
  listingType?: string;
  createdAt: string;
  updatedAt: string;
};

type FilterState = {
  listingType: string;
  propertyType: string;
  locality: string;
  furnishing: string;
  budget: string;
  search: string;
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

const BUDGET_RANGES = [
  "Below 10 Lakhs",
  "10-20 Lakhs", 
  "20-50 Lakhs",
  "50 Lakhs - 1 Crore",
  "1-2 Crores",
  "Above 2 Crores"
];

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  const [filters, setFilters] = useState<FilterState>({
    listingType: "",
    propertyType: "",
    locality: "",
    furnishing: "",
    budget: "",
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }

    fetchLeads();
  }, [router, pagination.page, filters]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/leads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      listingType: "",
      propertyType: "",
      locality: "",
      furnishing: "",
      budget: "",
      search: "",
    });
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

  const getLocalityLabel = (value: string) => {
    const locality = MUMBAI_LOCALITIES.find(l => l.value === value);
    return locality ? locality.label : value;
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  if (loading && leads.length === 0) {
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
        <div className="mb-8 flex items-center justify-between">
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
              <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-gray-600">View and manage all customer leads</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filter Leads</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Search</label>
                  <Input
                    placeholder="Search by name, phone, email..."
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Listing Type</label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => updateFilter("listingType", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">All Types</option>
                    <option value="RENT">For Rent</option>
                    <option value="BUY">For Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => updateFilter("propertyType", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">All Property Types</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Locality</label>
                  <select
                    value={filters.locality}
                    onChange={(e) => updateFilter("locality", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">All Localities</option>
                    {MUMBAI_LOCALITIES.map(locality => (
                      <option key={locality.value} value={locality.value}>
                        {locality.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Furnishing</label>
                  <select
                    value={filters.furnishing}
                    onChange={(e) => updateFilter("furnishing", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">All Furnishing</option>
                    {FURNISHING_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Budget Range</label>
                  <select
                    value={filters.budget}
                    onChange={(e) => updateFilter("budget", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">All Budgets</option>
                    {BUDGET_RANGES.map(budget => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Rent</p>
                  <p className="text-2xl font-bold">
                    {leads.filter(l => l.listingType === "RENT").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Sale</p>
                  <p className="text-2xl font-bold">
                    {leads.filter(l => l.listingType === "BUY").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>Leads ({leads.length} of {pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leads found matching your filters.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-2">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{lead.phoneNumber}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{lead.email}</span>
                          </div>
                        )}
                        {lead.name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{lead.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Type:</span> {lead.listingType || "Not specified"}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Property:</span> {lead.propertyType || "Not specified"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Budget:</span> {lead.budget || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Locality:</span> {lead.locality ? getLocalityLabel(lead.locality) : "Not specified"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Furnishing:</span> {lead.furnishing ? lead.furnishing.replace('_', ' ') : "Not specified"}
                        </p>
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="text-xs text-gray-600">{formatDate(lead.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 