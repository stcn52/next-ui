import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  primaryColor?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  primaryColor: string | null
  setPrimaryColor: (color: string | null) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  primaryColor: null,
  setPrimaryColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  primaryColor: defaultPrimary,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [primaryColor, setPrimaryColorState] = useState<string | null>(
    () => localStorage.getItem(`${storageKey}-primary`) || defaultPrimary || null
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    if (primaryColor) {
      root.style.setProperty("--primary", primaryColor)
    } else {
      root.style.removeProperty("--primary")
    }
  }, [primaryColor])

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

  const value = {
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
  }

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
