/**
 * Hotkeys hook - inspired by Fantastic Admin Pro
 */
'use client'

import * as React from 'react'
import { useLayoutStore } from '@/store/layout'
import { useMenuStore } from '@/store/menu'

export interface HotkeyConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  handler: () => void
}

/**
 * Hotkeys hook
 * Manages keyboard shortcuts
 */
export function useHotkeys(hotkeys: HotkeyConfig[]) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const hotkey of hotkeys) {
        const keyMatch = event.key.toLowerCase() === hotkey.key.toLowerCase()
        const ctrlMatch = hotkey.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = hotkey.shift ? event.shiftKey : !event.shiftKey
        const altMatch = hotkey.alt ? event.altKey : !event.altKey
        const metaMatch = hotkey.meta ? event.metaKey : !event.metaKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault()
          hotkey.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotkeys])
}

/**
 * Default layout hotkeys
 */
export function useLayoutHotkeys() {
  const { settings, setMainPageMaximize, mainPageMaximizeStatus } = useLayoutStore()
  const { switchTo, actived, allMenus } = useMenuStore()

  const hotkeys = React.useMemo<HotkeyConfig[]>(() => {
    const keys: HotkeyConfig[] = []

    // Toggle sidebar collapse (Ctrl+B)
    if (settings.menu.enableSubMenuCollapseButton) {
      keys.push({
        key: 'b',
        ctrl: true,
        description: 'Toggle sidebar collapse',
        handler: () => {
          useLayoutStore.getState().toggleSidebarCollapse()
        },
      })
    }

    // Toggle page maximize (F11)
    keys.push({
      key: 'F11',
      description: 'Toggle page maximize',
      handler: () => {
        setMainPageMaximize(!mainPageMaximizeStatus)
      },
    })

    // Switch menu tabs (Ctrl+1-9)
    if (settings.menu.mode === 'head' || settings.menu.mode === 'only-head') {
      for (let i = 0; i < Math.min(allMenus.length, 9); i++) {
        keys.push({
          key: String(i + 1),
          ctrl: true,
          description: `Switch to menu ${i + 1}`,
          handler: () => {
            switchTo(i)
          },
        })
      }

      // Next/Previous menu (Ctrl+Tab / Ctrl+Shift+Tab)
      keys.push({
        key: 'Tab',
        ctrl: true,
        description: 'Next menu',
        handler: () => {
          const nextIndex = (actived + 1) % allMenus.length
          switchTo(nextIndex)
        },
      })

      keys.push({
        key: 'Tab',
        ctrl: true,
        shift: true,
        description: 'Previous menu',
        handler: () => {
          const prevIndex = (actived - 1 + allMenus.length) % allMenus.length
          switchTo(prevIndex)
        },
      })
    }

    return keys
  }, [
    settings.menu.enableSubMenuCollapseButton,
    settings.menu.mode,
    allMenus.length,
    actived,
    mainPageMaximizeStatus,
    setMainPageMaximize,
    switchTo,
  ])

  useHotkeys(hotkeys)

  return hotkeys
}
