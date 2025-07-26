import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, phoneNumber, email } = body;

    // Validate required fields
    if (!propertyId || !phoneNumber) {
      return NextResponse.json(
        { error: "Property ID and phone number are required" },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if already shortlisted
    const existingShortlist = await prisma.shortlist.findUnique({
      where: {
        propertyId_phoneNumber: {
          propertyId,
          phoneNumber,
        },
      },
    });

    if (existingShortlist) {
      return NextResponse.json(
        { error: "Property already shortlisted" },
        { status: 409 }
      );
    }

    // Create shortlist entry
    const shortlist = await prisma.shortlist.create({
      data: {
        propertyId,
        phoneNumber,
        email: email || null,
      },
      include: {
        property: true,
      },
    });

    return NextResponse.json(shortlist, { status: 201 });
  } catch (error) {
    console.error("Error creating shortlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phoneNumber");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (phoneNumber) {
      where.phoneNumber = phoneNumber;
    }

    const shortlists = await prisma.shortlist.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        property: true,
      },
    });

    const total = await prisma.shortlist.count({ where });

    return NextResponse.json({
      shortlists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortlistId = searchParams.get("id");

    if (!shortlistId) {
      return NextResponse.json(
        { error: "Shortlist ID is required" },
        { status: 400 }
      );
    }

    await prisma.shortlist.delete({
      where: { id: shortlistId },
    });

    return NextResponse.json({ message: "Shortlist removed" });
  } catch (error) {
    console.error("Error removing shortlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 