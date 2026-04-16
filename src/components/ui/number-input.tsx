"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  /** Controlled value */
  value?: number
  /** Default value for uncontrolled mode */
  defaultValue?: number
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Step increment/decrement */
  step?: number
  /** Decimal precision (digits after point) */
  precision?: number
  /** Callback when value changes */
  onChange?: (value: number | undefined) => void
  /** Show increment/decrement buttons */
  showControls?: boolean
  /** Prefix string (e.g. currency symbol "¥") */
  prefix?: string
  /** Suffix string (e.g. unit "kg") */
  suffix?: string
  /** Disabled state */
  disabled?: boolean
  className?: string
}

/**
 * NumberInput — 数字输入框，支持步进按钮、最大/最小值约束、精度控制、前缀/后缀显示。
 *
 * @example
 * ```tsx
 * const [qty, setQty] = useState(1)
 * <NumberInput value={qty} onChange={setQty} min={0} max={99} step={1} />
 * ```
 */
function NumberInput({
  value: controlledValue,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  onChange,
  showControls = true,
  prefix,
  suffix,
  disabled = false,
  className,
  ...props
}: NumberInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState<number | undefined>(
    defaultValue,
  )
  const [inputStr, setInputStr] = React.useState<string>(
    formatValue(isControlled ? controlledValue : defaultValue, precision),
  )

  const current = isControlled ? controlledValue : internalValue

  // Sync display string when controlled value changes externally
  React.useEffect(() => {
    if (isControlled) {
      setInputStr(formatValue(controlledValue, precision))
    }
  }, [controlledValue, isControlled, precision])

  function clamp(v: number): number {
    let result = v
    if (min !== undefined) result = Math.max(min, result)
    if (max !== undefined) result = Math.min(max, result)
    return result
  }

  function applyValue(raw: number | undefined) {
    const clamped = raw !== undefined ? clamp(round(raw, precision)) : undefined
    if (!isControlled) setInternalValue(clamped)
    setInputStr(formatValue(clamped, precision))
    onChange?.(clamped)
  }

  const increment = () => {
    const base = current ?? 0
    applyValue(base + step)
  }

  const decrement = () => {
    const base = current ?? 0
    applyValue(base - step)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputStr(raw)
    const parsed = parseFloat(raw)
    if (raw === "" || raw === "-") {
      if (!isControlled) setInternalValue(undefined)
      onChange?.(undefined)
    } else if (!isNaN(parsed)) {
      const clamped = clamp(round(parsed, precision))
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
    }
  }

  const handleBlur = () => {
    // Normalise display value on blur
    applyValue(current)
  }

  const canDecrement = !disabled && (min === undefined || (current ?? 0) - step >= min)
  const canIncrement = !disabled && (max === undefined || (current ?? 0) + step <= max)

  return (
    <div
      data-slot="number-input"
      className={cn("flex items-center", className)}
    >
      {showControls && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-r-none border-r-0"
          disabled={!canDecrement}
          onClick={decrement}
          aria-label="减少"
          tabIndex={-1}
        >
          <MinusIcon className="size-3.5" />
        </Button>
      )}

      <div className="relative flex-1">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          {...props}
          type="text"
          inputMode="decimal"
          value={inputStr}
          disabled={disabled}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={cn(
            showControls && "rounded-none",
            prefix && "pl-7",
            suffix && "pr-7",
          )}
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {showControls && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-l-none border-l-0"
          disabled={!canIncrement}
          onClick={increment}
          aria-label="增加"
          tabIndex={-1}
        >
          <PlusIcon className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function round(value: number, precision?: number): number {
  if (precision === undefined) return value
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

function formatValue(value: number | undefined, precision?: number): string {
  if (value === undefined) return ""
  return precision !== undefined ? value.toFixed(precision) : String(value)
}

export { NumberInput }
export type { NumberInputProps }
