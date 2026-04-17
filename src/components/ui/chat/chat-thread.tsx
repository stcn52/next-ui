import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatThreadProps extends React.ComponentProps<"div"> {
  unreadLabel?: string
  showUnreadDivider?: boolean
  children?: React.ReactNode
}

function ChatThread({
  unreadLabel = "未读消息",
  showUnreadDivider = false,
  className,
  children,
  ...props
}: ChatThreadProps) {
  return (
    <div data-slot="chat-thread" className={cn("min-h-0 flex-1", className)} {...props}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-3 p-3">
          {showUnreadDivider && (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground">{unreadLabel}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}

export { ChatThread }
export type { ChatThreadProps }
