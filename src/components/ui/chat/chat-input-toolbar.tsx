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
  labels?: {
    modelAriaLabel?: string
    temperatureAriaLabel?: string
    voiceInputAriaLabel?: string
    quickCommandAriaLabel?: string
  }
}

function ChatInputToolbar({
  model = "gpt-4o",
  onModelChange,
  temperature = "0.7",
  onTemperatureChange,
  onVoiceInput,
  onQuickCommand,
  labels,
  className,
  ...props
}: ChatInputToolbarProps) {
  const showTemperature = Boolean(onTemperatureChange)
  const showTools = Boolean(onVoiceInput || onQuickCommand)
  const text = {
    modelAriaLabel: labels?.modelAriaLabel ?? "选择模型",
    temperatureAriaLabel: labels?.temperatureAriaLabel ?? "选择温度",
    voiceInputAriaLabel: labels?.voiceInputAriaLabel ?? "语音输入",
    quickCommandAriaLabel: labels?.quickCommandAriaLabel ?? "快捷指令",
  }

  return (
    <div
      data-slot="chat-input-toolbar"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <Select
          value={model}
          onValueChange={(value) => {
            if (value) onModelChange?.(value)
          }}
        >
          <SelectTrigger className="h-8 w-36 text-xs" aria-label={text.modelAriaLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="claude-4">Claude 4</SelectItem>
            <SelectItem value="deepseek-v3">DeepSeek V3</SelectItem>
          </SelectContent>
        </Select>

        {showTemperature && (
          <Select
            value={temperature}
            onValueChange={(value) => {
              if (value) onTemperatureChange?.(value)
            }}
          >
            <SelectTrigger className="h-8 w-20 border-dashed text-xs text-muted-foreground" aria-label={text.temperatureAriaLabel}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="0.2">0.2</SelectItem>
              <SelectItem value="0.7">0.7</SelectItem>
              <SelectItem value="1.0">1.0</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {showTools && (
        <div className="flex items-center gap-1">
          {onVoiceInput && (
            <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={text.voiceInputAriaLabel} onClick={onVoiceInput}>
              <Mic className="size-3.5" />
            </Button>
          )}
          {onQuickCommand && (
            <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={text.quickCommandAriaLabel} onClick={onQuickCommand}>
              <Zap className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { ChatInputToolbar }
export type { ChatInputToolbarProps }
