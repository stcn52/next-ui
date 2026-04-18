import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Check, CheckCheck, Circle } from "lucide-react"

type PresenceStatus = "online" | "offline" | "away" | "busy"
type PresenceReadState = "sent" | "delivered" | "read"
type PresenceVariant = "inline" | "badge" | "stacked"
type PresenceDensity = "default" | "compact" | "dense"
type PresenceLayout = "default" | "header"

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
  density?: PresenceDensity
  layout?: PresenceLayout
  participantLimit?: number
  showStatusLabel?: boolean
  showReadLabel?: boolean
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
  density = "default",
  layout = "default",
  participantLimit,
  showStatusLabel,
  showReadLabel,
  labels,
  className,
  ...props
}: ChatPresenceProps) {
  const text = { ...defaultLabels, ...labels }
  const isHeaderLayout = layout === "header"
  const shouldForceStatusLabel = typing || thinking || (status === "offline" && Boolean(lastSeen))
  const stateLabel = typing
    ? text.typing
    : thinking
      ? text.thinking
      : status === "offline" && lastSeen
        ? `${text.offline} · ${lastSeen}`
        : text[status]
  const densityStyles = {
    default: {
      wrapper: "gap-2 text-xs",
      group: "gap-1.5",
      badge: "gap-1.5 px-2.5 py-1 text-[10px]",
      stacked: "gap-2",
      stackedColumn: "gap-0.5",
      stackedText: "gap-1.5 text-xs",
      readRow: "gap-1 text-[10px]",
      participantWrap: "-space-x-1",
      participant: "size-5 border-2",
      participantFallback: "text-[10px]",
      participantMore: "ml-1 text-[10px]",
      dot: "size-2",
      icon: "size-3",
    },
    compact: {
      wrapper: "gap-1.5 text-[11px]",
      group: "gap-1",
      badge: "gap-1 px-2 py-0.5 text-[10px]",
      stacked: "gap-1.5",
      stackedColumn: "gap-0.5",
      stackedText: "gap-1 text-[11px]",
      readRow: "gap-1 text-[10px]",
      participantWrap: "-space-x-1",
      participant: "size-4.5 border",
      participantFallback: "text-[9px]",
      participantMore: "ml-1 text-[9px]",
      dot: "size-1.5",
      icon: "size-3",
    },
    dense: {
      wrapper: "gap-1 text-[10px]",
      group: "gap-1",
      badge: "gap-1 px-1.5 py-0.5 text-[9px]",
      stacked: "gap-1",
      stackedColumn: "gap-0.5",
      stackedText: "gap-1 text-[10px]",
      readRow: "gap-1 text-[9px]",
      participantWrap: "-space-x-0.5",
      participant: "size-4 border",
      participantFallback: "text-[8px]",
      participantMore: "ml-0.5 text-[8px]",
      dot: "size-1.5",
      icon: "size-2.5",
    },
  }[density]
  const resolvedShowStatusLabel =
    showStatusLabel ?? (!isHeaderLayout || density === "default" || shouldForceStatusLabel)
  const resolvedShowReadLabel = showReadLabel ?? !isHeaderLayout
  const resolvedParticipantLimit = Math.max(
    1,
    participantLimit ?? (isHeaderLayout ? (density === "dense" ? 1 : 2) : density === "dense" ? 2 : 3),
  )
  const sharedRootClassName = cn(
    "min-w-0",
    densityStyles.wrapper,
    isHeaderLayout && "gap-1.5 text-foreground",
    className,
  )
  const sharedGroupClassName = cn(
    "flex items-center",
    densityStyles.group,
    isHeaderLayout && "max-w-full shrink-0 rounded-full border border-border/60 bg-muted/40 px-1.5 py-0.5",
  )
  const sharedLabelClassName = cn(isHeaderLayout && "max-w-[10rem] truncate")

  const readIcon =
    readState === "sent" ? (
      <Check className={densityStyles.icon} />
    ) : readState === "delivered" ? (
      <CheckCheck className={densityStyles.icon} />
    ) : readState === "read" ? (
      <CheckCheck className={cn(densityStyles.icon, "text-sky-500")} />
    ) : null

  const participantsPreview = participants?.length ? (
    <div
      data-slot="chat-presence-participants"
      className={cn("flex items-center", densityStyles.participantWrap, isHeaderLayout && "shrink-0")}
    >
      {participants.slice(0, resolvedParticipantLimit).map((participant) => (
        <Avatar
          key={participant.key}
          className={cn("border-background", densityStyles.participant)}
          aria-label={participant.label}
        >
          {participant.avatar}
          <AvatarFallback className={densityStyles.participantFallback}>
            {participant.fallback ?? participant.label.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {participants.length > resolvedParticipantLimit && (
        <div
          data-slot="chat-presence-participants-more"
          className={cn(
            "text-muted-foreground",
            densityStyles.participantMore,
            isHeaderLayout && "rounded-full bg-muted px-1 py-0.5",
          )}
        >
          +{participants.length - resolvedParticipantLimit}
        </div>
      )}
    </div>
  ) : null

  if (variant === "badge") {
    return (
      <div
        data-slot="chat-presence"
        data-layout={layout}
        className={cn("flex items-center", sharedRootClassName)}
        {...props}
      >
        {participantsPreview}
        <Badge
          variant="outline"
          className={cn(
            "rounded-full",
            densityStyles.badge,
            isHeaderLayout && "border-border/60 bg-muted/40 text-foreground",
          )}
        >
          <span className={cn("rounded-full", densityStyles.dot, statusDotClasses[status])} />
          {resolvedShowStatusLabel && <span className={sharedLabelClassName}>{stateLabel}</span>}
          {readIcon}
          {readState && resolvedShowReadLabel && <span>{text[readState]}</span>}
        </Badge>
      </div>
    )
  }

  if (variant === "stacked") {
    return (
      <div
        data-slot="chat-presence"
        data-layout={layout}
        className={cn("flex items-start min-w-0", densityStyles.stacked, className)}
        {...props}
      >
        {participantsPreview}
        <div className={cn("flex flex-col", densityStyles.stackedColumn)}>
          <div className={cn("flex items-center", densityStyles.stackedText, isHeaderLayout && "min-w-0")}>
            <span className={cn("rounded-full", densityStyles.dot, statusDotClasses[status])} />
            {resolvedShowStatusLabel && <span className={sharedLabelClassName}>{stateLabel}</span>}
          </div>
          {readState && (
            <div className={cn("flex items-center text-muted-foreground", densityStyles.readRow)}>
              {readIcon ?? <Circle className={densityStyles.icon} />}
              {resolvedShowReadLabel && <span>{text[readState]}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="chat-presence"
      data-layout={layout}
      className={cn("flex items-center text-muted-foreground", sharedRootClassName)}
      {...props}
    >
      {participantsPreview}
      <div className={sharedGroupClassName}>
        <span className={cn("rounded-full", densityStyles.dot, statusDotClasses[status])} />
        {resolvedShowStatusLabel && <span className={sharedLabelClassName}>{stateLabel}</span>}
      </div>
      {readState && (
        <div className={sharedGroupClassName}>
          {readIcon ?? <Circle className={densityStyles.icon} />}
          {resolvedShowReadLabel && <span>{text[readState]}</span>}
        </div>
      )}
    </div>
  )
}

export { ChatPresence }
export type {
  ChatPresenceProps,
  PresenceParticipant,
  PresenceDensity,
  PresenceLayout,
  PresenceReadState,
  PresenceStatus,
  PresenceVariant,
}
