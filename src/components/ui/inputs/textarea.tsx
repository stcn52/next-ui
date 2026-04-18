import * as React from "react"

import { cn } from "@/lib/utils"
import { useSize, type Size } from "@/components/config-provider"

const textareaSizeClasses: Record<Size, string> = {
  sm: "px-2 py-1.5 text-xs min-h-12",
  md: "px-2.5 py-2 text-base md:text-sm min-h-16",
  lg: "px-3 py-2.5 text-base min-h-20",
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { size?: Size }
>(function Textarea({ className, size, ...props }, ref) {
  const globalSize = useSize()
  const resolvedSize = size ?? globalSize
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content w-full rounded-md border border-input bg-transparent transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        textareaSizeClasses[resolvedSize],
        className,
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
