"use client"

import { useState, useCallback, useEffect } from "react"
import type { KanbanColumn, KanbanItem } from "@/components/ui/kanban"

/**
 * Persist kanban board columns to localStorage.
 * Falls back to initialColumns if no saved state or on parse error.
 */
function useKanbanStorage<T extends KanbanItem>(
  key: string,
  initialColumns: KanbanColumn<T>[],
) {
  const [columns, setColumns] = useState<KanbanColumn<T>[]>(() => {
    if (typeof window === "undefined") return initialColumns
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved) as KanbanColumn<T>[]
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore parse errors
    }
    return initialColumns
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(columns))
    } catch {
      // ignore quota errors
    }
  }, [key, columns])

  const resetColumns = useCallback(() => {
    setColumns(initialColumns)
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }, [key, initialColumns])

  return { columns, setColumns, resetColumns }
}

export { useKanbanStorage }
