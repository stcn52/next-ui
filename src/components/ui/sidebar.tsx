"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/** Sidebar root container — animated width transitions */
function Sidebar({
  className,
  collapsed = false,
  onCollapsedChange,
  children,
  ...props
}: React.ComponentProps<"aside"> & {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}) {
  void onCollapsedChange

  return (
    <motion.aside
      data-slot="sidebar"
      data-collapsed={collapsed}
      aria-label="Sidebar"
      animate={{ width: collapsed ? 52 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground overflow-hidden",
        className,
      )}
      {...(props as React.ComponentProps<typeof motion.aside>)}
    >
      {children}
    </motion.aside>
  )
}

/** Sidebar header area — workspace switcher, search */
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-1 px-3 py-3", className)}
      {...props}
    />
  )
}

/** Sidebar main navigation content */
function SidebarContent({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto px-3 py-2", className)}
      {...props}
    />
  )
}

/** Sidebar navigation group with label */
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col gap-0.5 py-2", className)}
      {...props}
    />
  )
}

/** Group label */
function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider",
        className,
      )}
      {...props}
    />
  )
}

/** Individual navigation item */
function SidebarItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

/** Sidebar footer — user info, settings */
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto border-t px-3 py-3", className)}
      {...props}
    />
  )
}

const MemoizedSidebar = React.memo(Sidebar)
const MemoizedSidebarItem = React.memo(SidebarItem)

export {
  MemoizedSidebar as Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  MemoizedSidebarItem as SidebarItem,
  SidebarFooter,
}
