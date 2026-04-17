import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/inputs/select"
import { Mic, Zap } from "lucide-react"

interface ChatInputToolbarProps extends React.ComponentProps<"div"> {
  model?: string
  onModelChange?: (value: string) => void
  temperature?: string
  onTemperatureChange?: (value: string) => void
  onVoiceInput?: () => void
  onQuickCommand?: () => void
}

function ChatInputToolbar({
  model = "gpt-4o",
  onModelChange,
  temperature = "0.7",
  onTemperatureChange,
  onVoiceInput,
  onQuickCommand,
  className,
  ...props
}: ChatInputToolbarProps) {
  return (
    <div data-slot="chat-input-toolbar" className={cn("flex items-center justify-between gap-1.5", className)} {...props}>
      <div className="flex items-center gap-1.5">
        <Select
          value={model}
          onValueChange={(value) => {
            if (value) onModelChange?.(value)
          }}
        >
          <SelectTrigger className="h-8 w-32 text-xs" aria-label="选择模型">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="claude-4">Claude 4</SelectItem>
            <SelectItem value="deepseek-v3">DeepSeek V3</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={temperature}
          onValueChange={(value) => {
            if (value) onTemperatureChange?.(value)
          }}
        >
          <SelectTrigger className="h-8 w-24 text-xs" aria-label="选择温度">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.2">0.2</SelectItem>
            <SelectItem value="0.7">0.7</SelectItem>
            <SelectItem value="1.0">1.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label="语音输入" onClick={onVoiceInput}>
          <Mic className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8" aria-label="快捷指令" onClick={onQuickCommand}>
          <Zap className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export { ChatInputToolbar }
export type { ChatInputToolbarProps }
