"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";

type FormData = {
  listingType: string;
  budget: string; // Changed from string[] to string for single selection
  customMinBudget: string;
  customMaxBudget: string;
  propertyTypes: string[];
  localities: string[];
  furnishing: string[];
  phoneNumber: string;
};

const STEPS = [
  "Listing Type",
  "Budget Range", 
  "Property Types",
  "Localities",
  "Furnishing",
  "Contact Details"
];

const RENT_BUDGETS = [
  "Under ₹15,000", "₹15,000 - ₹25,000", "₹25,000 - ₹40,000", 
  "₹40,000 - ₹60,000", "₹60,000 - ₹1,00,000", "Above ₹1,00,000"
];

const BUY_BUDGETS = [
  "Under ₹50 Lakh", "₹50L - ₹1 Crore", "₹1Cr - ₹2 Crore", 
  "₹2Cr - ₹5 Crore", "₹5Cr - ₹10 Crore", "Above ₹10 Crore"
];

const PROPERTY_TYPES = [
  "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "Studio", "Penthouse", "Villa", "Plot"
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

const FURNISHING_OPTIONS = [
  "FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"
];

export default function SearchPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    listingType: "",
    budget: "",
    customMinBudget: "",
    customMaxBudget: "",
    propertyTypes: [],
    localities: [],
    furnishing: [],
    phoneNumber: "",
  });

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: keyof FormData, value: string) => {
    if (field === 'budget') {
      // For budget, only allow single selection
      updateFormData(field, formData.budget === value ? "" : value);
    } else {
      const currentArray = formData[field] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      updateFormData(field, updatedArray);
    }
  };

  const removeArrayValue = (field: keyof FormData, value: string) => {
    if (field === 'budget') {
      updateFormData(field, "");
    } else {
      const currentArray = formData[field] as string[];
      updateFormData(field, currentArray.filter(item => item !== value));
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to calculate min/max budget from selected range
  const getBudgetRange = (budget: string, listingType: string) => {
    if (listingType === "RENT") {
      switch (budget) {
        case "Under ₹15,000": return { min: 0, max: 15000 };
        case "₹15,000 - ₹25,000": return { min: 15000, max: 25000 };
        case "₹25,000 - ₹40,000": return { min: 25000, max: 40000 };
        case "₹40,000 - ₹60,000": return { min: 40000, max: 60000 };
        case "₹60,000 - ₹1,00,000": return { min: 60000, max: 100000 };
        case "Above ₹1,00,000": return { min: 100000, max: 10000000 };
        default: return null;
      }
    } else {
      switch (budget) {
        case "Under ₹50 Lakh": return { min: 0, max: 5000000 };
        case "₹50L - ₹1 Crore": return { min: 5000000, max: 10000000 };
        case "₹1Cr - ₹2 Crore": return { min: 10000000, max: 20000000 };
        case "₹2Cr - ₹5 Crore": return { min: 20000000, max: 50000000 };
        case "₹5Cr - ₹10 Crore": return { min: 50000000, max: 100000000 };
        case "Above ₹10 Crore": return { min: 100000000, max: 1000000000 };
        default: return null;
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Save lead data
      const leadData = {
        phoneNumber: formData.phoneNumber,
        listingType: formData.listingType,
        budget: formData.budget || `₹${formData.customMinBudget} - ₹${formData.customMaxBudget}`,
        propertyType: formData.propertyTypes.join(", "),
        locality: formData.localities.map(l => {
          const locality = MUMBAI_LOCALITIES.find(ml => ml.value === l);
          return locality ? locality.label : l;
        }).join(", "),
        furnishing: formData.furnishing.join(", "),
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        // Generate filter URL and redirect to listings
        const params = new URLSearchParams();
        
        // Add listing type
        if (formData.listingType) {
          params.set('listingType', formData.listingType);
        }
        
        // Calculate and add budget range
        if (formData.budget) {
          const budgetRange = getBudgetRange(formData.budget, formData.listingType);
          if (budgetRange) {
            params.set('minPrice', budgetRange.min.toString());
            params.set('maxPrice', budgetRange.max.toString());
          }
        } else if (formData.customMinBudget && formData.customMaxBudget) {
          params.set('minPrice', formData.customMinBudget);
          params.set('maxPrice', formData.customMaxBudget);
        }
        
        // Add all selected property types
        if (formData.propertyTypes.length > 0) {
          params.set('propertyType', formData.propertyTypes.join(','));
        }
        
        // Add all selected localities (use enum values)
        if (formData.localities.length > 0) {
          params.set('locality', formData.localities.join(','));
        }
        
        // Add all selected furnishing options
        if (formData.furnishing.length > 0) {
          params.set('furnishing', formData.furnishing.join(','));
        }
        
        // Add phone number for tracking
        params.set('phone', formData.phoneNumber);
        
        router.push(`/listings?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Are you looking to rent or buy?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={formData.listingType === "RENT" ? "default" : "outline"}
                onClick={() => updateFormData("listingType", "RENT")}
                className="h-16 text-lg"
              >
                Rent
              </Button>
              <Button
                variant={formData.listingType === "BUY" ? "default" : "outline"}
                onClick={() => updateFormData("listingType", "BUY")}
                className="h-16 text-lg"
              >
                Buy
              </Button>
            </div>
          </div>
        );

      case 1:
        const budgetOptions = formData.listingType === "RENT" ? RENT_BUDGETS : BUY_BUDGETS;
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's your budget range? (Select multiple)</h3>
            
            {/* Selected budgets */}
            {formData.budget && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm">{formData.budget}</span>
                <button onClick={() => updateFormData("budget", "")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {budgetOptions.map((range) => (
                <Button
                  key={range}
                  variant={formData.budget === range ? "default" : "outline"}
                  onClick={() => updateFormData("budget", range)}
                  className="justify-start h-12"
                >
                  {range}
                </Button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Or enter custom range:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Budget</label>
                  <Input
                    placeholder="Min amount"
                    value={formData.customMinBudget}
                    onChange={(e) => updateFormData("customMinBudget", e.target.value)}
                    type="number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Budget</label>
                  <Input
                    placeholder="Max amount"
                    value={formData.customMaxBudget}
                    onChange={(e) => updateFormData("customMaxBudget", e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What type of properties? (Select multiple)</h3>
            
            {/* Selected property types */}
            {formData.propertyTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.propertyTypes.map((type) => (
                  <div key={type} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm">{type}</span>
                    <button onClick={() => removeArrayValue("propertyTypes", type)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={formData.propertyTypes.includes(type) ? "default" : "outline"}
                  onClick={() => toggleArrayValue("propertyTypes", type)}
                  className="h-12"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferred localities? (Select multiple)</h3>
            
            {/* Selected localities */}
            {formData.localities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.localities.map((locality) => {
                  const localityObj = MUMBAI_LOCALITIES.find(ml => ml.value === locality);
                  return (
                    <div key={locality} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{localityObj ? localityObj.label : locality}</span>
                      <button onClick={() => removeArrayValue("localities", locality)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {MUMBAI_LOCALITIES.map((locality) => (
                <Button
                  key={locality.value}
                  variant={formData.localities.includes(locality.value) ? "default" : "outline"}
                  onClick={() => toggleArrayValue("localities", locality.value)}
                  className="justify-start h-10 text-sm"
                >
                  {locality.label}
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Furnishing preference? (Select multiple)</h3>
            
            {/* Selected furnishing */}
            {formData.furnishing.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.furnishing.map((furnishing) => (
                  <div key={furnishing} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm">{furnishing.replace('_', ' ')}</span>
                    <button onClick={() => removeArrayValue("furnishing", furnishing)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {FURNISHING_OPTIONS.map((furnishing) => (
                <Button
                  key={furnishing}
                  variant={formData.furnishing.includes(furnishing) ? "default" : "outline"}
                  onClick={() => toggleArrayValue("furnishing", furnishing)}
                  className="h-12 justify-start"
                >
                  {furnishing.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact details (required)</h3>
            <p className="text-gray-600">We need your phone number to show you properties and help with your search.</p>
            
            {/* Summary of selections */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Preferences:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Type:</strong> {formData.listingType}</p>
                {formData.budget && <p><strong>Budget:</strong> {formData.budget}</p>}
                {(formData.customMinBudget || formData.customMaxBudget) && (
                  <p><strong>Custom Budget:</strong> ₹{formData.customMinBudget} - ₹{formData.customMaxBudget}</p>
                )}
                {formData.propertyTypes.length > 0 && <p><strong>Property Types:</strong> {formData.propertyTypes.join(", ")}</p>}
                {formData.localities.length > 0 && (
                  <p><strong>Localities:</strong> {formData.localities.map(l => {
                    const locality = MUMBAI_LOCALITIES.find(ml => ml.value === l);
                    return locality ? locality.label : l;
                  }).join(", ")}</p>
                )}
                {formData.furnishing.length > 0 && <p><strong>Furnishing:</strong> {formData.furnishing.map(f => f.replace('_', ' ')).join(", ")}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Phone number *"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                type="tel"
                required
                className="h-12"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.listingType !== "";
      case 1: return formData.budget || (formData.customMinBudget && formData.customMaxBudget);
      case 2: return formData.propertyTypes.length > 0;
      case 3: return formData.localities.length > 0;
      case 4: return formData.furnishing.length > 0;
      case 5: return formData.phoneNumber !== "";
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Find Your Perfect Property</CardTitle>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{STEPS[currentStep]}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Find Properties</span>
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}