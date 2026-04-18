/**
 * Menu store - inspired by Fantastic Admin Pro
 */
import * as React from 'react'
import type { MenuItem } from '@/types/layout'

interface MenuStore {
  // State
  allMenus: MenuItem[]
  sidebarMenus: MenuItem[]
  actived: number

  // Actions
  setAllMenus: (menus: MenuItem[]) => void
  setSidebarMenus: (menus: MenuItem[]) => void
  setActived: (index: number) => void
  switchTo: (index: number) => void
}

type MenuStoreState = Pick<MenuStore, 'allMenus' | 'sidebarMenus' | 'actived'>

let state: MenuStoreState = {
  allMenus: [],
  sidebarMenus: [],
  actived: 0,
}

const listeners = new Set<() => void>()

function setState(update: MenuStoreState | ((prev: MenuStoreState) => MenuStoreState)) {
  state = typeof update === 'function' ? update(state) : update
  listeners.forEach((listener) => listener())
}

const actions = {
  setAllMenus: (menus: MenuItem[]) => setState((prev) => ({ ...prev, allMenus: menus })),
  setSidebarMenus: (menus: MenuItem[]) => setState((prev) => ({ ...prev, sidebarMenus: menus })),
  setActived: (index: number) => setState((prev) => ({ ...prev, actived: index })),
  switchTo: (index: number) => {
    setState((prev) => ({ ...prev, actived: index }))
  },
}

export function useMenuStore(): MenuStore {
  const snapshot = React.useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
    () => state
  )

  return {
    ...snapshot,
    ...actions,
  }
}

useMenuStore.getState = () => ({
  ...state,
  ...actions,
})
