import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      phoneNumber,
      email,
      name,
      budget,
      propertyType,
      locality,
      furnishing,
      listingType,
    } = body;

    // Validate required fields
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        phoneNumber,
        email: email || null,
        name: name || null,
        budget: budget || null,
        propertyType: propertyType || null,
        locality: locality || null,
        furnishing: furnishing || null,
        listingType: listingType || null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get filter parameters
    const search = searchParams.get("search") || "";
    const listingType = searchParams.get("listingType") || "";
    const propertyType = searchParams.get("propertyType") || "";
    const locality = searchParams.get("locality") || "";
    const furnishing = searchParams.get("furnishing") || "";
    const budget = searchParams.get("budget") || "";

    // Build where clause for filtering
    const where: any = {};

    // Search filter (name, phone, email)
    if (search) {
      where.OR = [
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // Exact match filters
    if (listingType) {
      where.listingType = { contains: listingType, mode: "insensitive" };
    }

    if (propertyType) {
      where.propertyType = { contains: propertyType, mode: "insensitive" };
    }

    if (locality) {
      where.locality = { contains: locality, mode: "insensitive" };
    }

    if (furnishing) {
      where.furnishing = { contains: furnishing, mode: "insensitive" };
    }

    if (budget) {
      where.budget = { contains: budget, mode: "insensitive" };
    }

    const leads = await prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.lead.count({ where });

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 