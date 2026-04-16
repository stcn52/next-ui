"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RatingInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Controlled value (1–max) */
  value?: number
  /** Default rating for uncontrolled mode */
  defaultValue?: number
  /** Maximum star count (default: 5) */
  max?: number
  /** Callback when rating changes */
  onChange?: (value: number) => void
  /** Allow clearing rating by clicking the current value */
  allowClear?: boolean
  /** Show the numeric value next to stars */
  showValue?: boolean
  /** Star size variant */
  size?: "sm" | "md" | "lg"
  /** Read-only mode */
  readOnly?: boolean
  /** Disabled state */
  disabled?: boolean
  className?: string
}

/**
 * RatingInput — 星级评分输入，支持悬停预览、清除、只读展示和自定义数量。
 *
 * @example
 * ```tsx
 * const [rating, setRating] = useState(0)
 * <RatingInput value={rating} onChange={setRating} />
 * ```
 */
function RatingInput({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  onChange,
  allowClear = true,
  showValue = false,
  size = "md",
  readOnly = false,
  disabled = false,
  className,
  ...props
}: RatingInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [hovered, setHovered] = React.useState<number | null>(null)

  const current = isControlled ? controlledValue : internalValue

  const applyValue = React.useCallback(
    (v: number) => {
      if (!isControlled) setInternalValue(v)
      onChange?.(v)
    },
    [isControlled, onChange],
  )

  const handleClick = (star: number) => {
    if (readOnly || disabled) return
    if (allowClear && star === current) {
      applyValue(0)
    } else {
      applyValue(star)
    }
  }

  const displayValue = hovered ?? current

  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-7",
  }[size]

  return (
    <div
      data-slot="rating-input"
      className={cn(
        "inline-flex items-center gap-0.5",
        (disabled || readOnly) && "pointer-events-none",
        disabled && "opacity-50",
        className,
      )}
      role="radiogroup"
      aria-label="评分"
      onMouseLeave={() => setHovered(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={current === star}
          aria-label={`${star} 星`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && !disabled && setHovered(star)}
          disabled={disabled || readOnly}
          className={cn(
            "rounded-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !readOnly && !disabled && "cursor-pointer hover:scale-110",
          )}
        >
          <StarIcon
            className={cn(
              sizeClasses,
              "transition-colors",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground",
              hovered !== null && star <= hovered && "fill-yellow-300 text-yellow-300",
            )}
          />
        </button>
      ))}

      {showValue && (
        <span className="ml-1.5 text-sm tabular-nums text-muted-foreground">
          {current > 0 ? `${current}/${max}` : "未评分"}
        </span>
      )}
    </div>
  )
}

export { RatingInput }
export type { RatingInputProps }
