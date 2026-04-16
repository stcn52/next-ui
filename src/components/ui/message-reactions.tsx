import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ReactionItem {
  emoji: string
  count: number
  active?: boolean
}

interface MessageReactionsProps extends Omit<React.ComponentProps<"div">, "onToggle"> {
  reactions: ReactionItem[]
  onToggle?: (emoji: string) => void
}

function MessageReactions({ reactions, onToggle, className, ...props }: MessageReactionsProps) {
  return (
    <div data-slot="message-reactions" className={cn("flex flex-wrap items-center gap-1", className)} {...props}>
      {reactions.map((r) => (
        <Button
          key={r.emoji}
          variant="outline"
          size="sm"
          className={cn("h-6 rounded-full px-2 text-xs", r.active && "border-primary")}
          aria-label={`reaction-${r.emoji}`}
          onClick={() => onToggle?.(r.emoji)}
        >
          <span className="mr-1">{r.emoji}</span>
          <span>{r.count}</span>
        </Button>
      ))}
    </div>
  )
}

export { MessageReactions }
export type { MessageReactionsProps, ReactionItem }
