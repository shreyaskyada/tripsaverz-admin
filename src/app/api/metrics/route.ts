import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export interface ViewPricesClickData {
  date: string;
  count: number;
}

export interface LeadsGeneratedData {
  date: string;
  count: number;
}

export interface TotalViewsData {
  date: string;
  count: number;
}

export interface PopularSearch {
  route: string;
  count: number;
}

export interface TopProvider {
  provider: string;
  count: number;
}

export interface MetricsResponse {
  viewPricesClicks: {
    total: number;
    data: ViewPricesClickData[];
  };
  leadsGenerated: {
    total: number;
    data: LeadsGeneratedData[];
  };
  totalViews: {
    total: number;
    data: TotalViewsData[];
  };
  popularSearches: PopularSearch[];
  topProviders: TopProvider[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "today";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const provider = searchParams.get("provider"); // New provider filter

    const client = await clientPromise;
    const db = client.db("flight_analytics"); // Updated to match your actual database
    const collection = db.collection("searchSessions"); // Updated to match your actual collection

    // Calculate date range based on timeRange parameter
    let dateFilter: Record<string, unknown> = {};
    const now = new Date();

    switch (timeRange) {
      case "today":
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        dateFilter = {
          "events.timestamp": {
            $gte: todayStart,
            $lt: todayEnd,
          },
        };
        break;
      case "yesterday":
        const yesterdayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );
        const yesterdayEnd = new Date(
          yesterdayStart.getTime() + 24 * 60 * 60 * 1000
        );
        dateFilter = {
          "events.timestamp": {
            $gte: yesterdayStart,
            $lt: yesterdayEnd,
          },
        };
        break;
      case "week":
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = {
          "events.timestamp": {
            $gte: weekStart,
            $lte: now,
          },
        };
        break;
      case "lastWeek":
        const lastWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekStart = new Date(
          lastWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        dateFilter = {
          "events.timestamp": {
            $gte: lastWeekStart,
            $lt: lastWeekEnd,
          },
        };
        break;
      case "month":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = {
          "events.timestamp": {
            $gte: monthStart,
            $lte: now,
          },
        };
        break;
      case "lastMonth":
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = {
          "events.timestamp": {
            $gte: lastMonthStart,
            $lt: lastMonthEnd,
          },
        };
        break;
      case "custom":
        if (startDate && endDate) {
          dateFilter = {
            "events.timestamp": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          };
        }
        break;
    }

    // Add provider filter if specified
    if (provider && provider !== "all") {
      dateFilter["events.providersClicked.provider"] = provider;
    }

    // Get total views data (all sessions)
    const totalViewsPipeline = [
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$_id",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ];

    const totalViewsData = (await collection
      .aggregate(totalViewsPipeline)
      .toArray()) as TotalViewsData[];
    const totalViews = totalViewsData.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Get view prices clicks data
    const viewPricesPipeline = [
      { $match: dateFilter },
      { $unwind: "$events" },
      { $match: { "events.eventType": "view_prices_click" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$events.timestamp",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ];

    const viewPricesData = (await collection
      .aggregate(viewPricesPipeline)
      .toArray()) as ViewPricesClickData[];
    const totalViewPricesClicks = viewPricesData.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Get leads generated data (provider clicks)
    const leadsPipeline = [
      { $match: dateFilter },
      { $unwind: "$events" },
      { $unwind: "$events.providersClicked" },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$events.providersClicked.timestamp",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ];

    const leadsData = (await collection
      .aggregate(leadsPipeline)
      .toArray()) as LeadsGeneratedData[];
    const totalLeadsGenerated = leadsData.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Get popular searches (top 5 routes)
    const popularSearchesPipeline = [
      { $match: dateFilter },
      {
        $group: {
          _id: {
            from: "$flightMetadata.from_city",
            to: "$flightMetadata.to_city",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          route: {
            $concat: ["$_id.from", " → ", "$_id.to"],
          },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ];

    const popularSearches = (await collection
      .aggregate(popularSearchesPipeline)
      .toArray()) as PopularSearch[];

    // Get top providers (top 5)
    const topProvidersPipeline = [
      { $match: dateFilter },
      { $unwind: "$events" },
      { $unwind: "$events.providersClicked" },
      {
        $group: {
          _id: "$events.providersClicked.provider",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          provider: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ];

    const topProviders = (await collection
      .aggregate(topProvidersPipeline)
      .toArray()) as TopProvider[];

    const response: MetricsResponse = {
      viewPricesClicks: {
        total: totalViewPricesClicks,
        data: viewPricesData,
      },
      leadsGenerated: {
        total: totalLeadsGenerated,
        data: leadsData,
      },
      totalViews: {
        total: totalViews,
        data: totalViewsData,
      },
      popularSearches,
      topProviders,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
