/**
 * Topbar component - inspired by Fantastic Admin Pro
 */
'use client'

import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout'

export interface TopbarProps {
  enable: boolean
  enableTabbar: boolean
  enableToolbar: boolean
  className?: string
}

/**
 * Topbar component
 * Contains tabbar and toolbar
 */
export function Topbar({
  enable,
  enableTabbar,
  enableToolbar,
  className,
}: TopbarProps) {
  if (!enable) {
    return null
  }

  return (
    <div
      className={cn(
        'topbar-container',
        'w-full bg-background border-b border-border',
        className
      )}
    >
      {enableTabbar && <Tabbar />}
      {enableToolbar && <Toolbar />}
    </div>
  )
}

/**
 * Tabbar component
 * Displays page tabs
 */
function Tabbar() {
  return (
    <div
      className="tabbar flex items-center gap-1 px-4"
      style={{ height: 'var(--g-tabbar-height)' }}
    >
      {/* Placeholder tabs */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
          <span>Dashboard</span>
          <button className="hover:text-destructive">
            <span className="i-lucide-x text-xs" />
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
          <span>Settings</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Toolbar component
 * Displays toolbar buttons
 */
function Toolbar() {
  const { settings } = useLayoutStore()

  return (
    <div
      className="toolbar flex items-center justify-between px-4"
      style={{ height: 'var(--g-toolbar-height)' }}
    >
      <div className="flex items-center gap-2">
        {settings.toolbar.breadcrumb && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="i-lucide-chevron-right text-xs" />
            <span className="text-foreground">Dashboard</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {settings.toolbar.notification && (
          <button className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
            <span className="i-lucide-bell text-base" />
          </button>
        )}
        {settings.toolbar.i18n && (
          <button className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
            <span className="i-lucide-languages text-base" />
          </button>
        )}
        {settings.toolbar.fullscreen && (
          <button className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
            <span className="i-lucide-maximize text-base" />
          </button>
        )}
        {settings.toolbar.theme && (
          <button className="flex size-8 items-center justify-center rounded-md hover:bg-muted">
            <span className="i-lucide-moon text-base" />
          </button>
        )}
        {settings.toolbar.account && (
          <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
            <div className="size-6 rounded-full bg-primary" />
            <span className="text-sm">User</span>
          </button>
        )}
      </div>
    </div>
  )
}
