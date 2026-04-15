"use client"

import { createContext, useContext, useCallback, useState, useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"

export interface Shortcut {
  keys: string
  label: string
  description?: string
  handler: () => void
  group?: string
}

interface ShortcutRegistryContext {
  shortcuts: Shortcut[]
  register: (shortcut: Shortcut) => () => void
}

const ShortcutContext = createContext<ShortcutRegistryContext>({
  shortcuts: [],
  register: () => () => {},
})

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  const register = useCallback((shortcut: Shortcut) => {
    setShortcuts((prev) => [...prev, shortcut])
    return () => {
      setShortcuts((prev) => prev.filter((s) => s !== shortcut))
    }
  }, [])

  const value = useMemo(() => ({ shortcuts, register }), [shortcuts, register])

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  )
}

export function useShortcutRegistry() {
  return useContext(ShortcutContext)
}

export function useGlobalShortcut(
  keys: string,
  handler: () => void,
  options?: { enabled?: boolean }
) {
  useHotkeys(keys, handler, {
    enableOnFormTags: false,
    preventDefault: true,
    enabled: options?.enabled ?? true,
  })
}

export { useHotkeys }
