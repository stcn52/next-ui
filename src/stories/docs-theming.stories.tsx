/**
 * Theming Guide — ThemeProvider, presets, dynamic color generation documentation.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const meta: Meta = {
  title: "Docs/Theming",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "主题系统文档 — CSS 变量 Token、6 种预设色板、动态品牌色生成、暗黑模式切换。",
      },
    },
  },
}

export default meta
type Story = StoryObj

function ThemingDoc() {
  const presets = ["default", "blue", "green", "orange", "rose", "violet"]
  const tokens = [
    { name: "--background", desc: "页面背景" },
    { name: "--foreground", desc: "默认文本色" },
    { name: "--primary", desc: "主色（按钮、链接）" },
    { name: "--primary-foreground", desc: "主色上的文本" },
    { name: "--secondary", desc: "次要色" },
    { name: "--muted", desc: "禁用/辅助背景" },
    { name: "--accent", desc: "强调色" },
    { name: "--destructive", desc: "危险/删除" },
    { name: "--border", desc: "边框颜色" },
    { name: "--ring", desc: "聚焦环" },
    { name: "--radius", desc: "全局圆角" },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">ThemeProvider</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`import { ThemeProvider } from "@chenyang/ui"

<ThemeProvider preset="blue" radius={8}>
  <App />
</ThemeProvider>`}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Props</h3>
        <div className="rounded-lg border text-sm">
          <div className="grid grid-cols-4 gap-2 border-b bg-muted/50 px-3 py-2 font-medium">
            <span>Prop</span><span>Type</span><span>Default</span><span>说明</span>
          </div>
          {[
            ["preset", '"default" | "blue" | ...', '"default"', "预设色板"],
            ["radius", "number", "6", "全局圆角 (px)"],
            ["tokens", "Partial<ThemeTokens>", "—", "自定义 CSS 变量"],
          ].map(([prop, type, def, desc]) => (
            <div key={prop} className="grid grid-cols-4 gap-2 border-b px-3 py-2 last:border-0">
              <code className="text-xs">{prop}</code>
              <code className="text-xs text-muted-foreground">{type}</code>
              <code className="text-xs">{def}</code>
              <span className="text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">useTheme Hook</h3>
        <pre className="rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`const { setTokens, resetTokens, applyPreset, resolvedTheme } = useTheme()
applyPreset("rose")
setTokens({ "--primary": "oklch(0.6 0.2 250)" })
resetTokens()`}</pre>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-3">预设色板</h2>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Badge key={p} variant="outline">{p}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3">动态品牌色生成</h2>
        <pre className="rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`import { generateThemeFromColor } from "@chenyang/ui"
const tokens = generateThemeFromColor("#3b82f6")`}</pre>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-3">CSS 变量参考</h2>
        <div className="rounded-lg border text-sm">
          <div className="grid grid-cols-2 gap-2 border-b bg-muted/50 px-3 py-2 font-medium">
            <span>Token</span><span>用途</span>
          </div>
          {tokens.map((t) => (
            <div key={t.name} className="grid grid-cols-2 gap-2 border-b px-3 py-2 last:border-0">
              <code className="text-xs">{t.name}</code>
              <span className="text-xs">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Guide: Story = {
  name: "Theming Guide",
  render: () => <ThemingDoc />,
}
