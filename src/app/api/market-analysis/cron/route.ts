import { NextRequest, NextResponse } from "next/server";
import { marketAnalysisService } from "@/lib/services/market-analysis/market-analysis-service";

// Protect this endpoint with a secret token
const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (CRON_SECRET && token !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const maxAgeHours = 48; // Refresh data older than 48 hours
    const refreshed = await marketAnalysisService.refreshStaleData(maxAgeHours);

    return NextResponse.json({
      success: true,
      refreshed,
      message: `Refreshed ${refreshed} location(s)`,
    });
  } catch (error) {
    console.error("[MarketAnalysis Cron] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint for manual trigger (development)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const maxAgeHours = searchParams.get("maxAgeHours")
      ? parseInt(searchParams.get("maxAgeHours")!, 10)
      : 48;

    const refreshed = await marketAnalysisService.refreshStaleData(maxAgeHours);

    return NextResponse.json({
      success: true,
      refreshed,
      message: `Refreshed ${refreshed} location(s)`,
    });
  } catch (error) {
    console.error("[MarketAnalysis Cron] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

