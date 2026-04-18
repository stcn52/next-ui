/**
 * Slot system - inspired by Fantastic Admin Pro
 */
'use client'

import * as React from 'react'
import type { SlotName, SlotRegistry } from '@/types/layout'

const SlotContext = React.createContext<SlotRegistry>({})

export interface SlotProviderProps {
  children: React.ReactNode
  slots?: SlotRegistry
}

/**
 * Slot provider component
 * Provides slot registry to all child components
 */
export function SlotProvider({ children, slots = {} }: SlotProviderProps) {
  return <SlotContext.Provider value={slots}>{children}</SlotContext.Provider>
}

/**
 * Slot component
 * Renders the content registered for the given slot name
 */
export interface SlotProps {
  name: SlotName
  className?: string
}

export function Slot({ name, className }: SlotProps) {
  const slots = React.useContext(SlotContext)
  const content = slots[name]

  if (!content) {
    return null
  }

  return <div className={className}>{content}</div>
}

/**
 * Hook to access slot registry
 */
export function useSlots() {
  return React.useContext(SlotContext)
}

/**
 * Hook to check if a slot has content
 */
export function useHasSlot(name: SlotName) {
  const slots = React.useContext(SlotContext)
  return !!slots[name]
}
