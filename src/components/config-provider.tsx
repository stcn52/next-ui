"use client"

import { createContext, useContext, useMemo } from "react"

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

type Size = "sm" | "md" | "lg"

// ---------------------------------------------------------------------------
// Locale – minimal i18n dictionary
// ---------------------------------------------------------------------------

interface LocaleStrings {
  locale: string
  noResults: string
  loading: string
  previous: string
  next: string
  close: string
  search: string
  clear: string
  confirm: string
  cancel: string
  [key: string]: string
}

const defaultLocale: LocaleStrings = {
  locale: "en",
  noResults: "No results.",
  loading: "Loading…",
  previous: "Previous",
  next: "Next",
  close: "Close",
  search: "Search…",
  clear: "Clear",
  confirm: "Confirm",
  cancel: "Cancel",
}

const zhCN: LocaleStrings = {
  locale: "zh-CN",
  noResults: "没有结果。",
  loading: "加载中…",
  previous: "上一页",
  next: "下一页",
  close: "关闭",
  search: "搜索…",
  clear: "清除",
  confirm: "确认",
  cancel: "取消",
}

const builtinLocales: Record<string, LocaleStrings> = {
  en: defaultLocale,
  "zh-CN": zhCN,
}

// ---------------------------------------------------------------------------
// Config context
// ---------------------------------------------------------------------------

interface ConfigContextValue {
  /** Component default size */
  size: Size
  /** Active locale strings */
  locale: LocaleStrings
  /** CSS class prefix – e.g. "cui" → "cui-button" */
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
  /** Default component size */
  size?: Size
  /** Locale key ("en", "zh-CN") or full locale object */
  locale?: string | LocaleStrings
  /** Optional CSS class prefix */
  classPrefix?: string
}

function ConfigProvider({
  children,
  size = "md",
  locale = "en",
  classPrefix = "",
}: ConfigProviderProps) {
  const resolvedLocale = useMemo<LocaleStrings>(() => {
    if (typeof locale === "string") {
      return builtinLocales[locale] ?? defaultLocale
    }
    return { ...defaultLocale, ...locale }
  }, [locale])

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

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  ConfigProvider,
  useConfig,
  useLocale,
  useSize,
  builtinLocales,
  defaultLocale,
  zhCN,
  type ConfigProviderProps,
  type ConfigContextValue,
  type LocaleStrings,
  type Size,
}
