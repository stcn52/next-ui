/**
 * Layout system Storybook - inspired by Fantastic Admin Pro
 */
import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { LayoutContainer } from '@/components/layout/layout-container'
import { useLayoutStore } from '@/store/layout'
import { useMenuStore } from '@/store/menu'
import { useMobileDetection, useLayoutHotkeys } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/inputs/select'
import { Switch } from '@/components/ui/inputs/switch'
import { Label } from '@/components/ui/label'
import type { MenuMode } from '@/types/layout'

const meta = {
  title: 'Layout/Layout System',
  component: LayoutContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete layout system inspired by Fantastic Admin Pro with 7 layout modes, dual sidebars, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutContainer>

export default meta
type Story = StoryObj<typeof meta>

// Mock menu data
const mockMenus = [
  {
    id: 'dashboard',
    path: '/dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      badge: 5,
    },
    children: [
      {
        id: 'analytics',
        path: '/dashboard/analytics',
        meta: { title: 'Analytics' },
      },
      {
        id: 'reports',
        path: '/dashboard/reports',
        meta: { title: 'Reports', badge: 3 },
      },
    ],
  },
  {
    id: 'users',
    path: '/users',
    meta: {
      title: 'Users',
      icon: 'i-lucide-users',
    },
    children: [
      {
        id: 'user-list',
        path: '/users/list',
        meta: { title: 'User List' },
      },
      {
        id: 'user-roles',
        path: '/users/roles',
        meta: { title: 'Roles' },
      },
    ],
  },
  {
    id: 'settings',
    path: '/settings',
    meta: {
      title: 'Settings',
      icon: 'i-lucide-settings',
    },
    children: [
      {
        id: 'general',
        path: '/settings/general',
        meta: { title: 'General' },
      },
      {
        id: 'security',
        path: '/settings/security',
        meta: { title: 'Security' },
      },
    ],
  },
]

// Layout wrapper component
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { setAllMenus, setSidebarMenus, actived } = useMenuStore()

  // Initialize menus
  React.useEffect(() => {
    setAllMenus(mockMenus)
    setSidebarMenus(mockMenus[0].children || [])
  }, [setAllMenus, setSidebarMenus])

  // Update sidebar menus when actived changes
  React.useEffect(() => {
    setSidebarMenus(mockMenus[actived]?.children || [])
  }, [actived, setSidebarMenus])

  // Enable mobile detection
  useMobileDetection()

  // Enable hotkeys
  useLayoutHotkeys()

  return (
    <LayoutContainer>
      <div className="p-8">
        {children}
      </div>
    </LayoutContainer>
  )
}

// Layout controls component
function LayoutControls() {
  const { settings, setMenuMode, updateSettings, toggleSidebarCollapse, toggleMainPageMaximize } = useLayoutStore()

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Layout Controls</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Adjust layout settings in real-time. Try different modes and configurations.
        </p>
      </div>

      {/* Menu Mode */}
      <div className="space-y-2">
        <Label>Menu Mode</Label>
        <Select
          value={settings.menu.mode}
          onValueChange={(value) => setMenuMode(value as MenuMode)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="side">Side (Main + Sub Sidebar)</SelectItem>
            <SelectItem value="head">Head (Header + Sub Sidebar)</SelectItem>
            <SelectItem value="single">Single (Sub Sidebar Only)</SelectItem>
            <SelectItem value="only-side">Only Side (Main Sidebar Only)</SelectItem>
            <SelectItem value="only-head">Only Head (Header Only)</SelectItem>
            <SelectItem value="side-panel">Side Panel</SelectItem>
            <SelectItem value="head-panel">Head Panel</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Current: <strong>{settings.menu.mode}</strong>
        </p>
      </div>

      {/* Dark Menu */}
      <div className="flex items-center justify-between">
        <Label>Dark Menu</Label>
        <Switch
          checked={settings.menu.dark}
          onCheckedChange={(checked) =>
            updateSettings({
              menu: { ...settings.menu, dark: checked },
            })
          }
        />
      </div>

      {/* Sub Menu Collapse */}
      <div className="flex items-center justify-between">
        <Label>Sub Menu Collapse</Label>
        <Switch
          checked={settings.menu.subMenuCollapse}
          onCheckedChange={toggleSidebarCollapse}
        />
      </div>

      {/* Auto Collapse */}
      <div className="flex items-center justify-between">
        <Label>Auto Collapse (Hover to Expand)</Label>
        <Switch
          checked={settings.menu.subMenuAutoCollapse}
          onCheckedChange={(checked) =>
            updateSettings({
              menu: { ...settings.menu, subMenuAutoCollapse: checked },
            })
          }
        />
      </div>

      {/* Topbar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Show Tabbar</Label>
          <Switch
            checked={settings.topbar.tabbar}
            onCheckedChange={(checked) =>
              updateSettings({
                topbar: { ...settings.topbar, tabbar: checked },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Toolbar</Label>
          <Switch
            checked={settings.topbar.toolbar}
            onCheckedChange={(checked) =>
              updateSettings({
                topbar: { ...settings.topbar, toolbar: checked },
              })
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 border-t pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={toggleMainPageMaximize}
        >
          Toggle Page Maximize (F11)
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={toggleSidebarCollapse}
        >
          Toggle Sidebar (Ctrl+B)
        </Button>
      </div>

      {/* Hotkeys Info */}
      <div className="space-y-2 border-t pt-4">
        <h4 className="text-sm font-semibold">Keyboard Shortcuts</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Toggle Sidebar</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5">Ctrl+B</kbd>
          </div>
          <div className="flex justify-between">
            <span>Toggle Maximize</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5">F11</kbd>
          </div>
          <div className="flex justify-between">
            <span>Next Menu</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5">Ctrl+Tab</kbd>
          </div>
          <div className="flex justify-between">
            <span>Previous Menu</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5">Ctrl+Shift+Tab</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stories
export const SideMode: Story = {
  render: () => (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Side Mode Layout</h1>
          <p className="mt-2 text-muted-foreground">
            Main sidebar (70px) + Sub sidebar (220px) on the left
          </p>
        </div>
        <LayoutControls />
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Page Content</h2>
          <p className="text-muted-foreground">
            This is the main content area. The layout automatically adjusts based on the selected mode.
          </p>
        </div>
      </div>
    </LayoutWrapper>
  ),
}

export const HeadMode: Story = {
  render: () => {
    const { setMenuMode } = useLayoutStore()

    React.useEffect(() => {
      setMenuMode('head')
    }, [setMenuMode])

    return (
      <LayoutWrapper>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Head Mode Layout</h1>
            <p className="mt-2 text-muted-foreground">
              Horizontal header navigation + Sub sidebar (220px)
            </p>
          </div>
          <LayoutControls />
        </div>
      </LayoutWrapper>
    )
  },
}

export const SingleMode: Story = {
  render: () => {
    const { setMenuMode } = useLayoutStore()

    React.useEffect(() => {
      setMenuMode('single')
    }, [setMenuMode])

    return (
      <LayoutWrapper>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Single Mode Layout</h1>
            <p className="mt-2 text-muted-foreground">
              Single sidebar (220px) only
            </p>
          </div>
          <LayoutControls />
        </div>
      </LayoutWrapper>
    )
  },
}

export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Responsive Layout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Resize the viewport to see mobile adaptation
          </p>
        </div>
        <LayoutControls />
      </div>
    </LayoutWrapper>
  ),
}
