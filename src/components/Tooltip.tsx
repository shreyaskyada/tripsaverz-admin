"use client";

import { HelpCircle } from "lucide-react";
import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-32 top-full">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          {content}
        </div>
      )}
    </div>
  );
}

interface MetricTooltipProps {
  children: ReactNode;
  metricType: "conversion" | "dailyClicks" | "dailyLeads";
}

const tooltipContent = {
  conversion:
    "Measures the percentage of users who clicked 'View Prices' and then actually clicked on a provider link. Higher percentages indicate better conversion from interest to action.",
  dailyClicks:
    "Shows the average number of 'View Prices' clicks per day within the selected time range. Helps track daily engagement levels and growth trends.",
  dailyLeads:
    "Displays the average number of provider clicks (leads) generated per day. Indicates daily conversion volume and helps forecast revenue potential.",
};

export function MetricTooltip({ children, metricType }: MetricTooltipProps) {
  return (
    <Tooltip content={tooltipContent[metricType]}>
      <div className="flex items-center gap-2">
        {children}
        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
      </div>
    </Tooltip>
  );
}
