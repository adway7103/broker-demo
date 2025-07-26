import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const where: any = {};
    
    // Listing Type (exact match)
    if (searchParams.get("listingType")) {
      where.listingType = searchParams.get("listingType");
    }
    
    // Property Type (exact match or multiple)
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      // Handle multiple property types separated by comma
      const types = propertyType.split(',').map(t => t.trim());
      if (types.length === 1) {
        where.propertyType = types[0];
      } else {
        where.propertyType = { in: types };
      }
    }
    
    // Locality (exact match for enum values)
    const locality = searchParams.get("locality");
    if (locality) {
      // Handle multiple localities separated by comma
      const localities = locality.split(',').map(l => l.trim());
      if (localities.length === 1) {
        where.locality = localities[0];
      } else {
        where.locality = { in: localities };
      }
    }
    
    // Furnishing (exact match or multiple)
    const furnishing = searchParams.get("furnishing");
    if (furnishing) {
      // Handle multiple furnishing options separated by comma
      const furnishingOptions = furnishing.split(',').map(f => f.trim());
      if (furnishingOptions.length === 1) {
        where.furnishing = furnishingOptions[0];
      } else {
        where.furnishing = { in: furnishingOptions };
      }
    }

    // Budget filtering using minPrice and maxPrice
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseInt(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseInt(maxPrice);
      }
    }

    // Search text (for title, description, locality)
    const searchText = searchParams.get("search");
    if (searchText) {
      where.OR = [
        { title: { contains: searchText, mode: "insensitive" } },
        { description: { contains: searchText, mode: "insensitive" } },
        { locality: { contains: searchText, mode: "insensitive" } }
      ];
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    console.log("Search where clause:", JSON.stringify(where, null, 2));

    const properties = await prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.property.count({ where });

    console.log(`Found ${properties.length} properties out of ${total} total`);

    // Always return the same structure
    return NextResponse.json({
      properties: properties || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      price,
      currency = "INR",
      propertyType,
      listingType,
      locality,
      city,
      state,
      furnishing,
      images = [],
      videos = [],
      features = [],
      area,
      bedrooms,
      bathrooms,
    } = body;

    // Validate required fields
    if (!title || !description || !price || !propertyType || !listingType || !locality || !furnishing) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseInt(price),
        currency,
        propertyType,
        listingType,
        locality,
        city: city || null,
        state: state || null,
        furnishing,
        images,
        videos,
        features,
        area: area ? parseInt(area) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 