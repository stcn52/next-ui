# Layout System Implementation Guide

**Created**: 2024-04-19
**Status**: ✅ Complete
**Inspired by**: Fantastic Admin Pro v6.0.0

## Overview

A complete 1:1 recreation of Fantastic Admin Pro's layout system with:
- **7 layout modes** (side, head, single, only-side, only-head, side-panel, head-panel)
- **Dual sidebar system** (main + sub)
- **CSS variable-based dynamic layout**
- **11+ slot positions** for extensibility
- **Responsive design** (PC/Mobile)
- **Keyboard shortcuts**
- **Page maximize mode**

## Architecture

### Core Files

```
src/
├── types/layout.ts                          # Type definitions
├── store/
│   ├── layout.ts                            # Layout state (Zustand)
│   └── menu.ts                              # Menu state (Zustand)
├── hooks/
│   ├── use-layout-dimensions.ts             # CSS variables management
│   ├── use-mobile-detection.ts              # Responsive detection
│   ├── use-hotkeys.ts                       # Keyboard shortcuts
│   └── index.ts                             # Hooks exports
├── components/layout/
│   ├── layout-container.tsx                 # Main container
│   ├── main-sidebar.tsx                     # Primary navigation (70px)
│   ├── sub-sidebar.tsx                      # Secondary navigation (220px)
│   ├── header.tsx                           # Horizontal navigation
│   ├── topbar.tsx                           # Tabbar + Toolbar
│   ├── slot-provider.tsx                    # Slot system
│   └── index.ts                             # Component exports
├── styles/layout.css                        # Layout CSS variables
└── stories/layout-system.stories.tsx        # Storybook demos
```

## Quick Start

### 1. Basic Usage

```tsx
import { LayoutContainer } from '@/components/layout'
import { useLayoutStore } from '@/store/layout'
import { useMenuStore } from '@/store/menu'
import { useMobileDetection, useLayoutHotkeys } from '@/hooks'

function App() {
  const { setAllMenus, setSidebarMenus } = useMenuStore()

  // Initialize menus
  React.useEffect(() => {
    setAllMenus([
      {
        id: 'dashboard',
        path: '/dashboard',
        meta: { title: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
        children: [
          { id: 'analytics', path: '/dashboard/analytics', meta: { title: 'Analytics' } },
        ],
      },
    ])
  }, [])

  // Enable responsive detection
  useMobileDetection()

  // Enable keyboard shortcuts
  useLayoutHotkeys()

  return (
    <LayoutContainer>
      <YourPageContent />
    </LayoutContainer>
  )
}
```

### 2. Change Layout Mode

```tsx
import { useLayoutStore } from '@/store/layout'

function LayoutModeSelector() {
  const { setMenuMode } = useLayoutStore()

  return (
    <select onChange={(e) => setMenuMode(e.target.value)}>
      <option value="side">Side Mode</option>
      <option value="head">Head Mode</option>
      <option value="single">Single Mode</option>
      <option value="only-side">Only Side</option>
      <option value="only-head">Only Head</option>
    </select>
  )
}
```

### 3. Use Slots

```tsx
import { LayoutContainer } from '@/components/layout'

function App() {
  return (
    <LayoutContainer
      slots={{
        'layout-top': <GlobalBanner />,
        'layout-bottom': <Footer />,
        'main-sidebar-after-logo': <UserProfile />,
        'sub-sidebar-top': <SearchBox />,
        'fixed-content-before-area': <Breadcrumb />,
        'free-position': <FloatingButton />,
      }}
    >
      <YourPageContent />
    </LayoutContainer>
  )
}
```

## Layout Modes

### Side Mode (Default)
- **Main Sidebar**: 70px (left)
- **Sub Sidebar**: 220px (left, collapsible to 64px)
- **Use case**: Complex applications with deep navigation

### Head Mode
- **Header**: 60px (top, horizontal menu)
- **Sub Sidebar**: 220px (left, collapsible)
- **Use case**: Wide screens, fewer top-level menus

### Single Mode
- **Sub Sidebar**: 220px (left, collapsible)
- **Use case**: Simple applications with flat navigation

### Only Side Mode
- **Main Sidebar**: 70px (left)
- **Use case**: Icon-only navigation

### Only Head Mode
- **Header**: 60px (top, horizontal menu)
- **Use case**: Minimal navigation

## CSS Variables

All layout dimensions are controlled via CSS variables:

```css
:root {
  /* Sidebars */
  --g-main-sidebar-width: 70px;
  --g-main-sidebar-actual-width: 70px;
  --g-sub-sidebar-width: 220px;
  --g-sub-sidebar-collapse-width: 64px;
  --g-sub-sidebar-actual-width: 220px;

  /* Header & Topbar */
  --g-header-height: 60px;
  --g-header-actual-height: 60px;
  --g-topbar-height: 50px;
  --g-topbar-actual-height: 50px;

  /* Colors */
  --g-main-sidebar-bg: hsl(var(--card));
  --g-main-sidebar-menu-color: hsl(var(--muted-foreground));
  --g-main-sidebar-menu-hover-color: hsl(var(--foreground));
  --g-main-sidebar-menu-hover-bg: hsl(var(--muted));
  --g-main-sidebar-menu-active-color: hsl(var(--primary));
  --g-main-sidebar-menu-active-bg: hsl(var(--primary) / 0.1);
}
```

## Slot System

### Available Slots

