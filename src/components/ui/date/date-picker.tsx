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
import { useLocale } from "@/components/config-provider"
import type { FieldControlProps } from "@/components/form-engine/widget-adapter"

function DatePicker({
  date,
  onDateChange,
  placeholder,
  className,
  disabled = false,
  fieldProps,
  ...props
}: {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  fieldProps?: Pick<FieldControlProps, "id" | "name" | "aria-describedby" | "aria-invalid" | "aria-labelledby" | "aria-required" | "onBlur">
} & Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const resolvedPlaceholder = placeholder ?? locale.pickADate

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={fieldProps?.id}
            name={fieldProps?.name}
            variant="outline"
            aria-label={fieldProps ? undefined : (date ? format(date, "PPP") : resolvedPlaceholder)}
            aria-labelledby={fieldProps?.["aria-labelledby"]}
            aria-describedby={fieldProps?.["aria-describedby"]}
            aria-invalid={fieldProps?.["aria-invalid"]}
            aria-required={fieldProps?.["aria-required"]}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            onBlur={fieldProps?.onBlur}
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
