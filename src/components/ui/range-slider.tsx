"use client"

/**
 * RangeSlider — 双端滑块，用于区间选择（价格范围、时间段等）。
 *
 * Props:
 * - value?: [number, number]          受控值
 * - defaultValue?: [number, number]   非受控初始值，默认 [min, max]
 * - min?: number                      默认 0
 * - max?: number                      默认 100
 * - step?: number                     默认 1
 * - onChange?([lo, hi]: [number, number]): void
 * - disabled?: boolean
 * - formatLabel?(v: number): string   自定义标签格式
 * - showTooltip?: boolean             是否常驻显示 tooltip，默认 true
 * - className?: string
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RangeSliderProps {
  value?: [number, number]
  defaultValue?: [number, number]
  min?: number
  max?: number
  step?: number
  onChange?: (value: [number, number]) => void
  disabled?: boolean
  formatLabel?: (v: number) => string
  showTooltip?: boolean
  className?: string
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RangeSlider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  formatLabel,
  showTooltip = true,
  className,
}: RangeSliderProps) {
  const isControlled = value !== undefined
  const initVal = defaultValue ?? [min, max]
  const [internal, setInternal] = React.useState<[number, number]>(initVal)
  const [lo, hi] = isControlled ? value! : internal

  const [active, setActive] = React.useState<"lo" | "hi" | null>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step))

  const emit = React.useCallback(
    (newLo: number, newHi: number) => {
      const next: [number, number] = [clamp(newLo), clamp(newHi)]
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlled, onChange, min, max, step],
  )

  const getValueFromEvent = (clientX: number): number => {
    const track = trackRef.current
    if (!track) return min
    const { left, width } = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width))
    return clamp(min + ratio * (max - min))
  }

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const v = getValueFromEvent(e.clientX)
    // Move the closer thumb
    const dLo = Math.abs(v - lo)
    const dHi = Math.abs(v - hi)
    if (dLo <= dHi) {
      emit(Math.min(v, hi), hi)
      setActive("lo")
    } else {
      emit(lo, Math.max(v, lo))
      setActive("hi")
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active || disabled) return
    const v = getValueFromEvent(e.clientX)
    if (active === "lo") emit(Math.min(v, hi), hi)
    else emit(lo, Math.max(v, lo))
  }

  const handlePointerUp = () => setActive(null)

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100

  const loPercent = toPercent(lo)
  const hiPercent = toPercent(hi)

  const label = formatLabel ?? ((v: number) => String(v))

  return (
    <div
      className={cn("relative select-none", disabled && "opacity-50 pointer-events-none", className)}
      aria-label="区间滑块"
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-2 rounded-full bg-muted cursor-pointer mx-3"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Active range fill */}
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
        />

        {/* Lo thumb */}
        <Thumb
          value={lo}
          percent={loPercent}
          label={label(lo)}
          showTooltip={showTooltip}
          active={active === "lo"}
          aria-label={`最小值 ${label(lo)}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") emit(clamp(lo - step), hi)
            if (e.key === "ArrowRight") emit(clamp(lo + step), hi)
          }}
          onPointerDown={(e) => {
            setActive("lo")
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          }}
        />

        {/* Hi thumb */}
        <Thumb
          value={hi}
          percent={hiPercent}
          label={label(hi)}
          showTooltip={showTooltip}
          active={active === "hi"}
          aria-label={`最大值 ${label(hi)}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") emit(lo, clamp(hi - step))
            if (e.key === "ArrowRight") emit(lo, clamp(hi + step))
          }}
          onPointerDown={(e) => {
            setActive("hi")
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          }}
        />
      </div>

      {/* Min / max labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-3">
        <span>{label(min)}</span>
        <span className="font-medium text-foreground text-xs">{label(lo)} – {label(hi)}</span>
        <span>{label(max)}</span>
      </div>
    </div>
  )
}

// ─── Thumb ───────────────────────────────────────────────────────────────────

interface ThumbProps {
  value: number
  percent: number
  label: string
  showTooltip: boolean
  active: boolean
  "aria-label": string
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
}

function Thumb({ percent, label, showTooltip, active, "aria-label": ariaLabel, onKeyDown, onPointerDown }: ThumbProps) {
  const [hover, setHover] = React.useState(false)
  const show = showTooltip || hover || active

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuenow={Number(label)}
      className={cn(
        "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-primary bg-background cursor-grab active:cursor-grabbing shadow-sm transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        active && "scale-110",
      )}
      style={{ left: `${percent}%` }}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {show && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 bg-foreground text-background text-[10px] font-medium whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
    </div>
  )
}
