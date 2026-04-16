"use client"

import { createContext, useCallback, useContext, useMemo } from "react"
import {
  en as _en,
  zhCN as _zhCN,
  jaJP as _jaJP,
  flattenLocale,
  type NestedLocale,
} from "@/locales"

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

type Size = "sm" | "md" | "lg"

// ---------------------------------------------------------------------------
// Locale – flat i18n dictionary (all keys come from JSON files)
// ---------------------------------------------------------------------------

interface LocaleStrings {
  locale: string
  // Common
  noResults: string
  loading: string
  close: string
  search: string
  clear: string
  confirm: string
  cancel: string
  required: string
  optional: string
  submit: string
  reset: string
  // Pagination
  previous: string
  next: string
  goToPreviousPage: string
  goToNextPage: string
  page: string
  pageOf: string
  rowsPerPage: string
  // DataTable
  filter: string
  rowsSelected: string
  clickToEdit: string
  // DatePicker
  pickADate: string
  selectedDate: string
  // DateRangePicker
  pickDateRange: string
  pickStartDate: string
  pickEndDate: string
  // Combobox / Select
  selectOption: string
  // Command
  typeCommand: string
  // Kanban
  items: string
  // Allow custom keys
  [key: string]: string
}

// ---------------------------------------------------------------------------
// Built-in locales (sourced from JSON)
// ---------------------------------------------------------------------------

const defaultLocale: LocaleStrings = _en
const zhCN: LocaleStrings = _zhCN
const jaJP: LocaleStrings = _jaJP

const _builtinLocales: Record<string, LocaleStrings> = {
  en: defaultLocale,
  "zh-CN": zhCN,
  "ja-JP": jaJP,
}

// ---------------------------------------------------------------------------
// Locale registry – runtime registration / override
// ---------------------------------------------------------------------------

const _customLocales: Record<string, LocaleStrings> = {}

/**
 * Register a custom locale. Accepts either:
 *   - A flat `Partial<LocaleStrings>` object
 *   - A nested JSON-style `NestedLocale` object (same structure as locale files)
 *
 * Missing keys fall back to defaultLocale (English).
 */
function registerLocale(
  key: string,
  locale: Partial<LocaleStrings> | NestedLocale
) {
  // Detect nested structure: any value is an object
  const hasNested = Object.values(locale).some(
    (v) => typeof v === "object" && v !== null
  )
  const flat = hasNested
    ? flattenLocale(locale as NestedLocale)
    : filterUndefined(locale as Partial<LocaleStrings>)
  _customLocales[key] = { ...defaultLocale, ...flat, locale: key }
}

function filterUndefined(obj: Partial<LocaleStrings>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) result[k] = v
  }
  return result
}

/**
 * Resolve a locale key or partial object into a full LocaleStrings.
 */
function resolveLocale(locale: string | Partial<LocaleStrings>): LocaleStrings {
  if (typeof locale === "string") {
    return _customLocales[locale] ?? _builtinLocales[locale] ?? defaultLocale
  }
  return { ...defaultLocale, ...filterUndefined(locale) }
}

/**
 * Get all available locale keys (built-in + custom).
 */
function getAvailableLocales(): string[] {
  return [
    ...new Set([
      ...Object.keys(_builtinLocales),
      ...Object.keys(_customLocales),
    ]),
  ]
}

// Backward-compat proxy: iterating returns all locales including custom ones
const builtinLocales: Record<string, LocaleStrings> = new Proxy(
  _builtinLocales,
  {
    get(target, key: string) {
      return _customLocales[key] ?? target[key]
    },
    ownKeys() {
      return getAvailableLocales()
    },
    getOwnPropertyDescriptor(target, key: string) {
      if (_customLocales[key] || target[key]) {
        return {
          configurable: true,
          enumerable: true,
          value: _customLocales[key] ?? target[key],
        }
      }
      return undefined
    },
  }
)

// ---------------------------------------------------------------------------
// Template interpolation
// ---------------------------------------------------------------------------

/**
 * Replace `{key}` tokens in a template with provided values.
 *
 * @example
 *   formatMessage("{count} of {total} selected", { count: 2, total: 10 })
 *   // → "2 of 10 selected"
 */
function formatMessage(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => String(vars[key] ?? `{${key}}`)
  )
}

// ---------------------------------------------------------------------------
// Config context
// ---------------------------------------------------------------------------

interface ConfigContextValue {
  size: Size
  locale: LocaleStrings
  classPrefix: string
}

const ConfigContext = createContext<ConfigContextValue>({
  size: "md",
  locale: defaultLocale,
  classPrefix: "",
})

// ---------------------------------------------------------------------------
// ConfigProvider
// ---------------------------------------------------------------------------

interface ConfigProviderProps {
  children: React.ReactNode
  size?: Size
  /** Locale key ("en", "zh-CN", "ja-JP") or partial locale object */
  locale?: string | Partial<LocaleStrings>
  classPrefix?: string
}

/**
 * Global configuration provider for @chenyang/ui components.
 * Controls locale, size, and class prefix for all child components.
 *
 * @param size - Global size: \"sm\" | \"md\" | \"lg\" (default: \"md\")
 * @param locale - Locale key (\"en\", \"zh-CN\", \"ja-JP\") or partial LocaleStrings override
 * @param classPrefix - CSS class prefix for all components
 */
function ConfigProvider({
  children,
  size = "md",
  locale = "en",
  classPrefix = "",
}: ConfigProviderProps) {
  const resolvedLocale = useMemo<LocaleStrings>(
    () => resolveLocale(locale),
    [locale]
  )

  const value = useMemo<ConfigContextValue>(
    () => ({ size, locale: resolvedLocale, classPrefix }),
    [size, resolvedLocale, classPrefix]
  )

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useConfig() {
  return useContext(ConfigContext)
}

function useLocale() {
  return useContext(ConfigContext).locale
}

function useSize() {
  return useContext(ConfigContext).size
}

/**
 * Returns a `t()` function bound to the current locale.
 *
 * @example
 *   const t = useTranslation()
 *   t("rowsSelected", { count: 2, total: 10 })
 */
function useTranslation() {
  const locale = useLocale()
  return useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const template = locale[key] ?? key
      return vars ? formatMessage(template, vars) : template
    },
    [locale]
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  ConfigProvider,
  useConfig,
  useLocale,
  useSize,
  useTranslation,
  builtinLocales,
  defaultLocale,
  zhCN,
  jaJP,
  registerLocale,
  resolveLocale,
  getAvailableLocales,
  formatMessage,
  flattenLocale,
  type ConfigProviderProps,
  type ConfigContextValue,
  type LocaleStrings,
  type NestedLocale,
  type Size,
}
