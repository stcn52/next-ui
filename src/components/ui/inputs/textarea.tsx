import * as React from "react"

import { cn } from "@/lib/utils"
import { useSize, type Size } from "@/components/config-provider"

const textareaSizeClasses: Record<Size, string> = {
  sm: "min-h-12 rounded-sm px-[0.4375rem] py-1.5 text-sm leading-5",
  md: "min-h-16 rounded px-[0.6875rem] py-2 text-sm leading-[22px]",
  lg: "min-h-20 rounded px-[0.6875rem] py-[7px] text-base leading-6",
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
        "flex field-sizing-content w-full rounded-md border border-input bg-background transition-[border-color,box-shadow,background-color,color] duration-100 outline-none placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_2px_rgba(255,38,5,0.06)] dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
        textareaSizeClasses[resolvedSize],
        className,
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
