import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageThreadReplyProps extends React.ComponentProps<"div"> {
  author: string
  content: string
  time?: string
}

function MessageThreadReply({ author, content, time, className, ...props }: MessageThreadReplyProps) {
  return (
    <div data-slot="message-thread-reply" className={cn("rounded-md border bg-muted/40 p-1.5 text-xs", className)} {...props}>
      <div className="mb-0.5 flex items-center justify-between">
        <span className="font-medium">{author}</span>
        {time && <span className="text-muted-foreground">{time}</span>}
      </div>
      <p className="text-muted-foreground">{content}</p>
    </div>
  )
}

export { MessageThreadReply }
export type { MessageThreadReplyProps }
