import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy, Pencil, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react"

interface MessageActionsProps extends React.ComponentProps<"div"> {
  onCopy?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onThumbsUp?: () => void
  onThumbsDown?: () => void
}

function MessageActions({
  onCopy,
  onEdit,
  onRegenerate,
  onThumbsUp,
  onThumbsDown,
  className,
  ...props
}: MessageActionsProps) {
  return (
    <div data-slot="message-actions" className={cn("flex items-center gap-1", className)} {...props}>
      {onCopy && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="复制消息" onClick={onCopy}>
          <Copy className="size-3.5" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="编辑消息" onClick={onEdit}>
          <Pencil className="size-3.5" />
        </Button>
      )}
      {onThumbsUp && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="点赞" onClick={onThumbsUp}>
          <ThumbsUp className="size-3.5" />
        </Button>
      )}
      {onThumbsDown && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="点踩" onClick={onThumbsDown}>
          <ThumbsDown className="size-3.5" />
        </Button>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="重新生成消息" onClick={onRegenerate}>
          <RefreshCcw className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

export { MessageActions }
export type { MessageActionsProps }
