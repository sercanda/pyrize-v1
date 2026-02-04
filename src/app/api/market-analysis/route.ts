import { NextRequest, NextResponse } from "next/server";
import { marketAnalysisService } from "@/lib/services/market-analysis/market-analysis-service";
import { MarketAnalysisOptions } from "@/lib/services/market-analysis/types";

export const maxDuration = 120; // 2 minutes for scraping

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    const options: MarketAnalysisOptions = {
      location,
      province: searchParams.get("province") || undefined,
      district: searchParams.get("district") || undefined,
      neighborhood: searchParams.get("neighborhood") || undefined,
      forceRefresh: searchParams.get("forceRefresh") === "true",
      maxCacheAgeHours: searchParams.get("maxAgeHours")
        ? parseInt(searchParams.get("maxAgeHours")!, 10)
        : undefined,
    };

    const data = await marketAnalysisService.getMarketAnalysis(options);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch market analysis data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[MarketAnalysis API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual refresh
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location } = body;

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const options: MarketAnalysisOptions = {
      location,
      province: body.province,
      district: body.district,
      neighborhood: body.neighborhood,
      forceRefresh: true,
    };

    const data = await marketAnalysisService.getMarketAnalysis(options);

    return NextResponse.json({
      success: true,
      data,
      refreshed: true,
    });
  } catch (error) {
    console.error("[MarketAnalysis API] POST Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

