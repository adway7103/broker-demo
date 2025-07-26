const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mockProperties = [
  {
    title: "Luxurious 3BHK Sea-facing Apartment in Bandra West",
    description: "Experience the best of Mumbai living in this stunning sea-facing apartment. Features include a spacious living room, modern kitchen with premium appliances, master bedroom with walk-in closet, and a private balcony overlooking the Arabian Sea. Located in the heart of Bandra West with easy access to restaurants, cafes, and shopping centers.",
    price: 8500000,
    currency: "INR",
    propertyType: "3BHK",
    listingType: "BUY",
    locality: "BANDRA_WEST",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 1850,
    bedrooms: 3,
    bathrooms: 3,
    isRented: false,
    features: [
      "Sea View",
      "Swimming Pool",
      "Gym",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Air Conditioning",
      "Balcony",
      "Club House"
    ]
  },
  {
    title: "Spacious 2BHK Apartment for Rent in Andheri East",
    description: "Well-maintained 2BHK apartment in a prime location of Andheri East. Close to metro station, shopping malls, and IT parks. Perfect for working professionals and families. Features modern amenities and is ready to move in.",
    price: 45000,
    currency: "INR",
    propertyType: "2BHK",
    listingType: "RENT",
    locality: "ANDHERI_EAST",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "SEMI_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    isRented: false,
    features: [
      "Metro Connectivity",
      "Parking",
      "Security",
      "Elevator",
      "Power Backup",
      "Water Supply",
      "Balcony",
      "CCTV"
    ]
  },
  {
    title: "Modern 1BHK Studio in Lower Parel",
    description: "Contemporary studio apartment in the business district of Lower Parel. Perfect for young professionals working in nearby corporate offices. Features high-end furnishing, modern kitchen, and great city views. Walking distance to Phoenix Mills and metro station.",
    price: 35000,
    currency: "INR",
    propertyType: "1BHK",
    listingType: "RENT",
    locality: "LOWER_PAREL",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    isRented: false,
    features: [
      "City View",
      "WiFi",
      "Air Conditioning",
      "Security",
      "Elevator",
      "Power Backup",
      "Water Supply",
      "Gym",
      "Metro Connectivity"
    ]
  },
  {
    title: "Premium 4BHK Penthouse in Worli",
    description: "Exclusive penthouse with panoramic views of Mumbai skyline and the sea. Features include a private terrace, jacuzzi, modular kitchen, and premium Italian marble flooring. Located in one of Mumbai's most prestigious neighborhoods with world-class amenities.",
    price: 25000000,
    currency: "INR",
    propertyType: "Penthouse",
    listingType: "BUY",
    locality: "WORLI",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 3500,
    bedrooms: 4,
    bathrooms: 5,
    isRented: false,
    features: [
      "Panoramic Views",
      "Private Terrace",
      "Jacuzzi",
      "Swimming Pool",
      "Gym",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Air Conditioning",
      "Club House",
      "Concierge Service"
    ]
  },
  {
    title: "Affordable 2BHK in Borivali West",
    description: "Well-designed 2BHK apartment in a family-friendly society in Borivali West. Close to schools, hospitals, and local markets. Great for first-time home buyers looking for value for money. Features include modern amenities and good ventilation.",
    price: 4500000,
    currency: "INR",
    propertyType: "2BHK",
    listingType: "BUY",
    locality: "BORIVALI_WEST",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "UNFURNISHED",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 1100,
    bedrooms: 2,
    bathrooms: 2,
    isRented: false,
    features: [
      "Family Society",
      "Kids Play Area",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Garden",
      "CCTV"
    ]
  },
  {
    title: "Tech Professional's Dream in Powai",
    description: "Modern 2BHK apartment strategically located in Powai, perfect for IT professionals. Walking distance to Hiranandani Gardens and close to tech parks. Features contemporary design, high-speed internet connectivity, and 24/7 security.",
    price: 42000,
    currency: "INR",
    propertyType: "2BHK",
    listingType: "RENT",
    locality: "POWAI",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 1300,
    bedrooms: 2,
    bathrooms: 2,
    isRented: false,
    features: [
      "Tech Hub Location",
      "High Speed Internet",
      "Swimming Pool",
      "Gym",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Air Conditioning",
      "Club House"
    ]
  },
  {
    title: "Family Villa in Thane West",
    description: "Spacious 3BHK independent villa with private garden and car parking. Perfect for families who want more space and privacy. Features include a large living area, separate dining room, modular kitchen, and two balconies. Located in a quiet residential area.",
    price: 6800000,
    currency: "INR",
    propertyType: "Villa",
    listingType: "BUY",
    locality: "THANE_WEST",
    city: "Thane",
    state: "Maharashtra",
    furnishing: "SEMI_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 2200,
    bedrooms: 3,
    bathrooms: 3,
    isRented: false,
    features: [
      "Private Garden",
      "Independent House",
      "Car Parking",
      "Security",
      "Power Backup",
      "Water Supply",
      "Balcony",
      "Peaceful Location"
    ]
  },
  {
    title: "Compact 1BHK near Juhu Beach",
    description: "Cozy 1BHK apartment just minutes away from the famous Juhu Beach. Perfect for beach lovers and those who enjoy the coastal lifestyle. The apartment is well-ventilated with sea breeze and offers easy access to restaurants and entertainment.",
    price: 28000,
    currency: "INR",
    propertyType: "1BHK",
    listingType: "RENT",
    locality: "JUHU",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "SEMI_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 550,
    bedrooms: 1,
    bathrooms: 1,
    isRented: false,
    features: [
      "Beach Access",
      "Sea Breeze",
      "Security",
      "Power Backup",
      "Water Supply",
      "Balcony",
      "Entertainment Hub"
    ]
  },
  {
    title: "Executive 3BHK in Malad West",
    description: "Well-appointed 3BHK apartment in a premium society in Malad West. Features include modern fixtures, ample storage, and a lovely garden view. Close to malls, schools, and hospitals. Perfect for executives and growing families.",
    price: 55000,
    currency: "INR",
    propertyType: "3BHK",
    listingType: "RENT",
    locality: "MALAD_WEST",
    city: "Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 1650,
    bedrooms: 3,
    bathrooms: 3,
    isRented: false,
    features: [
      "Garden View",
      "Premium Society",
      "Swimming Pool",
      "Gym",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Air Conditioning",
      "Kids Play Area"
    ]
  },
  {
    title: "Luxury 5BHK Duplex in Navi Mumbai",
    description: "Magnificent 5BHK duplex apartment with two levels of luxury living. Features include a grand staircase, multiple balconies, servant quarters, and premium fittings throughout. Located in a high-end society with world-class amenities and excellent connectivity.",
    price: 18500000,
    currency: "INR",
    propertyType: "5BHK",
    listingType: "BUY",
    locality: "NAVI_MUMBAI",
    city: "Navi Mumbai",
    state: "Maharashtra",
    furnishing: "FULLY_FURNISHED",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    videos: [],
    area: 4200,
    bedrooms: 5,
    bathrooms: 6,
    isRented: false,
    features: [
      "Duplex Layout",
      "Grand Staircase",
      "Servant Quarters",
      "Multiple Balconies",
      "Swimming Pool",
      "Gym",
      "Security",
      "Elevator",
      "Parking",
      "Power Backup",
      "Water Supply",
      "Air Conditioning",
      "Club House",
      "Concierge Service",
      "Tennis Court"
    ]
  }
];

