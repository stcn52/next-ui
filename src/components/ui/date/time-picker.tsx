"use client"

/**
 * TimePicker — 独立时间选择组件（不包含日期）。
 *
 * Props:
 * - value?: string           HH:mm 格式受控值
 * - defaultValue?: string    HH:mm 格式非受控初始值
 * - onChange?(v: string): void
 * - hourCycle?: 12 | 24      默认 24
 * - disabled?: boolean
 * - placeholder?: string
 * - className?: string
 */

import * as React from "react"
import { ClockIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimePickerProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  hourCycle?: 12 | 24
  disabled?: boolean
  placeholder?: string
  className?: string
}

// ─── Parse / format helpers ───────────────────────────────────────────────────

function parseTime(hhmm: string): [number, number] {
  const [h, m] = hhmm.split(":").map(Number)
  return [isNaN(h) ? 0 : h, isNaN(m) ? 0 : m]
}

function formatTime(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

// ─── Spinner column ───────────────────────────────────────────────────────────

interface SpinnerProps {
  value: number
  min: number
  max: number
  label: string
  onChange: (v: number) => void
}

function Spinner({ value, min, max, label, onChange }: SpinnerProps) {
  const inc = () => onChange(value < max ? value + 1 : min)
  const dec = () => onChange(value > min ? value - 1 : max)

  return (
    <div className="flex flex-col items-center gap-0.5" role="group" aria-label={label}>
      <Button variant="ghost" size="icon" className="size-8 rounded-md" onClick={inc} tabIndex={-1} aria-label={`${label} 增加`}>
        <ChevronUpIcon className="size-3.5" />
      </Button>
      <div
        role="spinbutton"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        className="w-10 rounded-md py-0.5 text-center font-mono text-lg font-bold select-none cursor-default focus:outline-none focus:ring-2 focus:ring-ring"
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") { e.preventDefault(); inc() }
          if (e.key === "ArrowDown") { e.preventDefault(); dec() }
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <Button variant="ghost" size="icon" className="size-8 rounded-md" onClick={dec} tabIndex={-1} aria-label={`${label} 减少`}>
        <ChevronDownIcon className="size-3.5" />
      </Button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TimePicker({
  value,
  defaultValue = "00:00",
  onChange,
  hourCycle = 24,
  disabled = false,
  placeholder = "选择时间",
  className,
}: TimePickerProps) {
  const isControlled = value !== undefined
  const [internalVal, setInternalVal] = React.useState(defaultValue)
  const current = isControlled ? value! : internalVal

  const [h, m] = parseTime(current)
  const [period, setPeriod] = React.useState<"AM" | "PM">(h >= 12 ? "PM" : "AM")
  const displayH = hourCycle === 12 ? (h % 12 === 0 ? 12 : h % 12) : h
  const maxH = hourCycle === 12 ? 12 : 23

  const [open, setOpen] = React.useState(false)

  const emit = React.useCallback(
    (newH: number, newM: number) => {
      const str = formatTime(newH, newM)
      if (!isControlled) setInternalVal(str)
      onChange?.(str)
    },
    [isControlled, onChange],
  )

  const handleHour = (dh: number) => {
    let realH = dh
    if (hourCycle === 12) {
      realH = period === "AM" ? (dh === 12 ? 0 : dh) : (dh === 12 ? 12 : dh + 12)
    }
    emit(realH, m)
  }

  const handleMinute = (dm: number) => emit(h, dm)

  const handlePeriod = () => {
    const next = period === "AM" ? "PM" : "AM"
    setPeriod(next)
    let realH = displayH
    if (next === "AM") realH = displayH === 12 ? 0 : displayH
    else realH = displayH === 12 ? 12 : displayH + 12
    emit(realH, m)
  }

  const label = current && current !== "00:00"
    ? hourCycle === 12
      ? `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`
      : current
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
              "justify-start text-left font-normal h-9 min-w-[140px]",
              !label && "text-muted-foreground",
              className,
            )}
          >
            <ClockIcon className="mr-2 size-4 shrink-0 opacity-60" />
            {label ?? placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex items-center gap-1.5">
          <Spinner value={displayH} min={hourCycle === 12 ? 1 : 0} max={maxH} label="小时" onChange={handleHour} />
          <span className="text-xl font-bold text-muted-foreground">:</span>
          <Spinner value={m} min={0} max={59} label="分钟" onChange={handleMinute} />
          {hourCycle === 12 && (
            <Button variant="outline" size="sm" onClick={handlePeriod} className="ml-2 w-12 text-xs">
              {period}
            </Button>
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)}>确定</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
