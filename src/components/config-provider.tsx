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
  // Common
  noResults: string
  loading: string
  previous: string
  next: string
  close: string
  search: string
  clear: string
  confirm: string
  cancel: string
  // DataTable / Pagination
  filter: string
  rowsSelected: string
  goToPreviousPage: string
  goToNextPage: string
  // DatePicker
  pickADate: string
  selectedDate: string
  // Combobox
  selectOption: string
  // Editable
  clickToEdit: string
  // Command
  typeCommand: string
  // Kanban
  items: string
  // Allow custom keys
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
  filter: "Filter...",
  rowsSelected: "{count} of {total} row(s) selected.",
  goToPreviousPage: "Go to previous page",
  goToNextPage: "Go to next page",
  pickADate: "Pick a date",
  selectedDate: "Selected date: {date}",
  selectOption: "Select option...",
  clickToEdit: "Click to edit",
  typeCommand: "Type a command or search...",
  items: "items",
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
  filter: "筛选…",
  rowsSelected: "已选择 {count} / {total} 行。",
  goToPreviousPage: "前往上一页",
  goToNextPage: "前往下一页",
  pickADate: "选择日期",
  selectedDate: "已选日期：{date}",
  selectOption: "请选择…",
  clickToEdit: "点击编辑",
  typeCommand: "输入命令或搜索…",
  items: "项",
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
