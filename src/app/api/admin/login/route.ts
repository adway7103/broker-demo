import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@broker.com";
    const ADMIN_PASSWORD = "admin123";

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return hardcoded admin user data
    return NextResponse.json({
      success: true,
      user: {
        id: "admin-1",
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "ADMIN"
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 