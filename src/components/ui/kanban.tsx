"use client"

import { useState, useCallback, memo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/config-provider"

export interface KanbanItem {
  id: UniqueIdentifier
  [key: string]: unknown
}

export interface KanbanColumn<T extends KanbanItem> {
  id: string
  title: string
  items: T[]
}

interface KanbanBoardProps<T extends KanbanItem> {
  columns: KanbanColumn<T>[]
  onColumnsChange: (columns: KanbanColumn<T>[]) => void
  renderItem: (item: T) => React.ReactNode
  renderColumnHeader?: (column: KanbanColumn<T>) => React.ReactNode
  renderOverlay?: (item: T) => React.ReactNode
  className?: string
}

function KanbanBoard<T extends KanbanItem>({
  columns,
  onColumnsChange,
  renderItem,
  renderColumnHeader,
  renderOverlay,
  className,
}: KanbanBoardProps<T>) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findColumn = useCallback(
    (id: UniqueIdentifier) => {
      // Check if id is a column
      const col = columns.find((c) => c.id === id)
      if (col) return col

      // Check items
      return columns.find((c) => c.items.some((item) => item.id === id))
    },
    [columns]
  )

  const activeItem = activeId
    ? columns.flatMap((c) => c.items).find((i) => i.id === activeId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id)

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return

    const newColumns = columns.map((col) => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          items: col.items.filter((i) => i.id !== active.id),
        }
      }
      if (col.id === overColumn.id) {
        const overIndex = col.items.findIndex((i) => i.id === over.id)
        const activeItem = activeColumn.items.find((i) => i.id === active.id)!
        const newItems = [...col.items]
        if (overIndex >= 0) {
          newItems.splice(overIndex, 0, activeItem)
        } else {
          newItems.push(activeItem)
        }
        return { ...col, items: newItems }
      }
      return col
    })

    onColumnsChange(newColumns)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id)

    if (!activeColumn || !overColumn) return

    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.items.findIndex((i) => i.id === active.id)
      const newIndex = activeColumn.items.findIndex((i) => i.id === over.id)

      if (oldIndex !== newIndex) {
        const newColumns = columns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              items: arrayMove(col.items, oldIndex, newIndex),
            }
          }
          return col
        })
        onColumnsChange(newColumns)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        data-slot="kanban-board"
        className={cn("flex gap-3", className)}
      >
        {columns.map((column) => (
          <KanbanColumnContainer
            key={column.id}
            column={column}
            renderItem={renderItem}
            renderColumnHeader={renderColumnHeader}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem && renderOverlay
          ? renderOverlay(activeItem)
          : activeItem
            ? renderItem(activeItem)
            : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumnContainer<T extends KanbanItem>({
  column,
  renderItem,
  renderColumnHeader,
}: {
  column: KanbanColumn<T>
  renderItem: (item: T) => React.ReactNode
  renderColumnHeader?: (column: KanbanColumn<T>) => React.ReactNode
}) {
  const locale = useLocale()
  return (
    <div
      data-slot="kanban-column"
      role="region"
      aria-label={`${column.title} column, ${column.items.length} ${locale.items}`}
      className="flex w-72 flex-col rounded-md border bg-muted/30 p-1.5"
    >
      {renderColumnHeader ? (
        renderColumnHeader(column)
      ) : (
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <span className="text-xs text-muted-foreground">
            {column.items.length}
          </span>
        </div>
      )}
      <SortableContext
        items={column.items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div role="list" className="flex min-h-[40px] flex-col gap-1.5">
          {column.items.map((item) => (
            <KanbanSortableCard key={item.id} id={item.id}>
              {renderItem(item)}
            </KanbanSortableCard>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function KanbanSortableCard({
  id,
  children,
}: {
  id: UniqueIdentifier
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="kanban-card"
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card p-2.5 shadow-sm",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

const MemoizedKanbanSortableCard = memo(KanbanSortableCard)

export {
  KanbanBoard,
  KanbanColumnContainer,
  MemoizedKanbanSortableCard as KanbanSortableCard,
  type KanbanBoardProps,
}
