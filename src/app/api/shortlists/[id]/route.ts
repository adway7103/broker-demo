import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the shortlist
    await prisma.shortlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Shortlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting shortlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 