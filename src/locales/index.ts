import type { LocaleStrings } from "../components/config-provider"
import enData from "./en.json"
import zhCNData from "./zh-CN.json"
import jaJPData from "./ja-JP.json"

// ---------------------------------------------------------------------------
// Flatten nested JSON locale → flat LocaleStrings
// ---------------------------------------------------------------------------

type NestedLocale = Record<string, string | Record<string, string>>

function flattenLocale(data: NestedLocale): LocaleStrings {
  const flat: Record<string, string> = {}
  for (const [section, value] of Object.entries(data)) {
    if (typeof value === "string") {
      flat[section] = value
    } else {
      for (const [key, str] of Object.entries(value)) {
        flat[key] = str
      }
    }
  }
  return flat as LocaleStrings
}

// ---------------------------------------------------------------------------
// Pre-built flat locales
// ---------------------------------------------------------------------------

const en = flattenLocale(enData as unknown as NestedLocale)
const zhCN = flattenLocale(zhCNData as unknown as NestedLocale)
const jaJP = flattenLocale(jaJPData as unknown as NestedLocale)

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { en, zhCN, jaJP, flattenLocale }
export type { NestedLocale }
