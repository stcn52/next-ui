import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlays/dropdown-menu"
import { Copy, Ellipsis, Pencil, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react"

interface MessageActionsProps extends React.ComponentProps<"div"> {
  onCopy?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onThumbsUp?: () => void
  onThumbsDown?: () => void
  labels?: {
    copyAriaLabel?: string
    thumbsUpAriaLabel?: string
    thumbsDownAriaLabel?: string
    moreActionsAriaLabel?: string
    editLabel?: string
    regenerateLabel?: string
  }
}

function MessageActions({
  onCopy,
  onEdit,
  onRegenerate,
  onThumbsUp,
  onThumbsDown,
  labels,
  className,
  ...props
}: MessageActionsProps) {
  const hasFeedback = Boolean(onThumbsUp || onThumbsDown)
  const hasOverflow = Boolean(onEdit || onRegenerate)
  const text = {
    copyAriaLabel: labels?.copyAriaLabel ?? "复制消息",
    thumbsUpAriaLabel: labels?.thumbsUpAriaLabel ?? "点赞",
    thumbsDownAriaLabel: labels?.thumbsDownAriaLabel ?? "点踩",
    moreActionsAriaLabel: labels?.moreActionsAriaLabel ?? "更多消息操作",
    editLabel: labels?.editLabel ?? "编辑",
    regenerateLabel: labels?.regenerateLabel ?? "重新生成",
  }

  return (
    <div data-slot="message-actions" className={cn("flex items-center gap-1", className)} {...props}>
      {onCopy && (
        <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={text.copyAriaLabel} onClick={onCopy}>
          <Copy className="size-3.5" />
        </Button>
      )}

      {hasFeedback && (
        <div className="flex items-center rounded-full border bg-muted/40 p-0.5">
          {onThumbsUp && (
            <Button variant="ghost" size="icon-sm" className="shrink-0 rounded-full" aria-label={text.thumbsUpAriaLabel} onClick={onThumbsUp}>
              <ThumbsUp className="size-3.5" />
            </Button>
          )}
          {onThumbsDown && (
            <Button variant="ghost" size="icon-sm" className="shrink-0 rounded-full" aria-label={text.thumbsDownAriaLabel} onClick={onThumbsDown}>
              <ThumbsDown className="size-3.5" />
            </Button>
          )}
        </div>
      )}

      {hasOverflow && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={text.moreActionsAriaLabel}>
                <Ellipsis className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-4" />
                {text.editLabel}
              </DropdownMenuItem>
            )}
            {onRegenerate && (
              <DropdownMenuItem onClick={onRegenerate}>
                <RefreshCcw className="size-4" />
                {text.regenerateLabel}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export { MessageActions }
export type { MessageActionsProps }
