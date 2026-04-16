"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLocale } from "@/components/config-provider"

/**
 * DateRangePicker — 弹出式日期范围选择器。
 *
 * 基于 react-day-picker `Calendar` 的 `mode="range"` 模式，
 * 通过 `Popover` 触发展开，支持 i18n 占位符（`datePicker.pickDateRange`）。
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState<DateRange>()
 * <DateRangePicker dateRange={range} onDateRangeChange={setRange} />
 * ```
 */
function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder,
  numberOfMonths = 2,
  className,
  ...props
}: {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  placeholder?: string
  numberOfMonths?: number
  className?: string
} & Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect" | "numberOfMonths"
>) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const resolvedPlaceholder = placeholder ?? locale.pickDateRange

  const label = React.useMemo(() => {
    if (!dateRange?.from) return null
    if (!dateRange.to) return format(dateRange.from, "PP")
    return `${format(dateRange.from, "PP")} – ${format(dateRange.to, "PP")}`
  }, [dateRange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={label ?? resolvedPlaceholder}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon />
        {label ?? <span>{resolvedPlaceholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={numberOfMonths}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
export type { DateRange }
