import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"

interface ConversationHeaderProps extends React.ComponentProps<"div"> {
  title: string
  subtitle?: string
  status?: "online" | "offline" | "busy"
  avatarFallback?: string
  actions?: React.ReactNode
  presence?: React.ReactNode
}

function ConversationHeader({
  title,
  subtitle,
  status = "online",
  avatarFallback = "AI",
  actions,
  presence,
  className,
  ...props
}: ConversationHeaderProps) {
  const statusClass =
    status === "online"
      ? "bg-green-500"
      : status === "busy"
      ? "bg-amber-500"
      : "bg-zinc-400"

  return (
    <div data-slot="conversation-header" className={cn("flex items-center justify-between border-b px-4 py-3", className)} {...props}>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {presence ?? (subtitle && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-1.5 rounded-full", statusClass)} />
              <span>{subtitle}</span>
            </div>
          ))}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export { ConversationHeader }
export type { ConversationHeaderProps }
