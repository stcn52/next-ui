"use client"

import { createContext, useCallback, useContext, useMemo } from "react"

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
  page: string
  pageOf: string
  rowsPerPage: string
  // DatePicker
  pickADate: string
  selectedDate: string
  // Combobox / Select
  selectOption: string
  // Editable
  clickToEdit: string
  // Command
  typeCommand: string
  // Kanban
  items: string
  // Form
  required: string
  optional: string
  submit: string
  reset: string
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
  page: "Page",
  pageOf: "Page {page} of {total}",
  rowsPerPage: "Rows per page",
  pickADate: "Pick a date",
  selectedDate: "Selected date: {date}",
  selectOption: "Select option...",
  clickToEdit: "Click to edit",
  typeCommand: "Type a command or search...",
  items: "items",
  required: "Required",
  optional: "Optional",
  submit: "Submit",
  reset: "Reset",
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
  page: "页",
  pageOf: "第 {page} / {total} 页",
  rowsPerPage: "每页行数",
  pickADate: "选择日期",
  selectedDate: "已选日期：{date}",
  selectOption: "请选择…",
  clickToEdit: "点击编辑",
  typeCommand: "输入命令或搜索…",
  items: "项",
  required: "必填",
  optional: "可选",
  submit: "提交",
  reset: "重置",
}

/** Japanese locale */
const jaJP: LocaleStrings = {
  locale: "ja-JP",
  noResults: "結果がありません。",
  loading: "読み込み中…",
  previous: "前へ",
  next: "次へ",
  close: "閉じる",
  search: "検索…",
  clear: "クリア",
  confirm: "確認",
  cancel: "キャンセル",
  filter: "フィルター…",
  rowsSelected: "{total}行中{count}行を選択中。",
  goToPreviousPage: "前のページへ",
  goToNextPage: "次のページへ",
  page: "ページ",
  pageOf: "{page} / {total} ページ",
  rowsPerPage: "1ページの行数",
  pickADate: "日付を選択",
  selectedDate: "選択した日付：{date}",
  selectOption: "選択してください…",
  clickToEdit: "クリックして編集",
  typeCommand: "コマンドまたは検索を入力…",
  items: "件",
  required: "必須",
  optional: "任意",
  submit: "送信",
  reset: "リセット",
}

const _builtinLocales: Record<string, LocaleStrings> = {
  en: defaultLocale,
  "zh-CN": zhCN,
  "ja-JP": jaJP,
}

// ---------------------------------------------------------------------------
// Locale registry – allows consumers to register/override locales at runtime
// ---------------------------------------------------------------------------

const _customLocales: Record<string, LocaleStrings> = {}

/**
 * Register a custom locale or override a built-in one.
 * Partial objects are merged with `defaultLocale` to ensure completeness.
 */
function registerLocale(key: string, locale: Partial<LocaleStrings>) {
  const overrides: Record<string, string> = {}
  for (const [k, v] of Object.entries(locale)) {
    if (v !== undefined) overrides[k] = v
  }
  _customLocales[key] = { ...defaultLocale, ...overrides, locale: key }
}

/**
 * Resolve a locale key or object. Checks custom locales first, then built-in.
 */
function resolveLocale(locale: string | Partial<LocaleStrings>): LocaleStrings {
  if (typeof locale === "string") {
    return _customLocales[locale] ?? _builtinLocales[locale] ?? defaultLocale
  }
  // Filter out undefined values before merging
  const overrides: Record<string, string> = {}
  for (const [k, v] of Object.entries(locale)) {
    if (v !== undefined) overrides[k] = v
  }
  return { ...defaultLocale, ...overrides }
}

/**
 * Get all registered locale keys (built-in + custom).
 */
function getAvailableLocales(): string[] {
  return [
    ...new Set([
      ...Object.keys(_builtinLocales),
      ...Object.keys(_customLocales),
    ]),
  ]
}

// Kept for backward compat — now includes custom locales
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
        return { configurable: true, enumerable: true, value: _customLocales[key] ?? target[key] }
      }
      return undefined
    },
  }
)

// ---------------------------------------------------------------------------
// Template interpolation
// ---------------------------------------------------------------------------

/**
 * Interpolate a template string by replacing `{key}` tokens with values.
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
  /** Locale key ("en", "zh-CN", "ja-JP") or full/partial locale object */
  locale?: string | Partial<LocaleStrings>
  /** Optional CSS class prefix */
  classPrefix?: string
}

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
 * Returns a `t()` function that interpolates locale templates.
 *
 * @example
 *   const t = useTranslation()
 *   t("rowsSelected", { count: 2, total: 10 })
 *   // uses the current locale's "rowsSelected" template → "2 of 10 row(s) selected."
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
  type ConfigProviderProps,
  type ConfigContextValue,
  type LocaleStrings,
  type Size,
}
