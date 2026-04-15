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

// ─── Dynamic Theme Generator ────────────────────────────────────

/** Parsed oklch color channels */
export interface OklchColor {
  l: number // lightness 0..1
  c: number // chroma 0..~0.4
  h: number // hue 0..360
}

/** Parse an `oklch(L C H)` string. Returns null if not valid. */
export function parseOklch(color: string): OklchColor | null {
  const m = color.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!m) return null
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) }
}

/** Format an OklchColor back to CSS string */
export function formatOklch(color: OklchColor): string {
  return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(3)})`
}

/**
 * Generate a complete ThemePreset from a single brand color (oklch string).
 * Automatically derives all light/dark tokens using oklch color math.
 *
 * @param brandColor - An oklch CSS color string, e.g. "oklch(0.55 0.25 265)"
 * @param name - Preset name (used as identifier)
 * @param label - Human-readable label
 * @returns A full ThemePreset with light and dark token sets
 */
export function generateThemeFromColor(
  brandColor: string,
  name = "custom",
  label = "Custom",
): ThemePreset {
  const parsed = parseOklch(brandColor)
  if (!parsed) {
    throw new Error(`Invalid oklch color: "${brandColor}". Expected format: oklch(L C H)`)
  }

  const { c, h } = parsed

  // ─── Light theme tokens ─────────────────────────
  const light: ThemeTokens = {
    background: "oklch(1 0 0)",
    foreground: formatOklch({ l: 0.145, c: c * 0.05, h }),
    card: "oklch(1 0 0)",
    "card-foreground": formatOklch({ l: 0.145, c: c * 0.05, h }),
    popover: "oklch(1 0 0)",
    "popover-foreground": formatOklch({ l: 0.145, c: c * 0.05, h }),
    primary: brandColor,
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: formatOklch({ l: 0.97, c: c * 0.03, h }),
    "secondary-foreground": formatOklch({ l: 0.205, c: c * 0.1, h }),
    muted: formatOklch({ l: 0.97, c: c * 0.03, h }),
    "muted-foreground": formatOklch({ l: 0.556, c: c * 0.08, h }),
    accent: formatOklch({ l: 0.97, c: c * 0.03, h }),
    "accent-foreground": formatOklch({ l: 0.205, c: c * 0.1, h }),
    destructive: "oklch(0.577 0.245 27.325)",
    border: formatOklch({ l: 0.922, c: c * 0.02, h }),
    input: formatOklch({ l: 0.922, c: c * 0.02, h }),
    ring: brandColor,
    "chart-1": formatOklch({ l: 0.646, c: c * 0.9, h: (h + 140) % 360 }),
    "chart-2": formatOklch({ l: 0.6, c: c * 0.5, h: (h + 80) % 360 }),
    "chart-3": formatOklch({ l: 0.398, c: c * 0.3, h: (h + 200) % 360 }),
    "chart-4": formatOklch({ l: 0.828, c: c * 0.8, h: (h + 50) % 360 }),
    "chart-5": formatOklch({ l: 0.769, c: c * 0.75, h: (h + 30) % 360 }),
    sidebar: formatOklch({ l: 0.985, c: c * 0.01, h }),
    "sidebar-foreground": formatOklch({ l: 0.145, c: c * 0.05, h }),
    "sidebar-primary": brandColor,
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": formatOklch({ l: 0.97, c: c * 0.03, h }),
    "sidebar-accent-foreground": formatOklch({ l: 0.205, c: c * 0.1, h }),
    "sidebar-border": formatOklch({ l: 0.922, c: c * 0.02, h }),
    "sidebar-ring": brandColor,
  }

  // ─── Dark theme tokens ──────────────────────────
  // Bump lightness for dark-mode primary
  const darkPrimaryL = Math.min(parsed.l + 0.1, 0.75)
  const darkPrimary = formatOklch({ l: darkPrimaryL, c: c * 0.85, h })

  const dark: ThemeTokens = {
    background: formatOklch({ l: 0.145, c: c * 0.02, h }),
    foreground: "oklch(0.985 0 0)",
    card: formatOklch({ l: 0.205, c: c * 0.03, h }),
    "card-foreground": "oklch(0.985 0 0)",
    popover: formatOklch({ l: 0.205, c: c * 0.03, h }),
    "popover-foreground": "oklch(0.985 0 0)",
    primary: darkPrimary,
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: formatOklch({ l: 0.269, c: c * 0.04, h }),
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: formatOklch({ l: 0.269, c: c * 0.04, h }),
    "muted-foreground": formatOklch({ l: 0.708, c: c * 0.05, h }),
    accent: formatOklch({ l: 0.269, c: c * 0.04, h }),
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: formatOklch({ l: 0.3, c: c * 0.03, h }),
    input: formatOklch({ l: 0.3, c: c * 0.03, h }),
    ring: darkPrimary,
    "chart-1": formatOklch({ l: 0.87, c: c * 0.5, h: (h + 140) % 360 }),
    "chart-2": formatOklch({ l: 0.556, c: c * 0.4, h: (h + 80) % 360 }),
    "chart-3": formatOklch({ l: 0.439, c: c * 0.3, h: (h + 200) % 360 }),
    "chart-4": formatOklch({ l: 0.371, c: c * 0.2, h: (h + 50) % 360 }),
    "chart-5": formatOklch({ l: 0.269, c: c * 0.15, h: (h + 30) % 360 }),
    sidebar: formatOklch({ l: 0.205, c: c * 0.03, h }),
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": darkPrimary,
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": formatOklch({ l: 0.269, c: c * 0.04, h }),
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": formatOklch({ l: 0.3, c: c * 0.03, h }),
    "sidebar-ring": darkPrimary,
  }

  return { name, label, light, dark }
}
