/**
 * Mobile detection hook - inspired by Fantastic Admin Pro
 */
'use client'

import * as React from 'react'
import { useLayoutStore } from '@/store/layout'

/**
 * Mobile detection hook
 * Automatically updates layout mode based on screen size
 */
export function useMobileDetection() {
  const { setMode } = useLayoutStore()

  React.useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024 // lg breakpoint
      setMode(isMobile ? 'mobile' : 'pc')
    }

    // Initial check
    checkMobile()

    // Listen to resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMode])
}

/**
 * Touch device detection
 */
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-expect-error - msMaxTouchPoints is IE specific
          navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return isTouchDevice
}

/**
 * Screen orientation hook
 */
export function useScreenOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    'portrait'
  )

  React.useEffect(() => {
    const checkOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    checkOrientation()

    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  return orientation
}
