import * as React from "react"
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileTreeItem {
  id: string
  name: string
  /** If children is present (even empty array), this node is treated as a folder. */
  children?: FileTreeItem[]
  /** Optional icon override for this node */
  icon?: React.ReactNode
}

export interface FileTreeProps {
  items: FileTreeItem[]
  /** The id of the currently selected item */
  selected?: string
  /** Callback fired when an item is clicked */
  onSelect?: (item: FileTreeItem) => void
  /** Initial set of open folder ids */
  defaultOpen?: string[]
  className?: string
}

// ─── Internal context ─────────────────────────────────────────────────────────

interface FileTreeCtx {
  selected?: string
  openIds: Set<string>
  onSelect?: (item: FileTreeItem) => void
  toggle: (id: string) => void
}

const FileTreeContext = React.createContext<FileTreeCtx>({
  openIds: new Set(),
  toggle: () => {},
})

// ─── Node ─────────────────────────────────────────────────────────────────────

interface NodeProps {
  item: FileTreeItem
  depth: number
}

function FileTreeNode({ item, depth }: NodeProps) {
  const { selected, openIds, onSelect, toggle } = React.useContext(FileTreeContext)
  const isFolder = Array.isArray(item.children)
  const isOpen = openIds.has(item.id)
  const isSelected = selected === item.id

  function handleClick() {
    if (isFolder) toggle(item.id)
    onSelect?.(item)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
    if (e.key === "ArrowRight" && isFolder && !isOpen) toggle(item.id)
    if (e.key === "ArrowLeft" && isFolder && isOpen) toggle(item.id)
  }

  const IndentPx = depth * 16

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={isFolder ? isOpen : undefined}
        tabIndex={0}
        style={{ paddingLeft: IndentPx + 4 }}
        className={cn(
          "flex items-center gap-1.5 py-0.5 pr-2 rounded-sm cursor-pointer select-none text-sm",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent/60 text-foreground",
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Chevron for folders */}
        {isFolder ? (
          <ChevronRightIcon
            className={cn(
              "size-3.5 text-muted-foreground shrink-0 transition-transform",
              isOpen && "rotate-90",
            )}
            aria-hidden
          />
        ) : (
          <span className="size-3.5 shrink-0" aria-hidden />
        )}

        {/* File / folder icon */}
        {item.icon ? (
          <span className="size-4 shrink-0">{item.icon}</span>
        ) : isFolder ? (
          isOpen ? (
            <FolderOpenIcon className="size-4 text-yellow-500 shrink-0" aria-hidden />
          ) : (
            <FolderIcon className="size-4 text-yellow-500 shrink-0" aria-hidden />
          )
        ) : (
          <FileIcon className="size-4 text-muted-foreground shrink-0" aria-hidden />
        )}

        <span className="truncate">{item.name}</span>
      </div>

      {/* Children */}
      {isFolder && isOpen && item.children && item.children.length > 0 && (
        <ul role="group">
          {item.children.map((child) => (
            <FileTreeNode key={child.id} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

export function FileTree({
  items,
  selected,
  onSelect,
  defaultOpen = [],
  className,
}: FileTreeProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(defaultOpen))

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  return (
    <FileTreeContext.Provider value={{ selected, openIds, onSelect, toggle }}>
      <ul
        role="tree"
        aria-label="文件树"
        className={cn("w-full py-1 font-mono text-[13px]", className)}
      >
        {items.map((item) => (
          <FileTreeNode key={item.id} item={item} depth={0} />
        ))}
      </ul>
    </FileTreeContext.Provider>
  )
}
