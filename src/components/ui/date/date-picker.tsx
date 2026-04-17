"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/date/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover"
import { useLocale, formatMessage } from "@/components/config-provider"

function DatePicker({
  date,
  onDateChange,
  placeholder,
  className,
  ...props
}: {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
} & Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const resolvedPlaceholder = placeholder ?? locale.pickADate

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={date ? formatMessage(locale.selectedDate, { date: format(date, 'PPP') }) : resolvedPlaceholder}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon />
        {date ? format(date, "PPP") : <span>{resolvedPlaceholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onDateChange?.(d)
            setOpen(false)
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
