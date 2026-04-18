/**
 * Layout store - inspired by Fantastic Admin Pro
 */
import * as React from 'react'
import type { LayoutState, LayoutSettings, DeviceMode, MenuMode } from '@/types/layout'

const defaultSettings: LayoutSettings = {
  app: {
    layout: {
      centerWidth: 1200,
      centerScope: 'outer',
    },
  },
  menu: {
    mode: 'side',
    dark: false,
    style: '',
    subMenuCollapse: false,
    subMenuAutoCollapse: true,
    enableSubMenuCollapseButton: true,
    mainMenuClickMode: 'switch',
  },
  topbar: {
    mode: 'fixed',
    tabbar: true,
    toolbar: true,
  },
  toolbar: {
    layout: ['breadcrumb', '->', 'notification', 'i18n', 'fullscreen', 'theme', 'account'],
    breadcrumb: true,
    notification: true,
    i18n: true,
    fullscreen: true,
    theme: true,
    account: true,
  },
  page: {
    transitionMode: 'fade',
  },
}

interface LayoutStore extends LayoutState {
  // Actions
  setMode: (mode: DeviceMode) => void
  setMenuMode: (mode: MenuMode) => void
  setMainPageMaximize: (status: boolean) => void
  toggleMainPageMaximize: () => void
  setReloading: (status: boolean) => void
  toggleSidebarCollapse: () => void
  updateSettings: (settings: Partial<LayoutSettings>) => void
  resetSettings: () => void
}

type LayoutStoreState = Omit<LayoutStore, keyof {
  setMode: unknown
  setMenuMode: unknown
  setMainPageMaximize: unknown
  toggleMainPageMaximize: unknown
  setReloading: unknown
  toggleSidebarCollapse: unknown
  updateSettings: unknown
  resetSettings: unknown
}>

const STORAGE_KEY = 'layout-settings'

const initialState: LayoutStoreState = {
  mode: 'pc',
  mainPageMaximizeStatus: false,
  isReloading: false,
  settings: defaultSettings,
}

let state: LayoutStoreState = loadInitialState()
const listeners = new Set<() => void>()

function loadInitialState(): LayoutStoreState {
  if (typeof window === 'undefined') {
    return initialState
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialState
    const parsed = JSON.parse(stored) as Partial<LayoutStoreState>
    return {
      ...initialState,
      ...parsed,
      settings: {
        ...defaultSettings,
        ...parsed.settings,
        app: { ...defaultSettings.app, ...parsed.settings?.app },
        menu: { ...defaultSettings.menu, ...parsed.settings?.menu },
        topbar: { ...defaultSettings.topbar, ...parsed.settings?.topbar },
        toolbar: { ...defaultSettings.toolbar, ...parsed.settings?.toolbar },
        page: { ...defaultSettings.page, ...parsed.settings?.page },
      },
    }
  } catch {
    return initialState
  }
}

function persistState(nextState: LayoutStoreState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      mode: nextState.mode,
      settings: nextState.settings,
    })
  )
}

function setState(update: LayoutStoreState | ((prev: LayoutStoreState) => LayoutStoreState)) {
  state = typeof update === 'function' ? update(state) : update
  persistState(state)
  listeners.forEach((listener) => listener())
}

const actions = {
  setMode: (mode: DeviceMode) => setState((prev) => ({ ...prev, mode })),
  setMenuMode: (mode: MenuMode) =>
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        menu: {
          ...prev.settings.menu,
          mode,
        },
      },
    })),
  setMainPageMaximize: (status: boolean) =>
    setState((prev) => ({ ...prev, mainPageMaximizeStatus: status })),
  toggleMainPageMaximize: () =>
    setState((prev) => ({
      ...prev,
      mainPageMaximizeStatus: !prev.mainPageMaximizeStatus,
    })),
  setReloading: (status: boolean) =>
    setState((prev) => ({ ...prev, isReloading: status })),
  toggleSidebarCollapse: () =>
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        menu: {
          ...prev.settings.menu,
          subMenuCollapse: !prev.settings.menu.subMenuCollapse,
        },
      },
    })),
  updateSettings: (newSettings: Partial<LayoutSettings>) =>
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
        app: { ...prev.settings.app, ...newSettings.app },
        menu: { ...prev.settings.menu, ...newSettings.menu },
        topbar: { ...prev.settings.topbar, ...newSettings.topbar },
        toolbar: { ...prev.settings.toolbar, ...newSettings.toolbar },
        page: { ...prev.settings.page, ...newSettings.page },
      },
    })),
  resetSettings: () =>
    setState((prev) => ({
      ...prev,
      settings: defaultSettings,
    })),
}

export function useLayoutStore(): LayoutStore {
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

useLayoutStore.getState = () => ({
  ...state,
  ...actions,
})
