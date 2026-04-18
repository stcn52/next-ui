/**
 * Layout dimensions hook - manages CSS variables for dynamic layout
 */
'use client'

import * as React from 'react'
import type { LayoutDimensions } from '@/types/layout'

const defaultDimensions: LayoutDimensions = {
  layoutTopHeight: 0,
  layoutBottomHeight: 0,
  headerHeight: 60,
  headerActualHeight: 60,
  mainSidebarWidth: 70,
  mainSidebarActualWidth: 70,
  subSidebarWidth: 220,
  subSidebarCollapseWidth: 64,
  subSidebarActualWidth: 220,
  topbarHeight: 50,
  topbarActualHeight: 50,
  tabbarHeight: 40,
  tabbarActualHeight: 40,
  toolbarHeight: 50,
  toolbarActualHeight: 50,
  mainContainerPaddingTop: 0,
  mainContainerPaddingBottom: 0,
}

/**
 * Convert layout dimensions to CSS variables
 */
export function dimensionsToCSSVariables(dimensions: LayoutDimensions): React.CSSProperties {
  return {
    '--g-slots-layout-top-height': `${dimensions.layoutTopHeight}px`,
    '--g-slots-layout-bottom-height': `${dimensions.layoutBottomHeight}px`,
    '--g-header-height': `${dimensions.headerHeight}px`,
    '--g-header-actual-height': `${dimensions.headerActualHeight}px`,
    '--g-main-sidebar-width': `${dimensions.mainSidebarWidth}px`,
    '--g-main-sidebar-actual-width': `${dimensions.mainSidebarActualWidth}px`,
    '--g-sub-sidebar-width': `${dimensions.subSidebarWidth}px`,
    '--g-sub-sidebar-collapse-width': `${dimensions.subSidebarCollapseWidth}px`,
    '--g-sub-sidebar-actual-width': `${dimensions.subSidebarActualWidth}px`,
    '--g-topbar-height': `${dimensions.topbarHeight}px`,
    '--g-topbar-actual-height': `${dimensions.topbarActualHeight}px`,
    '--g-tabbar-height': `${dimensions.tabbarHeight}px`,
    '--g-tabbar-actual-height': `${dimensions.tabbarActualHeight}px`,
    '--g-toolbar-height': `${dimensions.toolbarHeight}px`,
    '--g-toolbar-actual-height': `${dimensions.toolbarActualHeight}px`,
    '--g-main-container-padding-top': `${dimensions.mainContainerPaddingTop}px`,
    '--g-main-container-padding-bottom': `${dimensions.mainContainerPaddingBottom}px`,
  } as React.CSSProperties
}

/**
 * Hook to manage layout dimensions
 */
export function useLayoutDimensions() {
  const [dimensions, setDimensions] = React.useState<LayoutDimensions>(defaultDimensions)

  const updateDimension = React.useCallback(
    (key: keyof LayoutDimensions, value: number) => {
      setDimensions((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const updateDimensions = React.useCallback((updates: Partial<LayoutDimensions>) => {
    setDimensions((prev) => ({ ...prev, ...updates }))
  }, [])

  const cssVariables = React.useMemo(
    () => dimensionsToCSSVariables(dimensions),
    [dimensions]
  )

  return {
    dimensions,
    updateDimension,
    updateDimensions,
    cssVariables,
  }
}
