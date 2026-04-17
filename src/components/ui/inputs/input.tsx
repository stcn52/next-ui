import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"
import { useSize, type Size } from "@/components/config-provider"

const sizeClasses: Record<Size, string> = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-2.5 text-base md:text-sm",
  lg: "h-9 px-3 text-base md:text-sm",
}

/**
 * Text input component with size variants.
 * Integrates with ConfigProvider for global size control.
 *
 * @param size - Size variant: "sm" | "md" | "lg" (defaults to ConfigProvider size)
 */
function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: Size }) {
  const globalSize = useSize()
  const resolvedSize = size ?? globalSize
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-md border border-input bg-transparent py-1 transition-colors outline-none file:inline-flex file:h-5 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        sizeClasses[resolvedSize],
        className
      )}
      {...props}
    />
  )
}

export { Input }
