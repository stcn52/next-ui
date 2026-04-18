"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover"
import type { FieldControlProps } from "@/components/form-engine/widget-adapter"

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Convert a 0-360 hue value to a CSS hex string (full saturation, 50% lightness) */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!result) return [0, 0, 50]
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function isValidHex(v: string) {
  return /^#[0-9a-f]{6}$/i.test(v.trim())
}

// ---------------------------------------------------------------------------
// Preset palette
// ---------------------------------------------------------------------------

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColorPickerProps {
  /** Controlled hex color value (e.g. "#3b82f6") */
  value?: string
  /** Default color */
  defaultValue?: string
  /** Called when color changes */
  onChange?: (hex: string) => void
  /** Whether to show preset swatches */
  showPresets?: boolean
  /** Max recent colors to remember (0 = disabled). Default 8. */
  maxRecent?: number
  /** Disabled state */
  disabled?: boolean
  className?: string
  fieldProps?: Pick<FieldControlProps, "id" | "name" | "aria-describedby" | "aria-invalid" | "aria-labelledby" | "aria-required" | "onBlur">
}

/**
 * ColorPicker — HSL 颜色选择器。
 *
 * 通过色调滑块 + 饱和度/亮度滑块精细控制颜色，支持十六进制直接输入
 * 和预设色板快捷选择。
 *
 * @example
 * ```tsx
 * const [color, setColor] = useState("#3b82f6")
 * <ColorPicker value={color} onChange={setColor} />
 * ```
 */
function ColorPicker({
  value: controlledValue,
  defaultValue = "#3b82f6",
  onChange,
  showPresets = true,
  maxRecent = 8,
  disabled = false,
  className,
  fieldProps,
}: ColorPickerProps) {
  const isControlled = controlledValue !== undefined
  const [internalHex, setInternalHex] = React.useState(defaultValue)
  const [hexInput, setHexInput] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [recent, setRecent] = React.useState<string[]>([])
  const lastCommittedHexRef = React.useRef((controlledValue ?? defaultValue).toLowerCase())

  const hex = isControlled ? (controlledValue ?? defaultValue) : internalHex
  const [h, s, l] = hexToHsl(hex)

  const apply = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalHex(next)
      setHexInput(next)
      lastCommittedHexRef.current = next.toLowerCase()
      onChange?.(next)
      if (maxRecent > 0) {
        setRecent((prev) => {
          const deduped = [next, ...prev.filter((c) => c.toLowerCase() !== next.toLowerCase())]
          return deduped.slice(0, maxRecent)
        })
      }
    },
    [isControlled, onChange, maxRecent],
  )

  // Sync hex input when controlled value changes
  React.useEffect(() => {
    if (isControlled && controlledValue) {
      setHexInput(controlledValue)
      lastCommittedHexRef.current = controlledValue.toLowerCase()
    }
  }, [isControlled, controlledValue])

  const handleHSL = (nh: number, ns: number, nl: number) => {
    apply(hslToHex(nh, ns, nl))
  }

  const handleHexChange = (nextValue: string) => {
    setHexInput(nextValue)
    const trimmed = nextValue.startsWith("#") ? nextValue : `#${nextValue}`
    if (isValidHex(trimmed) && trimmed.toLowerCase() !== lastCommittedHexRef.current) {
      apply(trimmed)
    }
  }

  const handleHexBlur = () => {
    const trimmed = hexInput.startsWith("#") ? hexInput : `#${hexInput}`
    if (isValidHex(trimmed)) {
      if (trimmed.toLowerCase() !== lastCommittedHexRef.current) {
        apply(trimmed)
      }
    } else {
      setHexInput(hex) // revert
    }
  }

  return (
    <div data-slot="color-picker" className={cn("inline-flex items-center gap-2", className)}>
      <Popover open={!disabled && open} onOpenChange={!disabled ? setOpen : undefined}>
        <PopoverTrigger
          id={fieldProps?.id}
          name={fieldProps?.name}
          className={cn(
            "inline-flex items-center justify-center size-9 rounded-lg border border-input p-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
          aria-labelledby={fieldProps?.["aria-labelledby"]}
          aria-describedby={fieldProps?.["aria-describedby"]}
          aria-invalid={fieldProps?.["aria-invalid"]}
          aria-required={fieldProps?.["aria-required"]}
          onBlur={fieldProps?.onBlur}
        >
          <span
            className="block size-full rounded"
            style={{ backgroundColor: hex }}
          />
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3 p-3" align="start" sideOffset={6}>
          {/* Hue preview bar */}
          <div
            className="h-6 w-full rounded-md"
            style={{
              background: `linear-gradient(to right,
                ${Array.from({ length: 7 }, (_, i) => hslToHex(i * 60, s, l)).join(",")})`,
            }}
          />

          {/* Hue */}
          <div className="space-y-1">
            <Label className="text-xs">色调 H: {h}°</Label>
            <input
              type="range"
              min={0}
              max={360}
              value={h}
              onChange={(e) => handleHSL(Number(e.target.value), s, l)}
              className="w-full accent-primary"
              style={{
                background: `linear-gradient(to right,
                  ${Array.from({ length: 7 }, (_, i) => `hsl(${i * 60},${s}%,${l}%)`).join(",")})`,
              }}
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <Label className="text-xs">饱和度 S: {s}%</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={s}
              onChange={(e) => handleHSL(h, Number(e.target.value), l)}
              className="w-full accent-primary"
              style={{
                background: `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`,
              }}
            />
          </div>

          {/* Lightness */}
          <div className="space-y-1">
            <Label className="text-xs">亮度 L: {l}%</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={l}
              onChange={(e) => handleHSL(h, s, Number(e.target.value))}
              className="w-full accent-primary"
              style={{
                background: `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`,
              }}
            />
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2">
            <div
              className="size-8 rounded border shrink-0"
              style={{ backgroundColor: hex }}
            />
            <Input
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              onBlur={handleHexBlur}
              onKeyDown={(e) => e.key === "Enter" && handleHexBlur()}
              placeholder="#000000"
              className="h-8 font-mono text-xs"
              maxLength={7}
            />
          </div>

          {/* Presets */}
          {showPresets && (
            <div className="space-y-1.5">
              <Label className="text-xs">预设颜色</Label>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => apply(preset)}
                    aria-label={preset.toUpperCase()}
                    className={cn(
                      "size-7 rounded border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                      hex.toLowerCase() === preset.toLowerCase() && "ring-2 ring-ring scale-110",
                    )}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent colors */}
          {maxRecent > 0 && recent.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">最近使用</Label>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => apply(c)}
                    aria-label={c.toUpperCase()}
                    className={cn(
                      "size-7 rounded border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                      hex.toLowerCase() === c.toLowerCase() && "ring-2 ring-ring scale-110",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Hex label next to trigger */}
      <span className="font-mono text-sm text-muted-foreground">{hex.toUpperCase()}</span>
    </div>
  )
}

export { ColorPicker }
export type { ColorPickerProps }
