/**
 * Internationalization Guide — i18n setup, locale files, useTranslation hook documentation.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/display/separator"

const meta: Meta = {
  title: "Docs/Internationalization",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "国际化 (i18n) 文档 — 内置 zh-CN / en / ja-JP JSON locale 文件，ConfigProvider + useTranslation 轻量 i18n 方案。",
      },
    },
  },
}

export default meta
type Story = StoryObj

function I18nDoc() {
  const locales = [
    { code: "en", name: "English", path: "@chenyang/ui/locales/en.json" },
    { code: "zh-CN", name: "简体中文", path: "@chenyang/ui/locales/zh-CN.json" },
    { code: "ja-JP", name: "日本語", path: "@chenyang/ui/locales/ja-JP.json" },
  ]

  const sections = [
    "common",
    "pagination",
    "dataTable",
    "datePicker",
    "combobox",
    "command",
    "kanban",
    "settings",
    "dashboard",
    "auth",
    "error",
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">配置</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`import { ConfigProvider } from "@chenyang/ui"
import zhCN from "@chenyang/ui/locales/zh-CN.json"

<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>`}</pre>
      </div>

      <div>
        <h2 className="text-2xl font-bold">使用翻译</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`import { useTranslation } from "@chenyang/ui"

const { t } = useTranslation()
t("kanban.board")    // "看板"
t("common.loading")  // "加载中…"
t("auth.login")      // "登录"`}</pre>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-3">内置语言</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {locales.map((l) => (
            <Card key={l.code}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {l.name}
                  <Badge variant="outline" className="text-[10px]">{l.code}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-[11px] text-muted-foreground break-all">{l.path}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3">Locale 文件结构</h2>
        <p className="text-sm text-muted-foreground mb-2">
          每个 locale 文件按功能域划分为嵌套对象：
        </p>
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold">动态切换</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`const [locale, setLocale] = useState(zhCN)

<ConfigProvider locale={locale}>
  <select onChange={(e) =>
    setLocale(e.target.value === "en" ? en : zhCN)
  }>
    <option value="zh-CN">中文</option>
    <option value="en">English</option>
  </select>
  <App />
</ConfigProvider>`}</pre>
      </div>

      <div>
        <h2 className="text-2xl font-bold">自定义语言</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`const customLocale = {
  locale: "ko-KR",
  common: { loading: "로딩 중...", submit: "제출", ... },
  kanban: { board: "칸반", ... },
  // ...
}

<ConfigProvider locale={customLocale}>
  <App />
</ConfigProvider>`}</pre>
      </div>
    </div>
  )
}

export const Guide: Story = {
  name: "i18n Guide",
  render: () => <I18nDoc />,
}
