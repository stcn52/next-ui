"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OTPInputVariant = "default" | "ghost" | "underline"

interface OTPInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Number of OTP digits (default: 6) */
  length?: number
  /** Controlled value */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Called whenever the OTP value changes */
  onChange?: (value: string) => void
  /** Called when all digits have been entered */
  onComplete?: (value: string) => void
  /** Accept only numbers (default: true) */
  numericOnly?: boolean
  /** Visual style variant */
  variant?: OTPInputVariant
  /** Disabled state */
  disabled?: boolean
  /** Whether to mask input as password */
  mask?: boolean
  /** ARIA label for the group */
  label?: string
  className?: string
}

/**
 * OTPInput — 一次性密码输入框。
 *
 * 支持受控与非受控模式、自动跳格、粘贴整串 OTP、掩码显示。
 * 对逐格 `<input>` 设置 `aria-label`，无障碍友好。
 *
 * @example
 * ```tsx
 * const [otp, setOtp] = useState("")
 * <OTPInput length={6} value={otp} onChange={setOtp} onComplete={(v) => verify(v)} />
 * ```
 */
function OTPInput({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onComplete,
  numericOnly = true,
  variant = "default",
  disabled = false,
  mask = false,
  label = "一次性密码",
  className,
  ...props
}: OTPInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState(() =>
    (defaultValue ?? "").slice(0, length).padEnd(0, ""),
  )

  const digits = isControlled ? controlledValue : internalValue
  const cells = Array.from({ length }, (_, i) => digits[i] ?? "")

  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

  const applyValue = React.useCallback(
    (next: string) => {
      const clamped = next.slice(0, length)
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
      if (clamped.length === length) onComplete?.(clamped)
    },
    [isControlled, length, onChange, onComplete],
  )

  const focusCell = (index: number) => {
    const target = inputsRef.current[Math.max(0, Math.min(length - 1, index))]
    target?.focus()
    target?.select()
  }

  const handleChange = (index: number, raw: string) => {
    // Accept only the last entered character
    let char = raw.replace(digits[index] ?? "", "").slice(-1)
    if (numericOnly) char = char.replace(/\D/g, "")
    if (!char) return

    const arr = cells.map((c) => c)
    arr[index] = char
    applyValue(arr.join(""))
    focusCell(index + 1)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (cells[index]) {
        const arr = cells.map((c) => c)
        arr[index] = ""
        applyValue(arr.join(""))
      } else {
        focusCell(index - 1)
      }
      return
    }
    if (e.key === "ArrowLeft") { e.preventDefault(); focusCell(index - 1) }
    if (e.key === "ArrowRight") { e.preventDefault(); focusCell(index + 1) }
    if (e.key === "Home") { e.preventDefault(); focusCell(0) }
    if (e.key === "End") { e.preventDefault(); focusCell(length - 1) }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    let pasted = e.clipboardData.getData("text")
    if (numericOnly) pasted = pasted.replace(/\D/g, "")
    applyValue(pasted.slice(0, length))
    focusCell(Math.min(pasted.length, length - 1))
  }

  const variantCell: Record<OTPInputVariant, string> = {
    default:
      "rounded-lg border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/30",
    ghost:
      "rounded-lg bg-muted focus:bg-background focus:ring-2 focus:ring-ring/30",
    underline:
      "border-b-2 border-input rounded-none bg-transparent focus:border-ring focus:ring-0",
  }

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="otp-input"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {cells.map((cell, index) => (
        <React.Fragment key={index}>
          {index === Math.ceil(length / 2) && index !== 0 && length > 4 && (
            <span className="text-muted-foreground select-none" aria-hidden>–</span>
          )}
          <input
            ref={(el) => { inputsRef.current[index] = el }}
            type={mask ? "password" : "text"}
            inputMode={numericOnly ? "numeric" : "text"}
            maxLength={2}
            value={cell}
            disabled={disabled}
            aria-label={`第 ${index + 1} 位`}
            autoComplete="one-time-code"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "size-11 text-center text-lg font-semibold outline-none transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
              variantCell[variant],
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export { OTPInput }
export type { OTPInputProps }
