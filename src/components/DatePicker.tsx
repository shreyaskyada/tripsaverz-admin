"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/ui-components/button";
import { Calendar } from "@/ui-components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui-components/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import moment, { Moment } from "moment";
import { useState } from "react";

type DateRangePickerProps = {
  startDate?: Moment;
  endDate?: Moment;
  onDateChange?: (start: Moment | undefined, end: Moment | undefined) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

const formatDateRange = (
  start: Moment | undefined,
  end: Moment | undefined
): string => {
  if (!start && !end) return "Select date range";
  if (start && !end) return `${start.format("DD/MM/YYYY")} - Select end date`;
  if (!start && end) return `Select start date - ${end.format("DD/MM/YYYY")}`;
  return `${start!.format("DD/MM/YYYY")} - ${end!.format("DD/MM/YYYY")}`;
};

const DateRangePicker = ({
  startDate,
  endDate,
  onDateChange,
  className,
  placeholder,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Moment | undefined>(
    startDate
  );
  const [tempEndDate, setTempEndDate] = useState<Moment | undefined>(endDate);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const momentDate = moment(selectedDate);

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // First selection or reset after complete selection
      setTempStartDate(momentDate);
      setTempEndDate(undefined);
    } else if (momentDate.isBefore(tempStartDate)) {
      // If selected date is before start, make it the new start
      setTempStartDate(momentDate);
      setTempEndDate(undefined);
    } else {
      // Second selection - set as end date
      setTempEndDate(momentDate);
      // Call the callback with the completed range
      if (onDateChange) {
        onDateChange(tempStartDate, momentDate);
      }
      // Close the popover after selection
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const handleClear = () => {
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    if (onDateChange) {
      onDateChange(undefined, undefined);
    }
  };

  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              className,
              "w-full justify-start h-11 text-left font-normal focus:ring-2 focus:ring-blue-500 border-gray-200 hover:border-blue-500 transition-colors",
              !startDate && !endDate && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {placeholder || formatDateRange(startDate, endDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-lg border border-gray-200">
          <div className="p-4">
            <div className="mb-3 text-sm text-gray-600">
              {!tempStartDate
                ? "Select start date"
                : !tempEndDate
                ? "Select end date"
                : "Range selected"}
            </div>
            <Calendar
              mode="range"
              selected={{
                from: tempStartDate?.toDate(),
                to: tempEndDate?.toDate(),
              }}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              className="rounded-md"
            />
            <div className="flex justify-center mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="w-full"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
