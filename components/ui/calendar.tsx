"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption:
          "flex items-center justify-center gap-2 pt-1 mb-2 relative",
        caption_label: "sr-only",
        dropdowns: "flex items-center gap-2",
        dropdown:
          "appearance-none bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#44B4D7] focus:border-[#44B4D7]",
        nav: "contents",
        button_previous: "hidden",
        button_next: "hidden",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-normal h-9 w-9 p-0 hover:bg-gray-100 transition-colors cursor-pointer",
          "aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        selected:
          "bg-[#44B4D7] text-white hover:bg-[#3a9cbc] hover:text-white focus:bg-[#44B4D7] focus:text-white",
        today: "bg-gray-100 text-gray-900",
        outside:
          "day-outside text-gray-400 aria-selected:bg-gray-100/50 aria-selected:text-gray-400",
        disabled: "text-gray-300 opacity-50",
        range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-5 w-5 text-gray-600" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
