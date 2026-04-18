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
} from "@/components/ui/overlays/command"

type ChatCommandAttachTo = "chat-sender" | "composer" | "standalone"
type ChatCommandPaletteDensity = "default" | "compact" | "dense"
type ChatCommandPaletteLayout = "default" | "embedded"

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
  density?: ChatCommandPaletteDensity
  layout?: ChatCommandPaletteLayout
  showDescription?: boolean
  showShortcut?: boolean
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
  density,
  layout,
  showDescription,
  showShortcut,
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
  const resolvedDensity = density ?? (attachTo === "standalone" ? "default" : "compact")
  const resolvedLayout = layout ?? (attachTo === "standalone" ? "default" : "embedded")
  const isEmbedded = resolvedLayout === "embedded"
  const isAttached = attachTo !== "standalone"
  const resolvedShowDescription = showDescription ?? (resolvedDensity === "default" && !isEmbedded)
  const resolvedShowShortcut = showShortcut ?? (resolvedDensity === "default" && !isEmbedded)
  const densityStyles = {
    default: {
      root: "rounded-lg",
      input: "",
      inputShell: "",
      list: "max-h-64",
      group: "",
      item: "",
      itemBody: "flex-col",
      label: "",
      description: "text-xs",
      shortcut: "",
    },
    compact: {
      root: "rounded-md",
      input: "h-8 text-xs",
      inputShell: "[&_svg]:size-3.5",
      list: "max-h-48",
      group: "**:[[cmdk-group-heading]]:px-1 **:[[cmdk-group-heading]]:py-0.5 **:[[cmdk-group-heading]]:text-[10px]",
      item: "min-h-8 gap-2 rounded-md px-2 py-1",
      itemBody: "flex-col",
      label: "text-xs",
      description: "text-[10px]",
      shortcut: "text-[10px]",
    },
    dense: {
      root: "rounded-md",
      input: "h-7 text-[11px]",
      inputShell: "[&_svg]:size-3",
      list: "max-h-40",
      group: "**:[[cmdk-group-heading]]:px-1 **:[[cmdk-group-heading]]:py-0.5 **:[[cmdk-group-heading]]:text-[9px]",
      item: "min-h-7 gap-1.5 rounded-md px-1.5 py-1",
      itemBody: "items-center",
      label: "text-[11px]",
      description: "text-[9px]",
      shortcut: "text-[9px]",
    },
  }[resolvedDensity]

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
  const groupEntries = Object.entries(groupedItems)
  const showGroupHeading = groupEntries.length > 1

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
      data-density={resolvedDensity}
      data-layout={resolvedLayout}
      className={cn(
        isEmbedded
          ? "border bg-background/95 shadow-xs"
          : "border bg-popover shadow-sm",
        densityStyles.root,
        attachTo === "standalone" ? "w-full max-w-lg" : "w-full",
        isEmbedded && isAttached && "border-border/60 bg-background/92 shadow-none",
        isEmbedded && attachTo === "standalone" && "rounded-none border-0 bg-transparent shadow-none",
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
      <Command
        shouldFilter={false}
        className={cn(
          isEmbedded && "rounded-none! bg-transparent p-0",
        )}
      >
        {query === undefined && (
          <CommandInput
            value={internalQuery}
            onValueChange={setInternalQuery}
            placeholder={searchPlaceholder}
            className={cn(
              densityStyles.input,
              densityStyles.inputShell,
              isEmbedded && "rounded-md border-border/60 bg-muted/35",
              isEmbedded && isAttached && "h-7 rounded-sm bg-muted/25 px-2 text-[11px]",
            )}
          />
        )}
        <CommandList className={cn(densityStyles.list, isEmbedded && isAttached && "py-1")}>
          {filteredItems.length === 0 ? (
            <CommandEmpty>{emptyText}</CommandEmpty>
          ) : (
            groupEntries.map(([group, groupItems]) => (
              <CommandGroup
                key={group}
                className={cn(
                  densityStyles.group,
                  isEmbedded && "px-0",
                  isEmbedded && isAttached && "py-0.5",
                )}
                heading={showGroupHeading ? group : undefined}
              >
                {groupItems.map((item) => {
                  const itemIndex = filteredItems.findIndex((candidate) => candidate.key === item.key)
                  return (
                    <CommandItem
                      key={item.key}
                      value={item.key}
                      disabled={item.disabled}
                      onSelect={() => handleSelect(item)}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        densityStyles.item,
                        isEmbedded && "data-selected:bg-muted/80",
                        isEmbedded && isAttached && resolvedDensity !== "default" && "min-h-7 rounded-sm px-1.5 py-1",
                        activeIndex === itemIndex && "bg-muted",
                      )}
                    >
                      {item.icon}
                      <div className={cn("flex min-w-0 flex-1", densityStyles.itemBody)}>
                        <span className={cn("truncate", densityStyles.label)}>{item.label}</span>
                        {resolvedShowDescription && item.description && (
                          <span className={cn("truncate text-muted-foreground", densityStyles.description)}>
                            {item.description}
                          </span>
                        )}
                      </div>
                      {item.shortcut && resolvedShowShortcut && (
                        <CommandShortcut className={densityStyles.shortcut}>{item.shortcut}</CommandShortcut>
                      )}
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
export type {
  ChatCommandAttachTo,
  ChatCommandItem,
  ChatCommandPaletteDensity,
  ChatCommandPaletteLayout,
  ChatCommandPaletteProps,
}
