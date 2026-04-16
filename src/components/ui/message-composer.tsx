import * as React from "react"
import { cn } from "@/lib/utils"
import { ChatSender, type Attachment, type MentionItem } from "@/components/ui/chat-sender"

interface MessageComposerProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "onSubmit"> {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (message: string, attachments?: Attachment[]) => void
  suggestions?: string[]
  mentions?: MentionItem[]
  attachments?: Attachment[]
  onAttach?: () => void
  onAttachFiles?: (files: FileList | File[]) => void
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void
}

function MessageComposer({ className, ...props }: MessageComposerProps) {
  return (
    <div data-slot="message-composer" className={cn("border-t p-3", className)}>
      <ChatSender {...props} />
    </div>
  )
}

export { MessageComposer }
export type { MessageComposerProps }
