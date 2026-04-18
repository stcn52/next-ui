/**
 * Sub sidebar component - inspired by Fantastic Admin Pro
 */
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout'
import { useMenuStore } from '@/store/menu'
import { Slot } from './slot-provider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/display/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { MenuItem } from '@/types/layout'

export interface SubSidebarProps {
  enable: boolean
  isHover: boolean
  className?: string
}

/**
 * Sub sidebar component
 * Displays secondary navigation menu
 */
export function SubSidebar({ enable, isHover, className }: SubSidebarProps) {
  const { mode, settings } = useLayoutStore()
  const { sidebarMenus } = useMenuStore()

  const isCollapse = React.useMemo(() => {
    if (mode === 'pc') {
      if (
        settings.menu.subMenuCollapse &&
        (!isHover || (isHover && !settings.menu.subMenuAutoCollapse))
      ) {
        return true
      }
      return false
    }
    return settings.menu.subMenuCollapse
  }, [mode, settings.menu.subMenuCollapse, settings.menu.subMenuAutoCollapse, isHover])

  if (!enable) {
    return null
  }

  const width = isCollapse
    ? 'var(--g-sub-sidebar-collapse-width)'
    : 'var(--g-sub-sidebar-width)'

  return (
    <aside
      className={cn(
        'sub-sidebar-container',
        'fixed left-[var(--g-main-sidebar-actual-width)] top-0 z-[1010] h-full',
        'flex flex-col',
        'bg-[var(--g-sub-sidebar-bg)] border-r border-border',
        'transition-all duration-300',
        isCollapse && 'is-collapse',
        className
      )}
      style={{ width }}
    >
      <Slot name="sub-sidebar-top" />

      {/* Logo area */}
      <div className="flex h-[var(--g-header-height)] items-center border-b border-border px-4">
        {!isCollapse && (
          <div className="text-lg font-semibold text-foreground">Menu</div>
        )}
      </div>

      <Slot name="sub-sidebar-after-logo" />

      {/* Menu area */}
      <ScrollArea className="flex-1 overscroll-contain">
        <nav className="p-2">
          {sidebarMenus.map((item: MenuItem) => (
            <SubMenuItem key={item.id} item={item} isCollapse={isCollapse} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}

interface SubMenuItemProps {
  item: MenuItem
  isCollapse: boolean
  level?: number
}

function SubMenuItem({ item, isCollapse, level = 0 }: SubMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const title = item.meta?.title || item.id
  const badgeValue = item.meta?.badge
    ? typeof item.meta.badge === 'function'
      ? item.meta.badge()
      : item.meta.badge
    : undefined

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors',
            'text-[var(--g-sub-sidebar-menu-color)]',
            'hover:bg-[var(--g-sub-sidebar-menu-hover-bg)] hover:text-[var(--g-sub-sidebar-menu-hover-color)]',
            level > 0 && 'ml-4'
          )}
        >
          <div className="flex items-center gap-2">
            {item.meta?.icon && (
              <span className="text-base">
                {/* Icon placeholder */}
                <span className="i-lucide-folder" />
              </span>
            )}
            {!isCollapse && <span className="text-sm">{title}</span>}
          </div>
          {!isCollapse && (
            <div className="flex items-center gap-2">
              {badgeValue && (
                <Badge variant="default" className="h-5 px-1.5 text-xs">
                  {badgeValue}
                </Badge>
              )}
              <span
                className={cn(
                  'text-xs transition-transform',
                  isOpen && 'rotate-90'
                )}
              >
                <span className="i-lucide-chevron-right" />
              </span>
            </div>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1">
            {item.children?.map((child) => (
              <SubMenuItem
                key={child.id}
                item={child}
                isCollapse={isCollapse}
                level={level + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <a
      href={item.path}
      className={cn(
        'group flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors',
        'text-[var(--g-sub-sidebar-menu-color)]',
        'hover:bg-[var(--g-sub-sidebar-menu-hover-bg)] hover:text-[var(--g-sub-sidebar-menu-hover-color)]',
        level > 0 && 'ml-4'
      )}
    >
      <div className="flex items-center gap-2">
        {item.meta?.icon && (
          <span className="text-base">
            {/* Icon placeholder */}
            <span className="i-lucide-file" />
          </span>
        )}
        {!isCollapse && <span className="text-sm">{title}</span>}
      </div>
      {!isCollapse && badgeValue && (
        <Badge variant="default" className="h-5 px-1.5 text-xs">
          {badgeValue}
        </Badge>
      )}
    </a>
  )
}
