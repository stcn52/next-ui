import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Check, CheckCheck, Circle } from "lucide-react"

type PresenceStatus = "online" | "offline" | "away" | "busy"
type PresenceReadState = "sent" | "delivered" | "read"
type PresenceVariant = "inline" | "badge" | "stacked"

interface PresenceParticipant {
  key: string
  label: string
  avatar?: React.ReactNode
  fallback?: string
  status?: PresenceStatus
}

interface ChatPresenceProps extends Omit<React.ComponentProps<"div">, "children"> {
  status?: PresenceStatus
  typing?: boolean
  thinking?: boolean
  readState?: PresenceReadState
  lastSeen?: string
  participants?: PresenceParticipant[]
  variant?: PresenceVariant
  labels?: Partial<Record<PresenceStatus | PresenceReadState | "typing" | "thinking", string>>
}

const statusDotClasses: Record<PresenceStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-zinc-400",
  away: "bg-amber-500",
  busy: "bg-rose-500",
}

const defaultLabels: Record<PresenceStatus | PresenceReadState | "typing" | "thinking", string> = {
  online: "在线",
  offline: "离线",
  away: "离开",
  busy: "忙碌",
  sent: "已发送",
  delivered: "已送达",
  read: "已读",
  typing: "输入中",
  thinking: "思考中",
}

function ChatPresence({
  status = "online",
  typing = false,
  thinking = false,
  readState,
  lastSeen,
  participants,
  variant = "inline",
  labels,
  className,
  ...props
}: ChatPresenceProps) {
  const text = { ...defaultLabels, ...labels }
  const stateLabel = typing
    ? text.typing
    : thinking
      ? text.thinking
      : status === "offline" && lastSeen
        ? `${text.offline} · ${lastSeen}`
        : text[status]

  const readIcon =
    readState === "sent" ? (
      <Check className="size-3" />
    ) : readState === "delivered" ? (
      <CheckCheck className="size-3" />
    ) : readState === "read" ? (
      <CheckCheck className="size-3 text-sky-500" />
    ) : null

  const participantsPreview = participants?.length ? (
    <div className="flex items-center -space-x-1">
      {participants.slice(0, 3).map((participant) => (
        <Avatar
          key={participant.key}
          className="size-5 border-2 border-background"
          aria-label={participant.label}
        >
          {participant.avatar}
          <AvatarFallback className="text-[10px]">
            {participant.fallback ?? participant.label.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {participants.length > 3 && (
        <div className="ml-1 text-[10px] text-muted-foreground">+{participants.length - 3}</div>
      )}
    </div>
  ) : null

  if (variant === "badge") {
    return (
      <div
        data-slot="chat-presence"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {participantsPreview}
        <Badge variant="outline" className="gap-1.5 rounded-full px-2.5 py-1 text-[10px]">
          <span className={cn("size-2 rounded-full", statusDotClasses[status])} />
          <span>{stateLabel}</span>
          {readIcon}
          {readState && <span>{text[readState]}</span>}
        </Badge>
      </div>
    )
  }

  if (variant === "stacked") {
    return (
      <div
        data-slot="chat-presence"
        className={cn("flex items-start gap-2", className)}
        {...props}
      >
        {participantsPreview}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className={cn("size-2 rounded-full", statusDotClasses[status])} />
            <span>{stateLabel}</span>
          </div>
          {readState && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {readIcon}
              <span>{text[readState]}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="chat-presence"
      className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}
      {...props}
    >
      {participantsPreview}
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", statusDotClasses[status])} />
        <span>{stateLabel}</span>
      </div>
      {readState && (
        <div className="flex items-center gap-1">
          {readIcon ?? <Circle className="size-3" />}
          <span>{text[readState]}</span>
        </div>
      )}
    </div>
  )
}

export { ChatPresence }
export type {
  ChatPresenceProps,
  PresenceParticipant,
  PresenceReadState,
  PresenceStatus,
  PresenceVariant,
}
