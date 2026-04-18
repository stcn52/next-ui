/**
 * Header component - inspired by Fantastic Admin Pro
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

export interface HeaderProps {
  enable: boolean
  className?: string
}

/**
 * Header component
 * Displays horizontal navigation menu
 */
export function Header({ enable, className }: HeaderProps) {
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
    <header
      className={cn(
        'header-container',
        'fixed left-0 top-0 z-[1010] w-full',
        'flex items-center',
        'bg-[var(--g-main-sidebar-bg)] border-b border-border',
        'transition-transform duration-300',
        className
      )}
      style={{ height: 'var(--g-header-height)' }}
    >
      <div className="flex h-full w-full items-center">
        <Slot name="header-start" />

        {/* Logo */}
        <div className="title flex h-full items-center px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">L</div>
            <span className="text-lg font-semibold text-foreground">Logo</span>
          </div>
        </div>

        <Slot name="header-after-logo" />

        {/* Menu */}
        <ScrollArea className="menu-container h-full flex-1 overscroll-contain">
          <div
            className={cn(
              'menu flex h-full transition-all',
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
                    'menu-item relative mx-1 py-2 transition-all',
                    isActive && 'active'
                  )}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            'group menu-item-container',
                            'relative flex h-full w-full cursor-pointer items-center justify-between gap-1',
                            'rounded-lg px-3 transition-colors',
                            'text-[var(--g-header-menu-color)]',
                            'hover:bg-[var(--g-header-menu-hover-bg)] hover:text-[var(--g-header-menu-hover-color)]',
                            isActive &&
                              'bg-[var(--g-header-menu-active-bg)]! text-[var(--g-header-menu-active-color)]!'
                          )}
                          onClick={() => switchTo(index)}
                        >
                          {iconName && (
                            <span className="text-base">
                              {/* Icon placeholder */}
                              <span className="i-lucide-layout-dashboard" />
                            </span>
                          )}
                          <span className="whitespace-nowrap text-sm">{title}</span>
                          {badgeValue && (
                            <Badge variant="default" className="h-5 px-1.5 text-xs">
                              {badgeValue}
                            </Badge>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </header>
  )
}
