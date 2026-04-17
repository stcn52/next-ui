import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, MessageSquarePlus, Search } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConversationItem {
  /** Unique key */
  key: string
  /** Display label */
  label: string
  /** Last message preview */
  description?: string
  /** Time label (e.g. "10:30", "昨天") */
  time?: string
  /** Group name for grouping */
  group?: string
  /** Unread count */
  unread?: number
  /** Custom icon override */
  icon?: React.ReactNode
  /** Disabled state */
  disabled?: boolean
}

interface ChatConversationsProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Conversation items */
  items: ConversationItem[]
  /** Currently active conversation key */
  activeKey?: string
  /** Default active key (uncontrolled) */
  defaultActiveKey?: string
  /** Callback when active conversation changes */
  onChange?: (key: string, item: ConversationItem) => void
  /** Whether to enable grouping */
  groupable?: boolean
  /** Callback when new chat button is clicked */
  onNewChat?: () => void
  /** Sidebar title */
  title?: string
  /** Show search bar */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
}

/* ------------------------------------------------------------------ */
/*  ChatConversations                                                  */
/* ------------------------------------------------------------------ */

function ChatConversations({
  items,
  activeKey: controlledActive,
  defaultActiveKey,
  onChange,
  groupable = true,
  onNewChat,
  title = "会话列表",
  searchable = true,
  searchPlaceholder = "搜索会话…",
  className,
  ...props
}: ChatConversationsProps) {
  const [internalActive, setInternalActive] = React.useState(defaultActiveKey ?? items[0]?.key ?? "")
  const isControlled = controlledActive !== undefined
  const activeId = isControlled ? controlledActive : internalActive
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSelect = React.useCallback(
    (item: ConversationItem) => {
      if (item.disabled) return
      if (!isControlled) setInternalActive(item.key)
      onChange?.(item.key, item)
    },
    [isControlled, onChange],
  )

  // Filter by search
  const filtered = React.useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter((c) => c.label.toLowerCase().includes(q))
  }, [items, searchQuery])

  // Group items
  const grouped = React.useMemo(() => {
    if (!groupable) return { "": filtered }
    return filtered.reduce<Record<string, ConversationItem[]>>((acc, c) => {
      const g = c.group || ""
      ;(acc[g] ??= []).push(c)
      return acc
    }, {})
  }, [filtered, groupable])

  const defaultIcon = (
    <Avatar className="size-8 shrink-0">
      <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-xs">
        <Bot className="size-3.5 text-violet-600" />
      </AvatarFallback>
    </Avatar>
  )

  return (
    <div data-slot="chat-conversations" className={cn("flex flex-col", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {onNewChat && (
          <Button variant="ghost" size="icon" className="size-8" aria-label="新建会话" onClick={onNewChat}>
            <MessageSquarePlus className="size-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      {searchable && (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-2.5 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 px-2 py-1">
          {Object.entries(grouped).map(([group, groupItems]) => (
            <div key={group}>
              {group && (
                <p className="px-2 pt-2 pb-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
                  {group}
                </p>
              )}
              {groupItems.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleSelect(c)}
                  disabled={c.disabled}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors",
                    activeId === c.key ? "bg-accent" : "hover:bg-accent/50",
                    c.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  {c.icon ?? defaultIcon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium">{c.label}</span>
                      {c.time && <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>}
                    </div>
                    {c.description && <p className="truncate text-xs text-muted-foreground">{c.description}</p>}
                  </div>
                  {!!c.unread && c.unread > 0 && (
                    <Badge className="size-5 shrink-0 justify-center rounded-full px-0 text-[10px]">
                      {c.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export { ChatConversations }
export type { ChatConversationsProps, ConversationItem }
