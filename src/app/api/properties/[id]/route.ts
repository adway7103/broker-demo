import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isRented,
    } = body;

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: typeof price === 'string' ? parseInt(price) : price,
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
        area: area ? (typeof area === 'string' ? parseInt(area) : area) : null,
        bedrooms: bedrooms ? (typeof bedrooms === 'string' ? parseInt(bedrooms) : bedrooms) : null,
        bathrooms: bathrooms ? (typeof bathrooms === 'string' ? parseInt(bathrooms) : bathrooms) : null,
        isRented: isRented !== undefined ? isRented : existingProperty.isRented,
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/properties/[id] - Partial update (e.g., toggle rented status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Update only the provided fields
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Delete related shortlists first (cascade should handle this, but being explicit)
    await prisma.shortlist.deleteMany({
      where: { propertyId: params.id },
    });

    // Delete the property
    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 