const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProperties = [
  {
    title: "Luxury 3BHK Apartment in Bandra West",
    description: "Spacious 3BHK apartment with sea view, modern amenities, and prime location in Bandra West. Perfect for families looking for comfort and convenience.",
    price: 85000,
    currency: "INR",
    propertyType: "3BHK",
    listingType: "RENT",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    features: ["Air Conditioning", "Parking", "Swimming Pool", "Gym", "Security", "Elevator"],
    area: 1500,
    bedrooms: 3,
    bathrooms: 3,
    isRented: false
  },
  {
    title: "Modern 2BHK in Andheri East",
    description: "Well-designed 2BHK apartment in a gated community with all modern amenities. Close to metro station and IT parks.",
    price: 45000,
    currency: "INR",
    propertyType: "2BHK",
    listingType: "RENT",
    locality: "Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "SEMI_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    features: ["Parking", "Security", "Elevator", "Power Backup"],
    area: 1000,
    bedrooms: 2,
    bathrooms: 2,
    isRented: false
  },
  {
    title: "Premium Villa in Juhu",
    description: "Independent villa with private garden, 4 bedrooms, and premium location near Juhu Beach. Perfect for large families.",
    price: 45000000,
    currency: "INR",
    propertyType: "Villa",
    listingType: "BUY",
    locality: "Juhu",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    features: ["Air Conditioning", "Parking", "Swimming Pool", "Garden", "Security", "WiFi"],
    area: 3500,
    bedrooms: 4,
    bathrooms: 4,
    isRented: false
  },
  {
    title: "Cozy Studio Apartment in Powai",
    description: "Perfect studio apartment for working professionals. Fully furnished with all amenities in a prime Powai location.",
    price: 28000,
    currency: "INR",
    propertyType: "Studio",
    listingType: "RENT",
    locality: "Powai",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    features: ["Air Conditioning", "WiFi", "Security", "Elevator"],
    area: 450,
    bedrooms: 1,
    bathrooms: 1,
    isRented: true
  },
  {
    title: "Spacious 4BHK Penthouse in Lower Parel",
    description: "Luxury penthouse with panoramic city views, terrace garden, and premium fittings. Located in the heart of Lower Parel business district.",
    price: 25000000,
    currency: "INR",
    propertyType: "Penthouse",
    listingType: "BUY",
    locality: "Lower Parel",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    features: ["Air Conditioning", "Parking", "Gym", "Security", "Elevator", "Balcony", "Garden"],
    area: 2800,
    bedrooms: 4,
    bathrooms: 4,
    isRented: false
  }
];

async function addSampleProperties() {
  try {
    console.log('Adding sample properties...');
    
    for (const propertyData of sampleProperties) {
      const property = await prisma.property.create({
        data: propertyData
      });
      console.log(`✅ Added: ${property.title}`);
    }
    
    console.log('\n🎉 All sample properties added successfully!');
    console.log('You can now view them in the admin panel or listings page.');
    
  } catch (error) {
    console.error('Error adding sample properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProperties(); 