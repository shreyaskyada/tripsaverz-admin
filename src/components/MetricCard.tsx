"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui-components/card";
import { Eye, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Tooltip } from "./Tooltip";

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  tooltip?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  tooltip,
}: MetricCardProps) {
  return (
    <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {tooltip ? (
            <Tooltip content={tooltip}>
              <div className="flex items-center gap-2">
                {title}
                <span className="text-gray-400 hover:text-blue-500 transition-colors cursor-help text-xs">
                  ?
                </span>
              </div>
            </Tooltip>
          ) : (
            title
          )}
        </CardTitle>
        <div className="text-blue-600 p-2 rounded-lg bg-blue-50">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {value.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>{description}</span>
          {trend && (
            <div
              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? "text-green-700 bg-green-100 border border-green-200"
                  : "text-red-700 bg-red-100 border border-red-200"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsOverviewProps {
  viewPricesClicks: number;
  leadsGenerated: number;
  totalViews: number;
  viewPricesClicksTrend?: number;
  leadsGeneratedTrend?: number;
  totalViewsTrend?: number;
}

export function MetricsOverview({
  viewPricesClicks,
  leadsGenerated,
  totalViews,
  viewPricesClicksTrend,
  leadsGeneratedTrend,
  totalViewsTrend,
}: MetricsOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <MetricCard
        title="Total Views"
        value={totalViews}
        description="Total search sessions"
        icon={<Eye className="h-5 w-5" />}
        tooltip="Measures the total number of search sessions within the selected time range. This represents overall user engagement with your platform."
        trend={
          totalViewsTrend
            ? {
                value: totalViewsTrend,
                isPositive: totalViewsTrend > 0,
              }
            : undefined
        }
      />
      <MetricCard
        title="View Prices Clicks"
        value={viewPricesClicks}
        description="Total clicks on view prices"
        icon={<Eye className="h-5 w-5" />}
        tooltip="Measures the total number of times users clicked the 'View Prices' button within the selected time range. This indicates user interest in pricing information."
        trend={
          viewPricesClicksTrend
            ? {
                value: viewPricesClicksTrend,
                isPositive: viewPricesClicksTrend > 0,
              }
            : undefined
        }
      />
      <MetricCard
        title="Leads Generated"
        value={leadsGenerated}
        description="Total provider clicks"
        icon={<Users className="h-5 w-5" />}
        tooltip="Counts the total number of provider link clicks (leads) generated within the selected time range. These represent users who showed intent to book."
        trend={
          leadsGeneratedTrend
            ? {
                value: leadsGeneratedTrend,
                isPositive: leadsGeneratedTrend > 0,
              }
            : undefined
        }
      />
    </div>
  );
}