async function clearAndAddMockProperties() {
  try {
    console.log('🗑️  Clearing existing properties...');
    
    // First delete all shortlists (due to foreign key constraints)
    await prisma.shortlist.deleteMany();
    console.log('✅ Cleared existing shortlists');
    
    // Then delete all properties
    await prisma.property.deleteMany();
    console.log('✅ Cleared existing properties');

    console.log('📝 Adding mock properties...');

    // Add mock properties one by one
    let count = 0;
    for (const propertyData of mockProperties) {
      const property = await prisma.property.create({
        data: propertyData,
      });
      count++;
      console.log(`✅ Added: ${property.title} (${count}/${mockProperties.length})`);
    }

    console.log(`🎉 Successfully added ${count} mock properties!`);
    console.log('📊 Summary:');
    
    const total = await prisma.property.count();
    const forRent = await prisma.property.count({ where: { listingType: 'RENT' } });
    const forSale = await prisma.property.count({ where: { listingType: 'BUY' } });
    
    console.log(`   Total Properties: ${total}`);
    console.log(`   For Rent: ${forRent}`);
    console.log(`   For Sale: ${forSale}`);
    
    // Show locality distribution
    console.log('\n🏙️  Properties by Locality:');
    const localities = await prisma.property.groupBy({
      by: ['locality'],
      _count: { locality: true }
    });
    
    localities.forEach(loc => {
      const label = loc.locality.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`   ${label}: ${loc._count.locality}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearAndAddMockProperties(); 