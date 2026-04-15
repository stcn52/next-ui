/**
 * Theme token system for @chenyang/ui
 * Provides type-safe CSS variable tokens and preset color themes.
 */

/** All customizable CSS variable tokens (without -- prefix) */
export interface ThemeTokens {
  background?: string
  foreground?: string
  card?: string
  "card-foreground"?: string
  popover?: string
  "popover-foreground"?: string
  primary?: string
  "primary-foreground"?: string
  secondary?: string
  "secondary-foreground"?: string
  muted?: string
  "muted-foreground"?: string
  accent?: string
  "accent-foreground"?: string
  destructive?: string
  border?: string
  input?: string
  ring?: string
  radius?: string
  "chart-1"?: string
  "chart-2"?: string
  "chart-3"?: string
  "chart-4"?: string
  "chart-5"?: string
  sidebar?: string
  "sidebar-foreground"?: string
  "sidebar-primary"?: string
  "sidebar-primary-foreground"?: string
  "sidebar-accent"?: string
  "sidebar-accent-foreground"?: string
  "sidebar-border"?: string
  "sidebar-ring"?: string
}

export interface ThemePreset {
  name: string
  label: string
  light: ThemeTokens
  dark: ThemeTokens
}

// ─── Built-in Presets ────────────────────────────────────────────

export const presetDefault: ThemePreset = {
  name: "default",
  label: "Neutral",
  light: {
    primary: "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.708 0 0)",
  },
  dark: {
    primary: "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    ring: "oklch(0.556 0 0)",
  },
}

export const presetBlue: ThemePreset = {
  name: "blue",
  label: "Blue",
  light: {
    primary: "oklch(0.546 0.245 262.881)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.546 0.245 262.881)",
    "chart-1": "oklch(0.646 0.222 41.116)",
    "chart-2": "oklch(0.6 0.118 184.704)",
    "chart-3": "oklch(0.398 0.07 227.392)",
    "chart-4": "oklch(0.828 0.189 84.429)",
    "chart-5": "oklch(0.769 0.188 70.08)",
    "sidebar-primary": "oklch(0.546 0.245 262.881)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
  dark: {
    primary: "oklch(0.623 0.214 259.815)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.623 0.214 259.815)",
    "sidebar-primary": "oklch(0.623 0.214 259.815)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
}

export const presetGreen: ThemePreset = {
  name: "green",
  label: "Green",
  light: {
    primary: "oklch(0.531 0.176 142.495)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.531 0.176 142.495)",
    "sidebar-primary": "oklch(0.531 0.176 142.495)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
  dark: {
    primary: "oklch(0.627 0.194 149.214)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.627 0.194 149.214)",
    "sidebar-primary": "oklch(0.627 0.194 149.214)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
}

export const presetOrange: ThemePreset = {
  name: "orange",
  label: "Orange",
  light: {
    primary: "oklch(0.705 0.213 47.604)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.705 0.213 47.604)",
    "sidebar-primary": "oklch(0.705 0.213 47.604)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
  dark: {
    primary: "oklch(0.705 0.213 47.604)",
    "primary-foreground": "oklch(0.216 0 0)",
    ring: "oklch(0.705 0.213 47.604)",
    "sidebar-primary": "oklch(0.705 0.213 47.604)",
    "sidebar-primary-foreground": "oklch(0.216 0 0)",
  },
}

export const presetRose: ThemePreset = {
  name: "rose",
  label: "Rose",
  light: {
    primary: "oklch(0.585 0.233 3.958)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.585 0.233 3.958)",
    "sidebar-primary": "oklch(0.585 0.233 3.958)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
  dark: {
    primary: "oklch(0.645 0.246 16.439)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.645 0.246 16.439)",
    "sidebar-primary": "oklch(0.645 0.246 16.439)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
}

export const presetViolet: ThemePreset = {
  name: "violet",
  label: "Violet",
  light: {
    primary: "oklch(0.541 0.281 293.009)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.541 0.281 293.009)",
    "sidebar-primary": "oklch(0.541 0.281 293.009)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
  dark: {
    primary: "oklch(0.621 0.264 292.717)",
    "primary-foreground": "oklch(0.985 0 0)",
    ring: "oklch(0.621 0.264 292.717)",
    "sidebar-primary": "oklch(0.621 0.264 292.717)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
  },
}

/** All built-in theme presets */
export const themePresets: ThemePreset[] = [
  presetDefault,
  presetBlue,
  presetGreen,
  presetOrange,
  presetRose,
  presetViolet,
]

/**
 * Apply a set of tokens as CSS custom properties on a target element.
 * Passing `null` for a token value removes the override (restores CSS default).
 */
export function applyTokens(
  tokens: ThemeTokens,
  target: HTMLElement = document.documentElement
) {
  for (const [key, value] of Object.entries(tokens)) {
    if (value === null || value === undefined) {
      target.style.removeProperty(`--${key}`)
    } else {
      target.style.setProperty(`--${key}`, value)
    }
  }
}

/**
 * Remove all token overrides from the target element.
 */
export function clearTokens(
  tokens: ThemeTokens,
  target: HTMLElement = document.documentElement
) {
  for (const key of Object.keys(tokens)) {
    target.style.removeProperty(`--${key}`)
  }
}
