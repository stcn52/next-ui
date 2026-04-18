/**
 * Main sidebar component - inspired by Fantastic Admin Pro
 */
'use client'

import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout'
import { useMenuStore } from '@/store/menu'
import { Slot } from './slot-provider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/display/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/overlays/tooltip'

export interface MainSidebarProps {
  enable: boolean
  className?: string
}

/**
 * Main sidebar component
 * Displays primary navigation with icons and labels
 */
export function MainSidebar({ enable, className }: MainSidebarProps) {
  const { settings } = useLayoutStore()
  const { allMenus, actived, switchTo } = useMenuStore()

  if (!enable) {
    return null
  }

  const getIconName = (
    isActive: boolean,
    icon?: string | [string, string]
  ): string | undefined => {
    if (!icon) return undefined
    if (typeof icon === 'string') return icon
    return isActive ? icon[1] : icon[0]
  }

  const getBadgeValue = (
    badge?: string | number | (() => string | number)
  ): string | number | undefined => {
    if (!badge) return undefined
    return typeof badge === 'function' ? badge() : badge
  }

  return (
    <aside
      className={cn(
        'main-sidebar-container',
        'fixed left-0 top-0 z-[1010] h-full',
        'flex flex-col',
        'bg-[var(--g-main-sidebar-bg)] border-r border-border',
        'transition-transform duration-300',
        className
      )}
      style={{ width: 'var(--g-main-sidebar-width)' }}
    >
      <Slot name="main-sidebar-top" />

      {/* Logo area */}
      <div className="sidebar-logo flex h-[var(--g-header-height)] items-center justify-center border-b border-border">
        <div className="text-2xl font-bold text-primary">L</div>
      </div>

      <Slot name="main-sidebar-after-logo" />

      {/* Menu area */}
      <ScrollArea className="menu flex-1 overscroll-contain">
        <div
          className={cn(
            'flex w-full flex-col py-1 transition-all',
            settings.menu.style && `menu-active-${settings.menu.style}`
          )}
        >
          {allMenus.map((item, index: number) => {
            const isActive = index === actived
            const iconName = getIconName(isActive, item.meta?.icon)
            const badgeValue = getBadgeValue(item.meta?.badge)
            const title = item.meta?.title || item.id

            return (
              <div
                key={item.id}
                className={cn(
                  'menu-item relative px-2 py-1 transition-all',
                  isActive && 'active'
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          'group menu-item-container',
                          'relative flex h-full w-full cursor-pointer items-center justify-between',
                          'rounded-lg py-4 px-2 transition-colors',
                          'text-[var(--g-main-sidebar-menu-color)]',
                          'hover:bg-[var(--g-main-sidebar-menu-hover-bg)] hover:text-[var(--g-main-sidebar-menu-hover-color)]',
                          isActive &&
                            'bg-[var(--g-main-sidebar-menu-active-bg)]! text-[var(--g-main-sidebar-menu-active-color)]!'
                        )}
                        onClick={() => switchTo(index)}
                      >
                        <div className="inline-flex w-full flex-1 flex-col items-center justify-center gap-1">
                          {iconName && (
                            <div
                              className={cn(
                                'menu-item-container-icon',
                                'text-xl transition-transform group-hover:scale-120'
                              )}
                            >
                              {/* Icon placeholder - replace with actual icon component */}
                              <span className="i-lucide-layout-dashboard" />
                            </div>
                          )}
                          <span className="w-full flex-1 truncate text-center text-sm transition-all">
                            {title}
                          </span>
                        </div>
                        {badgeValue && (
                          <Badge
                            variant="default"
                            className="badge absolute right-2 top-2"
                          >
                            {badgeValue}
                          </Badge>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
