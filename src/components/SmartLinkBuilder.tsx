"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Link, Check } from "lucide-react";
import toast from 'react-hot-toast';

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

const PROPERTY_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK", "Villa", "Studio"];
const LISTING_TYPES = [
  { value: "RENT", label: "For Rent" },
  { value: "BUY", label: "For Sale" }
];
const FURNISHING_OPTIONS = [
  { value: "FULLY_FURNISHED", label: "Fully Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" }
];

const BUDGET_RANGES = [
  "₹10,000-₹25,000",
  "₹25,000-₹40,000", 
  "₹40,000-₹60,000",
  "₹60,000-₹80,000",
  "₹80,000-₹1,00,000",
  "₹1,00,000-₹1,50,000",
  "₹1,50,000-₹2,00,000",
  "₹2,00,000+"
];

type FilterData = {
  listingType: string;
  propertyType: string[];
  locality: string[];
  furnishing: string[];
  budget: string;
  minPrice: string;
  maxPrice: string;
  search: string;
};

export function SmartLinkBuilder() {
  const [filters, setFilters] = useState<FilterData>({
    listingType: "",
    propertyType: [],
    locality: [],
    furnishing: [],
    budget: "",
    minPrice: "",
    maxPrice: "",
    search: ""
  });
  
  const [copied, setCopied] = useState(false);

  const getBudgetRange = (budget: string): { min: number; max: number } => {
    const ranges: { [key: string]: { min: number; max: number } } = {
      "₹10,000-₹25,000": { min: 10000, max: 25000 },
      "₹25,000-₹40,000": { min: 25000, max: 40000 },
      "₹40,000-₹60,000": { min: 40000, max: 60000 },
      "₹60,000-₹80,000": { min: 60000, max: 80000 },
      "₹80,000-₹1,00,000": { min: 80000, max: 100000 },
      "₹1,00,000-₹1,50,000": { min: 100000, max: 150000 },
      "₹1,50,000-₹2,00,000": { min: 150000, max: 200000 },
      "₹2,00,000+": { min: 200000, max: 999999999 },
    };
    return ranges[budget] || { min: 0, max: 999999999 };
  };

  const generateURL = (): string => {
    const params = new URLSearchParams();
    
    if (filters.listingType) {
      params.set('listingType', filters.listingType);
    }
    
    if (filters.propertyType.length > 0) {
      params.set('propertyType', filters.propertyType.join(','));
    }
    
    if (filters.locality.length > 0) {
      params.set('locality', filters.locality.join(','));
    }
    
    if (filters.furnishing.length > 0) {
      params.set('furnishing', filters.furnishing.join(','));
    }
    
    if (filters.budget) {
      const range = getBudgetRange(filters.budget);
      params.set('minPrice', range.min.toString());
      params.set('maxPrice', range.max.toString());
    } else if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/listings${params.toString() ? '?' + params.toString() : ''}`;
  };

  const handleArrayFilter = (key: keyof FilterData, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters(prev => ({ ...prev, [key]: newArray }));
  };

  const copyToClipboard = async () => {
    const url = generateURL();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: "",
      propertyType: [],
      locality: [],
      furnishing: [],
      budget: "",
      minPrice: "",
      maxPrice: "",
      search: ""
    });
  };

  const generatedURL = generateURL();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Smart Link Builder
        </CardTitle>
        <p className="text-sm text-gray-600">
          Create custom filtered URLs to share with clients
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Listing Type</label>
          <div className="flex gap-2">
            {LISTING_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={filters.listingType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  listingType: prev.listingType === type.value ? "" : type.value 
                }))}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => (
              <Button
                key={type}
                variant={filters.propertyType.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => handleArrayFilter('propertyType', type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Locality */}
        <div>
          <label className="block text-sm font-medium mb-2">Locality</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            <div className="grid grid-cols-2 gap-1">
              {MUMBAI_LOCALITIES.map((locality) => (
                <Button
                  key={locality.value}
                  variant={filters.locality.includes(locality.value) ? "default" : "ghost"}
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => handleArrayFilter('locality', locality.value)}
                >
                  {locality.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className="block text-sm font-medium mb-2">Furnishing</label>
          <div className="flex flex-wrap gap-2">
            {FURNISHING_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filters.furnishing.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleArrayFilter('furnishing', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-2">Budget</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {BUDGET_RANGES.map((range) => (
                <Button
                  key={range}
                  variant={filters.budget === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    budget: prev.budget === range ? "" : range,
                    minPrice: "",
                    maxPrice: ""
                  }))}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 text-center">OR</div>
            
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minPrice: e.target.value,
                  budget: ""
                }))}
                className="flex-1"
              />
              <span className="text-gray-500">to</span>
              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxPrice: e.target.value,
                  budget: ""
                }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Search Term */}
        <div>
          <label className="block text-sm font-medium mb-2">Search Term (Optional)</label>
          <Input
            placeholder="e.g., spacious, modern, garden"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Generated URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Generated URL</label>
          <div className="flex gap-2">
            <Input
              value={generatedURL}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="flex items-center gap-2 min-w-fit"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={clearAllFilters} variant="outline" className="flex-1">
            Clear All Filters
          </Button>
          <Button 
            onClick={() => window.open(generatedURL, '_blank')} 
            className="flex-1"
          >
            Preview Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 