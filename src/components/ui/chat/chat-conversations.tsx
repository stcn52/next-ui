import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, ChevronDown, MessageSquarePlus, Search } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ChatConversationsDensity = "default" | "compact"

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
  /** Visual density for compact sidebars */
  density?: ChatConversationsDensity
  /** Whether to show the description preview line */
  showDescription?: boolean
  /** Whether group sections can be collapsed */
  collapsibleGroups?: boolean
  /** Group names collapsed by default */
  defaultCollapsedGroups?: string[]
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
  density = "default",
  showDescription = true,
  collapsibleGroups = false,
  defaultCollapsedGroups = [],
  className,
  ...props
}: ChatConversationsProps) {
  const [internalActive, setInternalActive] = React.useState(defaultActiveKey ?? items[0]?.key ?? "")
  const isControlled = controlledActive !== undefined
  const activeId = isControlled ? controlledActive : internalActive
  const [searchQuery, setSearchQuery] = React.useState("")
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(defaultCollapsedGroups.map((group) => [group, true])),
  )
  const densityStyles = {
    default: {
      header: "px-3 py-2",
      title: "text-sm",
      newChatButton: "size-8",
      searchWrap: "px-3 py-1",
      searchField: "gap-2 px-2.5 py-1.5",
      searchText: "text-sm",
      listWrap: "gap-1 px-2 py-1",
      groupLabel: "px-2 pt-2 pb-0.5 text-[10px]",
      row: "gap-2 rounded-md px-2.5 py-1.5",
      avatar: "size-8",
      avatarFallback: "text-xs",
      icon: "size-3.5",
      label: "text-sm",
      time: "text-[10px]",
      description: "text-xs",
      badge: "size-5 text-[10px]",
    },
    compact: {
      header: "px-2.5 py-1.5",
      title: "text-xs",
      newChatButton: "size-7",
      searchWrap: "px-2.5 py-1",
      searchField: "gap-1.5 px-2 py-1",
      searchText: "text-xs",
      listWrap: "gap-0.5 px-1.5 py-1",
      groupLabel: "px-2 pt-1.5 pb-0.5 text-[9px]",
      row: "gap-1.5 rounded-md px-2 py-1.5",
      avatar: "size-7",
      avatarFallback: "text-[10px]",
      icon: "size-3",
      label: "text-xs",
      time: "text-[9px]",
      description: "text-[11px]",
      badge: "size-4.5 text-[9px]",
    },
  }[density]

  const handleSelect = React.useCallback(
    (item: ConversationItem) => {
      if (item.disabled) return
      if (!isControlled) setInternalActive(item.key)
      onChange?.(item.key, item)
    },
    [isControlled, onChange],
  )

  const toggleGroup = React.useCallback((group: string) => {
    setCollapsedGroups((current) => ({ ...current, [group]: !current[group] }))
  }, [])

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
    <Avatar className={cn("shrink-0", densityStyles.avatar)}>
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br from-violet-500/20 to-blue-500/20",
          densityStyles.avatarFallback,
        )}
      >
        <Bot className={cn("text-violet-600", densityStyles.icon)} />
      </AvatarFallback>
    </Avatar>
  )

  return (
    <div data-slot="chat-conversations" className={cn("flex flex-col", className)} {...props}>
      {/* Header */}
      <div className={cn("flex items-center justify-between border-b", densityStyles.header)}>
        <h2 className={cn("font-semibold", densityStyles.title)}>{title}</h2>
        {onNewChat && (
          <Button
            variant="ghost"
            size="icon"
            className={densityStyles.newChatButton}
            aria-label="新建会话"
            onClick={onNewChat}
          >
            <MessageSquarePlus className={densityStyles.icon} />
          </Button>
        )}
      </div>

      {/* Search */}
      {searchable && (
        <div className={densityStyles.searchWrap}>
          <div className={cn("flex items-center rounded-md border bg-muted/50", densityStyles.searchField)}>
            <Search className={cn("text-muted-foreground", densityStyles.icon)} />
            <input
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                densityStyles.searchText,
              )}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* List */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col", densityStyles.listWrap)}>
          {Object.entries(grouped).map(([group, groupItems]) => (
            <div key={group}>
              {group && (
                collapsibleGroups ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md text-left font-medium tracking-wide text-muted-foreground transition-colors hover:bg-muted/60",
                      densityStyles.groupLabel,
                    )}
                    aria-expanded={!collapsedGroups[group]}
                    aria-label={`${group} 分组`}
                  >
                    <span>{group}</span>
                    <span className="flex items-center gap-1">
                      <span className={densityStyles.time}>{groupItems.length}</span>
                      <ChevronDown className={cn("transition-transform", densityStyles.icon, collapsedGroups[group] && "-rotate-90")} />
                    </span>
                  </button>
                ) : (
                  <p
                    className={cn(
                      "font-medium tracking-wide text-muted-foreground",
                      densityStyles.groupLabel,
                    )}
                  >
                    {group}
                  </p>
                )
              )}
              {(!group || !collapsedGroups[group]) && groupItems.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleSelect(c)}
                  disabled={c.disabled}
                  className={cn(
                    "flex w-full items-center text-left transition-colors",
                    densityStyles.row,
                    activeId === c.key ? "bg-accent" : "hover:bg-accent/50",
                    c.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  {c.icon ?? defaultIcon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn("truncate font-medium", densityStyles.label)}>{c.label}</span>
                      {c.time && (
                        <span className={cn("shrink-0 text-muted-foreground", densityStyles.time)}>
                          {c.time}
                        </span>
                      )}
                    </div>
                    {showDescription && c.description && (
                      <p className={cn("truncate text-muted-foreground", densityStyles.description)}>
                        {c.description}
                      </p>
                    )}
                  </div>
                  {!!c.unread && c.unread > 0 && (
                    <Badge
                      className={cn(
                        "shrink-0 justify-center rounded-full px-0",
                        densityStyles.badge,
                      )}
                    >
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
export type { ChatConversationsDensity, ChatConversationsProps, ConversationItem }