| Slot Name | Position | Use Case |
|-----------|----------|----------|
| `layout-top` | Top (fixed) | Global banners, announcements |
| `layout-bottom` | Bottom (fixed) | Footer, copyright |
| `main-sidebar-top` | Main sidebar top | Logo area customization |
| `main-sidebar-after-logo` | Main sidebar | User profile, quick actions |
| `sub-sidebar-top` | Sub sidebar top | Search box, filters |
| `sub-sidebar-after-logo` | Sub sidebar | Custom widgets |
| `header-start` | Header left | Custom branding |
| `header-after-logo` | Header | Additional navigation |
| `fixed-content-before-area` | Before content | Breadcrumb, page header |
| `fixed-content-after-area` | After content | Pagination, actions |
| `free-position` | Anywhere | Floating buttons, chat widget |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Toggle sidebar collapse |
| `F11` | Toggle page maximize |
| `Ctrl+Tab` | Next menu tab |
| `Ctrl+Shift+Tab` | Previous menu tab |
| `Ctrl+1-9` | Switch to menu 1-9 (head mode) |

## Responsive Design

### Breakpoints
- **PC Mode**: ≥1024px (lg)
- **Mobile Mode**: <1024px

### Mobile Behavior
- Sidebar collapses by default
- Overlay mask when sidebar opens
- Touch-friendly interactions
- Floating menu button

## State Management

### Layout Store (Zustand)

```tsx
interface LayoutStore {
  mode: 'pc' | 'mobile'
  mainPageMaximizeStatus: boolean
  isReloading: boolean
  settings: LayoutSettings

  setMode: (mode: DeviceMode) => void
  setMenuMode: (mode: MenuMode) => void
  setMainPageMaximize: (status: boolean) => void
  toggleMainPageMaximize: () => void
  toggleSidebarCollapse: () => void
  updateSettings: (settings: Partial<LayoutSettings>) => void
}
```

### Menu Store (Zustand)

```tsx
interface MenuStore {
  allMenus: MenuItem[]
  sidebarMenus: MenuItem[]
  actived: number

  setAllMenus: (menus: MenuItem[]) => void
  setSidebarMenus: (menus: MenuItem[]) => void
  switchTo: (index: number) => void
}
```

## Advanced Features

### Page Maximize Mode

```tsx
import { useLayoutStore } from '@/store/layout'

function MyPage() {
  const { setMainPageMaximize } = useLayoutStore()

  return (
    <div>
      <button onClick={() => setMainPageMaximize(true)}>
        Enter Fullscreen
      </button>
    </div>
  )
}
```

### Custom Hotkeys

```tsx
import { useHotkeys } from '@/hooks'

function MyComponent() {
  useHotkeys([
    {
      key: 's',
      ctrl: true,
      description: 'Save',
      handler: () => console.log('Save'),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Search',
      handler: () => console.log('Search'),
    },
  ])
}
```

### Dynamic Dimensions

```tsx
import { useLayoutDimensions } from '@/hooks'

function MyComponent() {
  const { dimensions, updateDimension } = useLayoutDimensions()

  // Change sidebar width
  updateDimension('mainSidebarWidth', 80)
}
```

## Storybook

View live demos:
```bash
npm run storybook
```

Navigate to: **Layout > Layout System**

## Migration from Existing Layout

### Step 1: Replace Layout Component

```tsx
// Before
<div className="app-layout">
  <Sidebar />
  <Header />
  <main>{children}</main>
</div>

// After
<LayoutContainer>
  {children}
</LayoutContainer>
```

### Step 2: Initialize Menus

```tsx
import { useMenuStore } from '@/store/menu'

const { setAllMenus } = useMenuStore()

setAllMenus([
  // Your menu structure
])
```

### Step 3: Enable Features

```tsx
import { useMobileDetection, useLayoutHotkeys } from '@/hooks'

useMobileDetection()  // Auto PC/Mobile detection
useLayoutHotkeys()    // Enable keyboard shortcuts
```

## Comparison with Fantastic Admin Pro

| Feature | Fantastic Admin | Next UI Layout | Status |
|---------|----------------|----------------|--------|
| Layout Modes | 7 modes | 7 modes | ✅ 1:1 |
| Dual Sidebar | ✅ | ✅ | ✅ 1:1 |
| CSS Variables | ✅ | ✅ | ✅ 1:1 |
| Slot System | 11+ slots | 11+ slots | ✅ 1:1 |
| Responsive | ✅ | ✅ | ✅ 1:1 |
| Hotkeys | ✅ | ✅ | ✅ 1:1 |
| Page Maximize | ✅ | ✅ | ✅ 1:1 |
| State Persistence | Pinia | Zustand | ✅ Equivalent |
| Framework | Vue 3 | React | ✅ Adapted |

## Performance

- **CSS Variables**: Runtime layout changes without recompilation
- **Zustand**: Minimal re-renders with selective subscriptions
- **Lazy Loading**: Components load on demand
- **Memoization**: Expensive computations cached

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Troubleshooting

### Sidebar not showing
- Check `isMainSidebarEnable` / `isSubSidebarEnable` computed values
- Verify menu mode matches your expectation
- Ensure menus are initialized

### CSS variables not working
- Import `@/styles/layout.css` in your main CSS file
- Check browser DevTools for CSS variable values

### Hotkeys not working
- Call `useLayoutHotkeys()` in your root component
- Check for conflicting browser shortcuts

## Next Steps

1. ✅ Integrate with routing system
2. ✅ Add page transition animations
3. ✅ Implement tab management
4. ✅ Add theme customization UI
5. ✅ Create layout presets

## Resources

- [Fantastic Admin Pro Documentation](https://fantastic-admin.github.io/)
- [Analysis Document](./fantastic-admin-layout-analysis.md)
- [Storybook Demos](http://localhost:6006/?path=/story/layout-layout-system)

## License

MIT
