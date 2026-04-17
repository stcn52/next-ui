"use client"

/**
 * DateTimePicker — Popover 内嵌 Calendar + 时间(时/分)选择器。
 *
 * Props:
 * - value?: Date           受控值
 * - defaultValue?: Date    非受控初始值
 * - onChange?(d: Date): void
 * - disabled?: boolean
 * - placeholder?: string
 * - hourCycle?: 12 | 24   默认 24
 */

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, ClockIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/date/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover"
import { Separator } from "@/components/ui/display/separator"
import { cn } from "@/lib/utils"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DateTimePickerProps {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date) => void
  disabled?: boolean
  placeholder?: string
  hourCycle?: 12 | 24
  className?: string
}

// ─── Time Spinner ────────────────────────────────────────────────────────────

interface TimeSpinnerProps {
  value: number
  min: number
  max: number
  label: string
  onChange: (v: number) => void
}

function TimeSpinner({ value, min, max, label, onChange }: TimeSpinnerProps) {
  const increment = () => onChange(value < max ? value + 1 : min)
  const decrement = () => onChange(value > min ? value - 1 : max)

  return (
    <div className="flex flex-col items-center select-none" role="group" aria-label={label}>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-md"
        onClick={increment}
        tabIndex={-1}
        aria-label={`${label} 增加`}
      >
        <ChevronUpIcon className="size-3.5" />
      </Button>
      <div
        role="spinbutton"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        className="w-10 text-center text-base font-mono font-semibold py-1 rounded cursor-default focus:outline-none focus:ring-2 focus:ring-ring"
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") { e.preventDefault(); increment() }
          if (e.key === "ArrowDown") { e.preventDefault(); decrement() }
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-md"
        onClick={decrement}
        tabIndex={-1}
        aria-label={`${label} 减少`}
      >
        <ChevronDownIcon className="size-3.5" />
      </Button>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function DateTimePicker({
  value,
  defaultValue,
  onChange,
  disabled = false,
  placeholder = "选择日期与时间",
  hourCycle = 24,
  className,
}: DateTimePickerProps) {
  // Uncontrolled fallback
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internalDate

  const [open, setOpen] = React.useState(false)
  const [hour, setHour] = React.useState(current ? current.getHours() : 0)
  const [minute, setMinute] = React.useState(current ? current.getMinutes() : 0)
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    current ? (current.getHours() >= 12 ? "PM" : "AM") : "AM",
  )

  // Keep hour/minute in sync when controlled value changes
  React.useEffect(() => {
    if (current) {
      setHour(current.getHours())
      setMinute(current.getMinutes())
      setPeriod(current.getHours() >= 12 ? "PM" : "AM")
    }
  }, [current])

  const realHour = React.useMemo(() => {
    if (hourCycle === 12) {
      if (period === "AM") return hour === 12 ? 0 : hour
      return hour === 12 ? 12 : hour + 12
    }
    return hour
  }, [hour, period, hourCycle])

  const displayHour = hourCycle === 12 ? (hour === 0 ? 12 : hour) : hour
  const maxHour = hourCycle === 12 ? 12 : 23

  const buildDate = (base: Date | undefined, h: number, m: number) => {
    const d = base ? new Date(base) : new Date()
    d.setHours(h, m, 0, 0)
    return d
  }

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return
    const next = buildDate(day, realHour, minute)
    if (!isControlled) setInternalDate(next)
    onChange?.(next)
  }

  const handleHourChange = (h: number) => {
    setHour(h)
    if (current) {
      const rh = hourCycle === 12 ? (period === "AM" ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12)) : h
      const next = buildDate(current, rh, minute)
      if (!isControlled) setInternalDate(next)
      onChange?.(next)
    }
  }

  const handleMinuteChange = (m: number) => {
    setMinute(m)
    if (current) {
      const next = buildDate(current, realHour, m)
      if (!isControlled) setInternalDate(next)
      onChange?.(next)
    }
  }

  const handlePeriodToggle = () => {
    const next = period === "AM" ? "PM" : "AM"
    setPeriod(next)
    if (current) {
      const rh = next === "AM" ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12)
      const d = buildDate(current, rh, minute)
      if (!isControlled) setInternalDate(d)
      onChange?.(d)
    }
  }

  const formatted = current
    ? format(current, hourCycle === 24 ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd hh:mm aa", { locale: zhCN })
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={placeholder}
            disabled={disabled}
            className={cn(
              "h-8 min-w-[220px] justify-start text-left font-normal",
              !current && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
            {formatted ?? placeholder}
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={current}
          onSelect={handleDaySelect}
          initialFocus
        />
        <Separator />
        {/* Time picker */}
        <div className="flex items-center gap-1 px-3 py-2">
          <ClockIcon className="mr-1.5 size-4 text-muted-foreground" />
          <TimeSpinner value={displayHour} min={hourCycle === 12 ? 1 : 0} max={maxHour} label="小时" onChange={handleHourChange} />
          <span className="text-lg font-mono font-bold text-muted-foreground px-1">:</span>
          <TimeSpinner value={minute} min={0} max={59} label="分钟" onChange={handleMinuteChange} />
          {hourCycle === 12 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-1.5 w-11 text-xs"
              onClick={handlePeriodToggle}
            >
              {period}
            </Button>
          )}
        </div>
        {current && (
          <div className="flex justify-end border-t px-3 py-1.5">
            <Button size="sm" onClick={() => setOpen(false)}>确定</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
