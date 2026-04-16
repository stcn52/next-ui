/**
 * Theme Import — paste CSS from shadcnthemer.com or any shadcn theme editor,
 * preview it live, and copy the ThemePreset code.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  parseThemeCSS,
  applyTokens,
  clearTokens,
  themePresets,
  type ThemeTokens,
  type ThemePreset,
} from "@/components/theme-tokens"

const meta: Meta = {
  title: "Docs/Theme Import",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "从 shadcnthemer.com 导入主题 — 粘贴 CSS 即可预览并应用到所有组件。",
      },
    },
  },
}

export default meta
type Story = StoryObj

// Sample CSS from a shadcnthemer-style export (OKLCH)
const SAMPLE_THEME_CSS = `:root {
  --background: oklch(0.98 0.005 285);
  --foreground: oklch(0.15 0.02 285);
  --primary: oklch(0.55 0.25 285);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.95 0.02 285);
  --secondary-foreground: oklch(0.20 0.05 285);
  --muted: oklch(0.95 0.01 285);
  --muted-foreground: oklch(0.55 0.04 285);
  --accent: oklch(0.92 0.03 285);
  --accent-foreground: oklch(0.20 0.05 285);
  --destructive: oklch(0.58 0.25 27);
  --border: oklch(0.90 0.01 285);
  --input: oklch(0.90 0.01 285);
  --ring: oklch(0.55 0.25 285);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.15 0.02 285);
  --foreground: oklch(0.98 0 0);
  --primary: oklch(0.65 0.22 285);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.25 0.03 285);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.25 0.03 285);
  --muted-foreground: oklch(0.70 0.04 285);
  --accent: oklch(0.25 0.03 285);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.70 0.19 22);
  --border: oklch(0.30 0.02 285);
  --input: oklch(0.30 0.02 285);
  --ring: oklch(0.65 0.22 285);
}`

function TokenSwatchRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="size-6 rounded border"
        style={{ backgroundColor: value }}
      />
      <code className="text-xs text-muted-foreground w-40 truncate">
        --{label}
      </code>
      <span className="text-xs font-mono truncate">{value}</span>
    </div>
  )
}

function TokenPreview({ tokens, title }: { tokens: ThemeTokens; title: string }) {
  const entries = Object.entries(tokens).filter(([, v]) => v)
  if (entries.length === 0) return null
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="space-y-1">
        {entries.map(([key, value]) => (
          <TokenSwatchRow key={key} label={key} value={value} />
        ))}
      </div>
    </div>
  )
}

function ComponentPreview() {
  return (
    <div className="rounded-lg border bg-background p-4 space-y-3">
      <h4 className="font-semibold text-foreground">组件预览</h4>
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <Input placeholder="输入文本..." className="max-w-xs" />
      <Card className="max-w-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">卡片标题</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            这是一段卡片描述文字，用于预览主题效果。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ThemeImportPlayground() {
  const [css, setCss] = useState(SAMPLE_THEME_CSS)
  const [preset, setPreset] = useState<ThemePreset | null>(null)
  const [error, setError] = useState("")
  const [applied, setApplied] = useState(false)
  const prevTokensRef = useRef<ThemeTokens | null>(null)

  const handleParse = useCallback(() => {
    try {
      const parsed = parseThemeCSS(css, "imported", "Imported Theme")
      setPreset(parsed)
      setError("")
    } catch (e) {
      setError(String(e))
      setPreset(null)
    }
  }, [css])

  const handleApply = useCallback(() => {
    if (!preset) return
    const isDark = document.documentElement.classList.contains("dark")
    const tokens = isDark ? preset.dark : preset.light
    if (Object.keys(tokens).length === 0) return

    // Clear previous overrides
    if (prevTokensRef.current) {
      clearTokens(prevTokensRef.current)
    }
    applyTokens(tokens)
    prevTokensRef.current = tokens
    setApplied(true)
  }, [preset])

  const handleReset = useCallback(() => {
    if (prevTokensRef.current) {
      clearTokens(prevTokensRef.current)
      prevTokensRef.current = null
    }
    setApplied(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevTokensRef.current) {
        clearTokens(prevTokensRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">主题导入</h2>
        <p className="text-muted-foreground mt-1">
          从 <a href="https://shadcnthemer.com" target="_blank" rel="noopener noreferrer" className="underline text-primary">shadcnthemer.com</a> 或其他
          shadcn 主题编辑器复制 CSS，粘贴到下方即可预览和应用。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input panel */}
        <div className="space-y-3">
          <label className="text-sm font-medium">粘贴主题 CSS</label>
          <textarea
            className="w-full h-64 rounded-lg border bg-muted/50 px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder={`:root {\n  --primary: oklch(0.55 0.25 265);\n  ...\n}\n\n.dark {\n  --primary: oklch(0.65 0.22 265);\n  ...\n}`}
          />
          <div className="flex gap-2">
            <Button onClick={handleParse} size="sm">
              解析 CSS
            </Button>
            <Button onClick={handleApply} size="sm" variant="secondary" disabled={!preset}>
              应用到页面
            </Button>
            <Button onClick={handleReset} size="sm" variant="outline" disabled={!applied}>
              重置
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        {/* Preview panel */}
        <div className="space-y-3">
          <ComponentPreview />
        </div>
      </div>

      {/* Parsed tokens */}
      {preset && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TokenPreview tokens={preset.light} title="Light 模式" />
            <TokenPreview tokens={preset.dark} title="Dark 模式" />
          </div>

          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">代码输出</h3>
            <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono whitespace-pre overflow-auto max-h-60">
              {`import { parseThemeCSS } from "@stcn52/next-ui"\n\nconst preset = parseThemeCSS(\`\n${css}\n\`, "my-theme", "My Theme")\n\n// Use with ThemeProvider\n<ThemeProvider preset={preset}>\n  <App />\n</ThemeProvider>`}
            </pre>
          </div>
        </>
      )}

      <Separator />

      {/* Built-in presets quick reference */}
      <div>
        <h3 className="text-lg font-semibold mb-3">内置预设</h3>
        <div className="flex flex-wrap gap-2">
          {themePresets.map((p) => (
            <Badge
              key={p.name}
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setPreset(p)
                setCss(`/* Built-in preset: ${p.name} */`)
              }}
            >
              {p.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Playground: Story = {
  render: () => <ThemeImportPlayground />,
  parameters: {
    docs: {
      description: {
        story: "交互式主题导入 — 粘贴 CSS、解析、预览、应用。支持 shadcnthemer.com 导出格式。",
      },
    },
  },
}
