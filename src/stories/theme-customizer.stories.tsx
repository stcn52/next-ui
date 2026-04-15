import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  themePresets,
  type ThemePreset,
  type ThemeTokens,
  generateThemeFromColor,
} from "@/components/theme-tokens"

const meta: Meta = {
  title: "Theme/Customizer",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

/* ─── Preview components shared by all demos ────────────────── */

function PreviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <Progress value={66} />
        <Input placeholder="Sample input..." />
      </CardContent>
    </Card>
  )
}

/* ─── Full Customizer Demo ──────────────────────────────────── */

const RADIUS_OPTIONS = [
  { label: "0", value: "0" },
  { label: "0.3rem", value: "0.3rem" },
  { label: "0.5rem", value: "0.5rem" },
  { label: "0.75rem", value: "0.75rem" },
  { label: "1rem", value: "1rem" },
]

function ThemeCustomizerDemo() {
  const {
    theme,
    setTheme,
    applyPreset,
    activePreset,
    resetTokens,
    setTokens,
    radius,
    setRadius,
  } = useTheme()
  const [customColor, setCustomColor] = useState("")

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Theme Customizer</CardTitle>
          <CardDescription>
            Switch presets, radius, and custom tokens at runtime via CSS variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Mode */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Mode</p>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Color Preset</p>
            <div className="flex flex-wrap gap-2">
              {themePresets.map((p) => (
                <button
                  key={p.name}
                  data-testid={`preset-${p.name}`}
                  className="flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted/50"
                  style={{
                    borderColor: activePreset?.name === p.name ? "var(--primary)" : undefined,
                    borderWidth: activePreset?.name === p.name ? 2 : undefined,
                  }}
                  onClick={() => applyPreset(p)}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ background: p.light.primary }}
                  />
                  {p.label}
                </button>
              ))}
              <button
                className="h-8 rounded-md border px-3 text-xs font-medium hover:bg-muted/50"
                onClick={() => resetTokens()}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Radius */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Radius</p>
            <div className="flex flex-wrap gap-2">
              {RADIUS_OPTIONS.map((r) => (
                <Button
                  key={r.value}
                  variant={radius === r.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Token */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Custom Primary</p>
            <div className="flex items-center gap-2">
              <Input
                placeholder="oklch(0.6 0.25 270) or #8b5cf6"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (customColor) setTokens({ primary: customColor })
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PreviewCard />
    </div>
  )
}

export const Default: Story = {
  render: () => <ThemeCustomizerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Theme Customizer")).toBeInTheDocument()
    await expect(canvas.getByText("Preview")).toBeInTheDocument()

    // Click Blue preset
    const blueBtn = canvas.getByTestId("preset-blue")
    await userEvent.click(blueBtn)

    // Click a radius option
    const radiusBtn = canvas.getByText("0.75rem")
    await userEvent.click(radiusBtn)
  },
}

export const WithToggle: Story = {
  name: "Theme Toggle Widget",
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <span className="text-sm text-muted-foreground">
        Click the button to cycle through light / dark / system
      </span>
    </div>
  ),
}

/* ─── Preset Gallery ────────────────────────────────────────── */

