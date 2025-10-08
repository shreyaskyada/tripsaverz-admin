"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  startDate?: Date;
  endDate?: Date;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    { mode = "single", selected, onSelect, disabled, className, ...props },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      return days;
    };

    const isSelected = (date: Date) => {
      if (!selected) return false;
      if (mode === "single") {
        return (
          selected instanceof Date &&
          date.toDateString() === selected.toDateString()
        );
      }
      if (
        mode === "range" &&
        typeof selected === "object" &&
        "from" in selected
      ) {
        const { from, to } = selected;
        if (from && date.toDateString() === from.toDateString()) return true;
        if (to && date.toDateString() === to.toDateString()) return true;
      }
      return false;
    };

    const isInRange = (date: Date) => {
      if (mode !== "range" || !selected || typeof selected !== "object")
        return false;
      const { from, to } = selected as { from?: Date; to?: Date };
      if (!from || !to) return false;
      return date >= from && date <= to;
    };

    const isRangeStart = (date: Date) => {
      if (mode !== "range" || !selected || typeof selected !== "object")
        return false;
      const { from } = selected as { from?: Date; to?: Date };
      return from && date.toDateString() === from.toDateString();
    };

    const isRangeEnd = (date: Date) => {
      if (mode !== "range" || !selected || typeof selected !== "object")
        return false;
      const { to } = selected as { from?: Date; to?: Date };
      return to && date.toDateString() === to.toDateString();
    };

    const isDisabled = (date: Date) => {
      if (disabled) return disabled(date);
      return false;
    };

    const handleDateClick = (date: Date) => {
      if (isDisabled(date)) return;
      onSelect?.(date);
    };

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        if (direction === "prev") {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days = getDaysInMonth(currentMonth);

    return (
      <div ref={ref} className={cn("p-3", className)} {...props}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="text-center relative">
              {day ? (
                <>
                  {/* Range background */}
                  {mode === "range" &&
                    isInRange(day) &&
                    !isRangeStart(day) &&
                    !isRangeEnd(day) && (
                      <div className="absolute inset-0 bg-blue-100 -z-10" />
                    )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 font-normal relative z-10",
                      isSelected(day) &&
                        "bg-blue-600 text-white hover:bg-blue-700",
                      isInRange(day) &&
                        !isSelected(day) &&
                        "bg-blue-100 text-blue-900 hover:bg-blue-200",
                      isRangeStart(day) &&
                        "bg-blue-600 text-white hover:bg-blue-700 rounded-l-full",
                      isRangeEnd(day) &&
                        "bg-blue-600 text-white hover:bg-blue-700 rounded-r-full",
                      isDisabled(day) &&
                        "text-gray-400 cursor-not-allowed hover:bg-transparent",
                      !isSelected(day) &&
                        !isDisabled(day) &&
                        !isInRange(day) &&
                        "hover:bg-gray-100"
                    )}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled(day)}
                  >
                    {day.getDate()}
                  </Button>
                </>
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };
