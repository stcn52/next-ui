/**
 * Layout container component - inspired by Fantastic Admin Pro
 */
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layout'
import { useLayoutDimensions } from '@/hooks/use-layout-dimensions'
import { SlotProvider, Slot } from './slot-provider'
import { MainSidebar } from './main-sidebar'
import { SubSidebar } from './sub-sidebar'
import { Header } from './header'
import { Topbar } from './topbar'
import type { SlotRegistry } from '@/types/layout'

export interface LayoutContainerProps {
  children: React.ReactNode
  slots?: SlotRegistry
  className?: string
}

/**
 * Main layout container
 * Orchestrates all layout components based on settings
 */
export function LayoutContainer({
  children,
  slots = {},
  className,
}: LayoutContainerProps) {
  const { mode, settings, mainPageMaximizeStatus } = useLayoutStore()
  const { cssVariables, updateDimensions } = useLayoutDimensions()

  // Sidebar hover state
  const [isHoverSidebar, setIsHoverSidebar] = React.useState(false)
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHoverSidebar(true)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverSidebar(false)
    }, 300)
  }

  // Compute visibility flags
  const isHeaderEnable = React.useMemo(() => {
    return (
      !mainPageMaximizeStatus &&
      mode === 'pc' &&
      ['head', 'only-head', 'head-panel'].includes(settings.menu.mode)
    )
  }, [mainPageMaximizeStatus, mode, settings.menu.mode])

  const isMainSidebarEnable = React.useMemo(() => {
    return (
      !mainPageMaximizeStatus &&
      (['side', 'only-side', 'side-panel'].includes(settings.menu.mode) ||
        (mode === 'mobile' && settings.menu.mode !== 'single'))
    )
  }, [mainPageMaximizeStatus, mode, settings.menu.mode])

  const isSubSidebarEnable = React.useMemo(() => {
    return (
      !mainPageMaximizeStatus &&
      (mode === 'mobile' ||
        ['side', 'head', 'single'].includes(settings.menu.mode))
    )
  }, [mainPageMaximizeStatus, mode, settings.menu.mode])

  const isTopbarEnable = React.useMemo(() => {
    return !mainPageMaximizeStatus
  }, [mainPageMaximizeStatus])

  const isTabbarEnable = React.useMemo(() => {
    return settings.topbar.tabbar
  }, [settings.topbar.tabbar])

  const isToolbarEnable = React.useMemo(() => {
    return (
      settings.topbar.toolbar &&
      settings.toolbar.layout.some((item) => {
        if (item !== '->') {
          return settings.toolbar[item as keyof typeof settings.toolbar]
        }
        return false
      })
    )
  }, [settings])

  // Update actual dimensions based on visibility
  React.useEffect(() => {
    updateDimensions({
      headerActualHeight: isHeaderEnable ? 60 : 0,
      mainSidebarActualWidth: isMainSidebarEnable ? 70 : 0,
      subSidebarActualWidth: isSubSidebarEnable
        ? settings.menu.subMenuCollapse && mode !== 'mobile'
          ? 64
          : 220
        : 0,
      topbarActualHeight: isTopbarEnable
        ? (isTabbarEnable ? 40 : 0) + (isToolbarEnable ? 50 : 0)
        : 0,
      tabbarActualHeight: isTabbarEnable ? 40 : 0,
      toolbarActualHeight: isToolbarEnable ? 50 : 0,
    })
  }, [
    isHeaderEnable,
    isMainSidebarEnable,
    isSubSidebarEnable,
    isTopbarEnable,
    isTabbarEnable,
    isToolbarEnable,
    settings.menu.subMenuCollapse,
    mode,
    updateDimensions,
  ])

  return (
    <SlotProvider slots={slots}>
      <div
        className={cn('layout h-full', className)}
        style={{
          ...cssVariables,
          '--g-app-layout-center-width': `${settings.app.layout.centerWidth}px`,
        } as React.CSSProperties}
      >
        {/* Top slot area */}
        <div className="slots-layout-top fixed inset-x-0 top-0 z-[1030] mx-auto w-full bg-background shadow-[0_1px_0_0_hsl(var(--border))] transition-all empty:hidden">
          <Slot name="layout-top" />
        </div>

        {/* Header */}
        <Header enable={isHeaderEnable} className={cn(settings.menu.dark && 'dark')} />

        {/* Main wrapper */}
        <div className="wrapper relative">
          {/* Sidebar container */}
          <div
            className={cn(
              'sidebar-container',
              mode === 'mobile' &&
                !settings.menu.subMenuCollapse &&
                'show'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MainSidebar
              enable={isMainSidebarEnable}
              className={cn(settings.menu.dark && 'dark')}
            />
            <SubSidebar
              enable={isSubSidebarEnable}
              isHover={isHoverSidebar}
              className={cn(settings.menu.dark && 'dark')}
            />
          </div>

          {/* Mobile mask */}
          <div
            className={cn(
              'mobile-mask',
              mode === 'mobile' && !settings.menu.subMenuCollapse && 'show'
            )}
            onClick={() => useLayoutStore.getState().toggleSidebarCollapse()}
          />

          {/* Main container */}
          <div
            className={cn(
              'main-container',
              'pb-[calc(var(--g-slots-layout-bottom-height)+var(--g-main-container-padding-bottom,0px))]',
              'pt-[calc(var(--g-slots-layout-top-height)+var(--g-header-actual-height)+var(--g-topbar-actual-height))]'
            )}
            style={{
              marginLeft:
                mode === 'pc'
                  ? 'calc(var(--g-main-sidebar-actual-width) + var(--g-sub-sidebar-actual-width))'
                  : '0',
            }}
          >
            {/* Topbar area */}
            <div
              className="fixed-content-around-area fixed z-[1005] w-full"
              style={{
                top: 'calc(var(--g-slots-layout-top-height) + var(--g-header-actual-height))',
                left:
                  mode === 'pc'
                    ? 'calc(var(--g-main-sidebar-actual-width) + var(--g-sub-sidebar-actual-width))'
                    : '0',
                right: '0',
              }}
            >
              <Topbar
                enable={isTopbarEnable}
                enableTabbar={isTabbarEnable}
                enableToolbar={isToolbarEnable}
              />
              <div
                id="fixed-content-before-area"
                className="relative z-1 shadow-[0_1px_0_0_hsl(var(--border))] empty:hidden"
              >
                <Slot name="fixed-content-before-area" />
              </div>
            </div>

            {/* Main content */}
            <div id="app-content" className="main relative">
              {/* Maximize exit button */}
              {mainPageMaximizeStatus && (
                <div
                  className="fixed -right-10 -top-10 z-[2000] size-20 cursor-pointer rounded-full bg-primary text-primary-foreground opacity-50 transition-opacity hover:opacity-100"
                  onClick={() =>
                    useLayoutStore.getState().setMainPageMaximize(false)
                  }
                >
                  <span className="i-lucide-minimize absolute bottom-4 left-4 text-xl" />
                </div>
              )}

              {/* Page content */}
              {children}
            </div>

            {/* Bottom fixed content area */}
            <div
              className="fixed-content-around-area fixed bottom-0 z-[1005] w-full"
              style={{
                left:
                  mode === 'pc'
                    ? 'calc(var(--g-main-sidebar-actual-width) + var(--g-sub-sidebar-actual-width))'
                    : '0',
                right: '0',
              }}
            >
              <div
                id="fixed-content-after-area"
                className="relative z-1 shadow-[0_-1px_0_0_hsl(var(--border))] empty:hidden"
              >
                <Slot name="fixed-content-after-area" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom slot area */}
        <div className="slots-layout-bottom fixed inset-x-0 bottom-0 z-[1030] mx-auto w-full bg-background shadow-[0_-1px_0_0_hsl(var(--border))] transition-all empty:hidden">
          <Slot name="layout-bottom" />
        </div>

        {/* Free position slot */}
        <Slot name="free-position" />
      </div>
    </SlotProvider>
  )
}
