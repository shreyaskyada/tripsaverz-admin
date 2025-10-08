"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui-components/select";
import { motion } from "framer-motion";
import { Calendar, Filter } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangePicker from "./DatePicker";

export type TimeRange =
  | "today"
  | "yesterday"
  | "week"
  | "lastWeek"
  | "month"
  | "lastMonth"
  | "custom";

interface TimeRangeFilterProps {
  onTimeRangeChange: (
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string,
    provider?: string
  ) => void;
  currentTimeRange: TimeRange;
  currentProvider?: string;
}

export function TimeRangeFilter({
  onTimeRangeChange,
  currentTimeRange,
  currentProvider = "all",
}: TimeRangeFilterProps) {
  const [customStartDate, setCustomStartDate] = useState<
    moment.Moment | undefined
  >();
  const [customEndDate, setCustomEndDate] = useState<
    moment.Moment | undefined
  >();
  const [localTimeRange, setLocalTimeRange] =
    useState<TimeRange>(currentTimeRange);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalTimeRange(currentTimeRange);
  }, [currentTimeRange]);

  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "Current Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "month", label: "Current Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  const providerOptions = [
    { value: "all", label: "All Providers" },
    { value: "Aertrip", label: "AERTRIP" },
    { value: "Ease my trip", label: "EASEMYTRIP" },
    { value: "Clear trip", label: "CLEARTRIP" },
    { value: "Budget Ticket", label: "BUDGETTICKET" },
    { value: "Flight network", label: "FLIGHTNETWORK" },
    { value: "Tripodeal", label: "TRIPODEAL" },
  ];

  const handleTimeRangeChange = (value: TimeRange) => {
    setLocalTimeRange(value);
    if (value === "custom") {
      // Don't trigger the API call until dates are selected
      return;
    }
    onTimeRangeChange(value, undefined, undefined, currentProvider);
  };

  const handleProviderChange = (value: string) => {
    onTimeRangeChange(currentTimeRange, undefined, undefined, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="h-5 w-5 text-blue-600" />
            Time Range Filter
          </CardTitle>
          <CardDescription className="text-gray-600">
            Select a time range to filter the metrics data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Time Range
              </label>
              <Select
                value={localTimeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Provider
              </label>
              <Select
                value={currentProvider}
                onValueChange={handleProviderChange}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {localTimeRange === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t pt-4"
            >
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Select Custom Date Range
                </h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Date Range
                  </label>
                  <DateRangePicker
                    startDate={customStartDate}
                    endDate={customEndDate}
                    onDateChange={(start, end) => {
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                      // Automatically apply the range when both dates are selected
                      if (start && end) {
                        const startDate = start.toDate();
                        const endDate = end.toDate();
                        const today = new Date();

                        if (startDate <= endDate && endDate <= today) {
                          const diffInDays = Math.ceil(
                            (endDate.getTime() - startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          if (diffInDays <= 180) {
                            onTimeRangeChange(
                              "custom",
                              start.format("YYYY-MM-DD"),
                              end.format("YYYY-MM-DD"),
                              currentProvider
                            );
                          } else {
                            alert("Date range cannot exceed 6 months");
                          }
                        }
                      }
                    }}
                    placeholder="Select date range"
                    maxDate={new Date()}
                    minDate={new Date("2020-01-01")}
                  />
                </div>

                {/* Date Range Info */}
                {customStartDate && customEndDate && (
                  <div className="rounded-lg p-3 border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Selected range:{" "}
                        <strong>{customStartDate.format("DD/MM/YYYY")}</strong>{" "}
                        to <strong>{customEndDate.format("DD/MM/YYYY")}</strong>
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {customEndDate.diff(customStartDate, "days") + 1} days
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
