import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"
import { useSize, type Size } from "@/components/config-provider"

const sizeClasses: Record<Size, string> = {
  sm: "h-6 rounded-sm px-[0.4375rem] py-0 text-sm leading-5",
  md: "h-8 rounded px-[0.6875rem] py-1 text-sm leading-[22px]",
  lg: "h-10 rounded px-[0.6875rem] py-[7px] text-base leading-6",
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
        "w-full min-w-0 rounded-md border border-input bg-background transition-[border-color,box-shadow,background-color,color] duration-100 outline-none file:inline-flex file:h-5 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_2px_rgba(255,38,5,0.06)] dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
        sizeClasses[resolvedSize],
        className
      )}
      {...props}
    />
  )
}

export { Input }
