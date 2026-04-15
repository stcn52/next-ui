import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import type { ThemeTokens, ThemePreset } from "./theme-tokens"
import { applyTokens, clearTokens } from "./theme-tokens"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  /** @deprecated Use `tokens` instead */
  primaryColor?: string
  /** Default token overrides applied on mount */
  tokens?: ThemeTokens
  /** Apply a full preset (light + dark tokens auto-switch with theme) */
  preset?: ThemePreset
  /** Radius override, e.g. "0.5rem" */
  radius?: string
}

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  /** @deprecated Use setTokens instead */
  primaryColor: string | null
  /** @deprecated Use setTokens instead */
  setPrimaryColor: (color: string | null) => void
  /** Current token overrides */
  tokens: ThemeTokens
  /** Merge additional tokens at runtime */
  setTokens: (tokens: ThemeTokens) => void
  /** Reset all token overrides */
  resetTokens: () => void
  /** Apply a full preset */
  applyPreset: (preset: ThemePreset) => void
  /** The currently active preset (if any) */
  activePreset: ThemePreset | null
  /** Current resolved theme ("dark" | "light"), never "system" */
  resolvedTheme: "dark" | "light"
  /** Current radius override */
  radius: string | null
  /** Set radius override */
  setRadius: (radius: string | null) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  primaryColor: null,
  setPrimaryColor: () => null,
  tokens: {},
  setTokens: () => null,
  resetTokens: () => null,
  applyPreset: () => null,
  activePreset: null,
  resolvedTheme: "light",
  radius: null,
  setRadius: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function getResolvedTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return theme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  primaryColor: defaultPrimary,
  tokens: defaultTokens,
  preset: defaultPreset,
  radius: defaultRadius,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [primaryColor, setPrimaryColorState] = useState<string | null>(
    () => localStorage.getItem(`${storageKey}-primary`) || defaultPrimary || null
  )
  const [tokens, setTokensState] = useState<ThemeTokens>(() => defaultTokens ?? {})
  const [activePreset, setActivePreset] = useState<ThemePreset | null>(
    () => defaultPreset ?? null
  )
  const [radius, setRadiusState] = useState<string | null>(
    () => defaultRadius ?? null
  )

  const resolvedTheme = useMemo(() => getResolvedTheme(theme), [theme])

  // Apply dark/light class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  // Apply legacy primaryColor
  useEffect(() => {
    const root = window.document.documentElement
    if (primaryColor) {
      root.style.setProperty("--primary", primaryColor)
    } else {
      root.style.removeProperty("--primary")
    }
  }, [primaryColor])

  // Apply radius
  useEffect(() => {
    const root = window.document.documentElement
    if (radius) {
      root.style.setProperty("--radius", radius)
    } else {
      root.style.removeProperty("--radius")
    }
  }, [radius])

  // Apply tokens + preset tokens
  useEffect(() => {
    const root = window.document.documentElement
    const presetTokens = activePreset
      ? (resolvedTheme === "dark" ? activePreset.dark : activePreset.light)
      : {}
    const merged = { ...presetTokens, ...tokens }
    applyTokens(merged, root)
    return () => {
      clearTokens(merged, root)
    }
  }, [tokens, activePreset, resolvedTheme])

  const setTheme = useCallback(
    (t: Theme) => {
      localStorage.setItem(storageKey, t)
      setThemeState(t)
    },
    [storageKey]
  )

  const setPrimaryColor = useCallback(
    (color: string | null) => {
      if (color) {
        localStorage.setItem(`${storageKey}-primary`, color)
      } else {
        localStorage.removeItem(`${storageKey}-primary`)
      }
      setPrimaryColorState(color)
    },
    [storageKey]
  )

  const setTokens = useCallback((newTokens: ThemeTokens) => {
    setTokensState(prev => ({ ...prev, ...newTokens }))
  }, [])

  const resetTokens = useCallback(() => {
    setTokensState({})
    setActivePreset(null)
  }, [])

  const applyPresetFn = useCallback((preset: ThemePreset) => {
    setActivePreset(preset)
  }, [])

  const setRadius = useCallback((r: string | null) => {
    setRadiusState(r)
  }, [])

  const value: ThemeProviderState = useMemo(
    () => ({
      theme,
      setTheme,
      primaryColor,
      setPrimaryColor,
      tokens,
      setTokens,
      resetTokens,
      applyPreset: applyPresetFn,
      activePreset,
      resolvedTheme,
      radius,
      setRadius,
    }),
    [theme, setTheme, primaryColor, setPrimaryColor, tokens, setTokens, resetTokens, applyPresetFn, activePreset, resolvedTheme, radius, setRadius]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