function PresetGalleryItem({ preset }: { preset: ThemePreset }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey={`preset-${preset.name}`} preset={preset}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{preset.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="outline">Outline</Button>
          </div>
          <div className="flex gap-2">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <Progress value={60} />
        </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export const PresetGallery: Story = {
  name: "Preset Gallery",
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      {themePresets.map((p) => (
        <PresetGalleryItem key={p.name} preset={p} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Neutral")).toBeInTheDocument()
    await expect(canvas.getByText("Blue")).toBeInTheDocument()
    await expect(canvas.getByText("Rose")).toBeInTheDocument()
  },
}

/* ─── Programmatic Token Demo ───────────────────────────────── */

function TokenApiDemo() {
  const { setTokens, resetTokens } = useTheme()

  const applyWarm = () => {
    setTokens({
      background: "oklch(0.98 0.01 80)",
      foreground: "oklch(0.25 0.05 50)",
      card: "oklch(0.96 0.015 75)",
      "card-foreground": "oklch(0.25 0.05 50)",
      primary: "oklch(0.65 0.22 45)",
      "primary-foreground": "oklch(0.98 0 0)",
      muted: "oklch(0.94 0.02 80)",
      "muted-foreground": "oklch(0.5 0.04 60)",
    } satisfies ThemeTokens)
  }

  const applyCool = () => {
    setTokens({
      background: "oklch(0.98 0.01 240)",
      foreground: "oklch(0.2 0.03 260)",
      card: "oklch(0.96 0.015 240)",
      "card-foreground": "oklch(0.2 0.03 260)",
      primary: "oklch(0.55 0.25 265)",
      "primary-foreground": "oklch(0.98 0 0)",
      muted: "oklch(0.94 0.02 240)",
      "muted-foreground": "oklch(0.5 0.04 250)",
    } satisfies ThemeTokens)
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Programmatic Token API</CardTitle>
          <CardDescription>
            Use <code>setTokens()</code> and <code>resetTokens()</code> to change any CSS variable at runtime.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={applyWarm}>Warm Palette</Button>
          <Button onClick={applyCool} variant="secondary">
            Cool Palette
          </Button>
          <Button variant="outline" onClick={resetTokens}>
            Reset
          </Button>
        </CardContent>
      </Card>
      <PreviewCard />
    </div>
  )
}

export const TokenAPI: Story = {
  name: "Token API",
  render: () => <TokenApiDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Programmatic Token API")).toBeInTheDocument()
    const warmBtn = canvas.getByText("Warm Palette")
    await userEvent.click(warmBtn)
  },
}

/* ─── Dynamic Theme Generator ───────────────────────────────── */

const SAMPLE_BRAND_COLORS = [
  { label: "Indigo", value: "oklch(0.55 0.25 265)" },
  { label: "Teal", value: "oklch(0.60 0.15 180)" },
  { label: "Crimson", value: "oklch(0.55 0.24 15)" },
  { label: "Amber", value: "oklch(0.75 0.18 75)" },
  { label: "Emerald", value: "oklch(0.55 0.20 155)" },
  { label: "Fuchsia", value: "oklch(0.58 0.27 320)" },
]

function ThemeGeneratorDemo() {
  const { applyPreset, resetTokens, setTheme, theme } = useTheme()
  const [brandInput, setBrandInput] = useState("oklch(0.55 0.25 265)")
  const [error, setError] = useState<string | null>(null)
  const [generated, setGenerated] = useState<ThemePreset | null>(null)

  const handleGenerate = () => {
    try {
      const preset = generateThemeFromColor(brandInput, "generated", "Generated")
      setGenerated(preset)
      applyPreset(preset)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Theme Generator</CardTitle>
          <CardDescription>
            Enter a brand color in oklch format. The generator will compute a complete
            light &amp; dark token palette using oklch color math.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Mode Switch */}
          <div className="flex gap-2">
            {(["light", "dark"] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>

          {/* Quick picks */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Quick Pick</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_BRAND_COLORS.map((c) => (
                <button
                  key={c.label}
                  className="flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted/50"
                  onClick={() => {
                    setBrandInput(c.value)
                    const preset = generateThemeFromColor(c.value, c.label.toLowerCase(), c.label)
                    setGenerated(preset)
                    applyPreset(preset)
                    setError(null)
                  }}
                >
                  <span className="size-3 rounded-full" style={{ background: c.value }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual input */}
          <div className="flex items-center gap-2">
            <Input
              data-testid="brand-input"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="oklch(L C H)"
              className="text-sm font-mono"
            />
            <Button onClick={handleGenerate}>Generate</Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {generated && !error && (
            <p className="text-sm text-muted-foreground">
              Generated &quot;{generated.label}&quot; preset ({Object.keys(generated.light).length} light + {Object.keys(generated.dark).length} dark tokens)
            </p>
          )}
          <Button variant="outline" size="sm" onClick={() => { resetTokens(); setGenerated(null) }}>
            Reset to Default
          </Button>
        </CardContent>
      </Card>
      <PreviewCard />
    </div>
  )
}

export const ThemeGenerator: Story = {
  name: "Dynamic Generator",
  render: () => <ThemeGeneratorDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Dynamic Theme Generator")).toBeInTheDocument()

    // Click a quick pick color
    const tealBtn = canvas.getByText("Teal")
    await userEvent.click(tealBtn)

    // Verify generation feedback
    await expect(canvas.getByText(/Generated/)).toBeInTheDocument()
  },
}
