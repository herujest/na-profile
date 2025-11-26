import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { recalcAllPartnerCollabCounts, recalcPartnerCollabCount } from "@/lib/portfolio-utils";

// POST /api/partners/bulk-recalculate-collab - Recalculate all partner collaboration counts (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { partnerId } = body;

    // If partnerId provided, recalculate only that partner
    if (partnerId) {
      const partner = await recalcPartnerCollabCount(partnerId);
      return NextResponse.json(
        {
          message: "Partner collaboration count recalculated",
          partner: {
            id: partner.id,
            name: partner.name,
            collaborationCount: partner.collaborationCount,
          },
        },
        { status: 200 }
      );
    }

    // Otherwise, recalculate all partners
    const updatedPartners = await recalcAllPartnerCollabCounts();

    return NextResponse.json(
      {
        message: "All partner collaboration counts recalculated",
        count: updatedPartners.length,
        partners: updatedPartners.map((p) => ({
          id: p.id,
          name: p.name,
          collaborationCount: p.collaborationCount,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error recalculating collaboration counts:", error);
    return NextResponse.json(
      {
        error: "Failed to recalculate collaboration counts",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

