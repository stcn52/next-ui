import * as React from "react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

interface TimelineProps extends React.ComponentProps<"div"> {
  /** Render items horizontally instead of vertically */
  horizontal?: boolean
}

function Timeline({ className, horizontal, ...props }: TimelineProps) {
  return (
    <div
      data-slot="timeline"
      className={cn(
        "relative",
        horizontal ? "flex items-start gap-8" : "space-y-0",
        className,
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineItem                                                       */
/* ------------------------------------------------------------------ */

interface TimelineItemProps extends React.ComponentProps<"div"> {
  /** Whether this is the last item (hides the connector) */
  isLast?: boolean
}

function TimelineItem({ className, isLast, ...props }: TimelineItemProps) {
  return (
    <div
      data-slot="timeline-item"
      className={cn("relative flex gap-4 pb-6", isLast && "pb-0", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineConnector                                                  */
/* ------------------------------------------------------------------ */

function TimelineConnector({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-connector"
      className={cn(
        "absolute left-[15px] top-[30px] bottom-0 w-px bg-border",
        className,
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineDot                                                        */
/* ------------------------------------------------------------------ */

interface TimelineDotProps extends React.ComponentProps<"div"> {
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
}

const DOT_VARIANTS: Record<string, string> = {
  default: "border-border bg-background",
  primary: "border-primary bg-primary text-primary-foreground",
  success: "border-green-500 bg-green-500 text-white",
  warning: "border-yellow-500 bg-yellow-500 text-white",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
}

function TimelineDot({ className, variant = "default", children, ...props }: TimelineDotProps) {
  return (
    <div
      data-slot="timeline-dot"
      className={cn(
        "z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full border-2",
        DOT_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineContent                                                    */
/* ------------------------------------------------------------------ */

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("flex-1 pt-0.5", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineTitle                                                      */
/* ------------------------------------------------------------------ */

function TimelineTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-title"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineDescription                                                */
/* ------------------------------------------------------------------ */

function TimelineDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
}
