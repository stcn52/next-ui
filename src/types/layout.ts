/**
 * Layout system types - inspired by Fantastic Admin Pro
 */

/**
 * Device mode
 */
export type DeviceMode = 'pc' | 'mobile'

/**
 * Menu layout mode
 */
export type MenuMode =
  | 'side'        // Sidebar mode (main + sub sidebar)
  | 'head'        // Header mode (header + sub sidebar)
  | 'single'      // Single sidebar mode
  | 'only-side'   // Only main sidebar
  | 'only-head'   // Only header
  | 'side-panel'  // Sidebar with panel
  | 'head-panel'  // Header with panel

/**
 * Menu style variant
 */
export type MenuStyle = '' | 'arrow' | 'line' | 'dot'

/**
 * Main menu click behavior
 */
export type MainMenuClickMode = 'switch' | 'link'

/**
 * Topbar mode
 */
export type TopbarMode = 'static' | 'fixed'

/**
 * Page transition mode
 */
export type PageTransitionMode =
  | ''
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom'

/**
 * Menu item metadata
 */
export interface MenuMeta {
  title?: string
  icon?: string | [string, string] // [inactive, active]
  badge?: string | number | (() => string | number)
  menu?: boolean // Show in menu
  link?: string
  iframe?: string
  cache?: boolean
  maximize?: boolean | [boolean, boolean]
}

/**
 * Menu item
 */
export interface MenuItem {
  id: string
  path: string
  meta?: MenuMeta
  children?: MenuItem[]
}

/**
 * Layout settings
 */
export interface LayoutSettings {
  app: {
    layout: {
      centerWidth: number
      centerScope: 'outer' | 'inner'
    }
  }
  menu: {
    mode: MenuMode
    dark: boolean
    style: MenuStyle
    subMenuCollapse: boolean
    subMenuAutoCollapse: boolean
    enableSubMenuCollapseButton: boolean
    mainMenuClickMode: MainMenuClickMode
  }
  topbar: {
    mode: TopbarMode
    tabbar: boolean
    toolbar: boolean
  }
  toolbar: {
    layout: string[]
    breadcrumb: boolean
    notification: boolean
    i18n: boolean
    fullscreen: boolean
    theme: boolean
    account: boolean
  }
  page: {
    transitionMode: PageTransitionMode
  }
}

/**
 * Layout state
 */
export interface LayoutState {
  mode: DeviceMode
  mainPageMaximizeStatus: boolean
  isReloading: boolean
  settings: LayoutSettings
}

/**
 * Layout dimensions (CSS variables)
 */
export interface LayoutDimensions {
  // Slot heights
  layoutTopHeight: number
  layoutBottomHeight: number

  // Header
  headerHeight: number
  headerActualHeight: number

  // Main sidebar
  mainSidebarWidth: number
  mainSidebarActualWidth: number

  // Sub sidebar
  subSidebarWidth: number
  subSidebarCollapseWidth: number
  subSidebarActualWidth: number

  // Topbar
  topbarHeight: number
  topbarActualHeight: number
  tabbarHeight: number
  tabbarActualHeight: number
  toolbarHeight: number
  toolbarActualHeight: number

  // Main container
  mainContainerPaddingTop: number
  mainContainerPaddingBottom: number
}

/**
 * Slot names
 */
export type SlotName =
  | 'layout-top'
  | 'layout-bottom'
  | 'main-sidebar-top'
  | 'main-sidebar-after-logo'
  | 'sub-sidebar-top'
  | 'sub-sidebar-after-logo'
  | 'header-start'
  | 'header-after-logo'
  | 'fixed-content-before-area'
  | 'fixed-content-after-area'
  | 'free-position'

/**
 * Slot registry
 */
export type SlotRegistry = Partial<Record<SlotName, React.ReactNode>>
