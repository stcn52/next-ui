import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

interface StepperProps extends React.ComponentProps<"div"> {
  /** Currently active step (0-indexed) */
  activeStep: number
  /** Render steps horizontally (default) or vertically */
  orientation?: "horizontal" | "vertical"
}

function Stepper({ className, activeStep, orientation = "horizontal", children, ...props }: StepperProps) {
  const steps = React.Children.toArray(children)
  return (
    <div
      data-slot="stepper"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-0"
          : "flex flex-col gap-0",
        className,
      )}
      role="list"
      {...props}
    >
      {steps.map((child, i) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child as React.ReactElement<StepProps>, {
          _index: i,
          _status: i < activeStep ? "completed" : i === activeStep ? "active" : "upcoming",
          _isLast: i === steps.length - 1,
          _orientation: orientation,
        })
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step                                                               */
/* ------------------------------------------------------------------ */

type StepStatus = "completed" | "active" | "upcoming"

interface StepProps extends React.ComponentProps<"div"> {
  /** Step label */
  label: string
  /** Optional description */
  description?: string
  /** @internal injected by Stepper */
  _index?: number
  _status?: StepStatus
  _isLast?: boolean
  _orientation?: "horizontal" | "vertical"
}

function Step({
  className,
  label,
  description,
  _index = 0,
  _status = "upcoming",
  _isLast = false,
  _orientation = "horizontal",
  ...props
}: StepProps) {
  const isH = _orientation === "horizontal"
  return (
    <div
      data-slot="step"
      data-status={_status}
      role="listitem"
      className={cn(
        "flex",
        isH ? "flex-1 items-center" : "gap-3",
        className,
      )}
      {...props}
    >
      <div className={cn("flex", isH ? "flex-col items-center gap-1.5" : "flex-col items-center")}>
        {/* Circle */}
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
            _status === "completed" && "border-primary bg-primary text-primary-foreground",
            _status === "active" && "border-primary bg-background text-primary",
            _status === "upcoming" && "border-muted-foreground/30 bg-background text-muted-foreground",
          )}
        >
          {_status === "completed" ? <Check className="size-4" /> : _index + 1}
        </div>
        {/* Vertical connector */}
        {!isH && !_isLast && (
          <div className="my-1.5 h-8 w-px bg-border" />
        )}
      </div>

      {/* Label */}
      <div className={cn(isH ? "mt-0 text-center" : "pt-1")}>
        <p
          className={cn(
            "text-sm font-medium",
            _status === "active" && "text-primary",
            _status === "upcoming" && "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Horizontal connector */}
      {isH && !_isLast && (
        <div
          className={cn(
            "mx-2.5 h-px flex-1",
            _status === "completed" ? "bg-primary" : "bg-border",
          )}
        />
      )}
    </div>
  )
}

export { Stepper, Step }
export type { StepperProps, StepProps }
