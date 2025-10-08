"use client";

import { PopularSearches, TopProviders } from "@/components/AnalyticsCards";
import { MetricsOverview } from "@/components/MetricCard";
import { MetricsChart } from "@/components/MetricsChart";
import { TimeRange, TimeRangeFilter } from "@/components/TimeRangeFilter";
import { MetricTooltip } from "@/components/Tooltip";
import { Button } from "@/ui-components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-components/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  LogOut,
  Plane,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MetricsData {
  viewPricesClicks: {
    total: number;
    data: Array<{ date: string; count: number }>;
  };
  leadsGenerated: {
    total: number;
    data: Array<{ date: string; count: number }>;
  };
  totalViews: {
    total: number;
    data: Array<{ date: string; count: number }>;
  };
  popularSearches: Array<{ route: string; count: number }>;
  topProviders: Array<{ provider: string; count: number }>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentProvider, setCurrentProvider] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchMetrics = async (
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string,
    provider?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ timeRange });
      if (timeRange === "custom" && startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }
      if (provider && provider !== "all") {
        params.append("provider", provider);
      }

      const response = await fetch(`/api/metrics?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await response.json();
      setMetricsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (
    newTimeRange: TimeRange,
    startDate?: string,
    endDate?: string,
    provider?: string
  ) => {
    setTimeRange(newTimeRange);
    setCustomStartDate(startDate || "");
    setCustomEndDate(endDate || "");
    setCurrentProvider(provider || "all");
    fetchMetrics(newTimeRange, startDate, endDate, provider);
  };

  const handleRefresh = () => {
    fetchMetrics(timeRange, customStartDate, customEndDate, currentProvider);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    if (session) {
      fetchMetrics(timeRange, customStartDate, customEndDate, currentProvider);
    }
  }, [session, timeRange, customStartDate, customEndDate, currentProvider]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading && !metricsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading metrics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tripsaverz Admin
                </h1>
                <p className="text-sm text-gray-600">Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-6 space-y-8">
        {/* Time Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TimeRangeFilter
            onTimeRangeChange={handleTimeRangeChange}
            currentTimeRange={timeRange}
            currentProvider={currentProvider}
          />
        </motion.div>

        {/* Metrics Overview */}
        {metricsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MetricsOverview
              viewPricesClicks={metricsData.viewPricesClicks.total}
              leadsGenerated={metricsData.leadsGenerated.total}
              totalViews={metricsData.totalViews.total}
            />
          </motion.div>
        )}

        {/* Charts */}
        {metricsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <MetricsChart
              title="Total Views Trend"
              description="Daily search sessions over time"
              data={metricsData.totalViews.data}
              type="line"
            />
            <MetricsChart
              title="View Prices Clicks Trend"
              description="Daily view prices clicks over time"
              data={metricsData.viewPricesClicks.data}
              type="line"
            />
            <MetricsChart
              title="Leads Generated Trend"
              description="Daily leads generated over time"
              data={metricsData.leadsGenerated.data}
              type="bar"
            />
          </motion.div>
        )}

        {/* Additional Stats */}
        {metricsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <MetricTooltip metricType="conversion">
                    Conversion Rate
                  </MetricTooltip>
                </CardTitle>
                <CardDescription>Leads per view prices click</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {metricsData.viewPricesClicks.total > 0
                    ? (
                        (metricsData.leadsGenerated.total /
                          metricsData.viewPricesClicks.total) *
                        100
                      ).toFixed(2)
                    : "0.00"}
                  %
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <MetricTooltip metricType="dailyClicks">
                    Average Daily Clicks
                  </MetricTooltip>
                </CardTitle>
                <CardDescription>View prices clicks per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {metricsData.viewPricesClicks.data.length > 0
                    ? (
                        metricsData.viewPricesClicks.total /
                        metricsData.viewPricesClicks.data.length
                      ).toFixed(1)
                    : "0"}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <MetricTooltip metricType="dailyLeads">
                    Average Daily Leads
                  </MetricTooltip>
                </CardTitle>
                <CardDescription>Leads generated per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {metricsData.leadsGenerated.data.length > 0
                    ? (
                        metricsData.leadsGenerated.total /
                        metricsData.leadsGenerated.data.length
                      ).toFixed(1)
                    : "0"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Cards */}
        {metricsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <PopularSearches searches={metricsData.popularSearches} />
            <TopProviders providers={metricsData.topProviders} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
