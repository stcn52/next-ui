import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

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

const PRESET_COLORS: Record<string, string> = {
  Default: "oklch(0.205 0 0)",
  Blue: "oklch(0.546 0.245 262.881)",
  Green: "oklch(0.627 0.194 149.214)",
  Rose: "oklch(0.645 0.246 16.439)",
  Orange: "oklch(0.705 0.213 47.604)",
  Violet: "oklch(0.606 0.25 292.717)",
}

function ThemeCustomizerDemo() {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme()
  const [customColor, setCustomColor] = useState("")

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Theme Customizer</CardTitle>
          <CardDescription>
            Choose a theme mode and brand color to preview components.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Brand Color</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRESET_COLORS).map(([name, value]) => (
                <button
                  key={name}
                  className="flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted/50"
                  style={{
                    borderColor: primaryColor === value ? "var(--primary)" : undefined,
                    borderWidth: primaryColor === value ? 2 : undefined,
                  }}
                  onClick={() =>
                    setPrimaryColor(primaryColor === value ? null : value)
                  }
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ background: value }}
                  />
                  {name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Input
                placeholder="Custom oklch value..."
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (customColor) setPrimaryColor(customColor)
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="flex gap-2">
            <Input placeholder="Sample input..." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Default: Story = {
  render: () => <ThemeCustomizerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Theme Customizer")).toBeInTheDocument()
    await expect(canvas.getByText("Preview")).toBeInTheDocument()
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
