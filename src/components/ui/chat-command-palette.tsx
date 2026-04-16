import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

type ChatCommandAttachTo = "chat-sender" | "composer" | "standalone"

interface ChatCommandItem {
  key: string
  label: string
  description?: string
  group?: string
  icon?: React.ReactNode
  keywords?: string[]
  disabled?: boolean
  shortcut?: string
}

interface ChatCommandPaletteProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: ChatCommandItem[]
  open?: boolean
  defaultOpen?: boolean
  query?: string
  trigger?: string
  attachTo?: ChatCommandAttachTo
  emptyText?: string
  searchPlaceholder?: string
  onOpenChange?: (open: boolean) => void
  onSelect?: (item: ChatCommandItem) => void
}

function ChatCommandPalette({
  items,
  open: controlledOpen,
  defaultOpen = false,
  query,
  trigger = "/",
  attachTo = "standalone",
  emptyText = "没有匹配的命令",
  searchPlaceholder = "搜索命令…",
  onOpenChange,
  onSelect,
  className,
  ...props
}: ChatCommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [internalQuery, setInternalQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const slashQuery = query?.trimStart().startsWith(trigger)
    ? query.trimStart().slice(trigger.length)
    : ""
  const search = query !== undefined ? slashQuery : internalQuery

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  React.useEffect(() => {
    if (query === undefined) return
    setOpen(query.trimStart().startsWith(trigger))
  }, [query, setOpen, trigger])

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const normalized = search.toLowerCase()
    return items.filter((item) => {
      const haystack = [item.label, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalized)
    })
  }, [items, search])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [search, open])

  const groupedItems = React.useMemo(() => {
    return filteredItems.reduce<Record<string, ChatCommandItem[]>>((acc, item) => {
      const key = item.group ?? "命令"
      ;(acc[key] ??= []).push(item)
      return acc
    }, {})
  }, [filteredItems])

  const handleSelect = React.useCallback(
    (item: ChatCommandItem) => {
      if (item.disabled) return
      onSelect?.(item)
      setOpen(false)
    },
    [onSelect, setOpen],
  )

  const activeItem = filteredItems[activeIndex]

  if (!open) return null

  return (
    <div
      data-slot="chat-command-palette"
      data-attach-to={attachTo}
      className={cn(
        "rounded-xl border bg-popover shadow-md",
        attachTo === "standalone" ? "w-full max-w-lg" : "w-full",
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" && filteredItems.length > 0) {
          event.preventDefault()
          setActiveIndex((current) => (current + 1) % filteredItems.length)
          return
        }

        if (event.key === "ArrowUp" && filteredItems.length > 0) {
          event.preventDefault()
          setActiveIndex((current) => (current - 1 + filteredItems.length) % filteredItems.length)
          return
        }

        if (event.key === "Enter" && activeItem) {
          event.preventDefault()
          handleSelect(activeItem)
          return
        }

        if (event.key === "Escape") {
          event.preventDefault()
          setOpen(false)
        }
      }}
      {...props}
    >
      <Command shouldFilter={false}>
        {query === undefined && (
          <CommandInput
            value={internalQuery}
            onValueChange={setInternalQuery}
            placeholder={searchPlaceholder}
          />
        )}
        <CommandList className="max-h-64">
          {filteredItems.length === 0 ? (
            <CommandEmpty>{emptyText}</CommandEmpty>
          ) : (
            Object.entries(groupedItems).map(([group, groupItems]) => (
              <CommandGroup key={group} heading={group}>
                {groupItems.map((item) => {
                  const itemIndex = filteredItems.findIndex((candidate) => candidate.key === item.key)
                  return (
                    <CommandItem
                      key={item.key}
                      value={item.key}
                      disabled={item.disabled}
                      onSelect={() => handleSelect(item)}
                      onClick={() => handleSelect(item)}
                      className={cn(activeIndex === itemIndex && "bg-muted")}
                    >
                      {item.icon}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{item.label}</span>
                        {item.description && (
                          <span className="truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </div>
                      {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </Command>
    </div>
  )
}

export { ChatCommandPalette }
export type { ChatCommandAttachTo, ChatCommandItem, ChatCommandPaletteProps }
