"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface SortableListProps<T extends { id: string | number }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, dragHandle: React.ReactNode) => React.ReactNode
  strategy?: "vertical" | "grid"
  className?: string
}

function SortableList<T extends { id: string | number }>({
  items,
  onReorder,
  renderItem,
  strategy = "vertical",
  className,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  const sortingStrategy =
    strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={sortingStrategy}
      >
        <div data-slot="sortable-list" className={className}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {(dragHandle) => renderItem(item, dragHandle)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableItem({
  id,
  children,
}: {
  id: string | number
  children: (dragHandle: React.ReactNode) => React.ReactNode
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

  const dragHandle = (
    <button
      className={cn(
        "cursor-grab touch-none text-muted-foreground hover:text-foreground",
        isDragging && "cursor-grabbing"
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="sortable-item"
      className={cn(isDragging && "z-50 opacity-80")}
    >
      {children(dragHandle)}
    </div>
  )
}

// Convenience hook for simple state management
function useSortableList<T extends { id: string | number }>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems)
  return { items, setItems, onReorder: setItems }
}

export { SortableList, SortableItem, useSortableList, type SortableListProps }
