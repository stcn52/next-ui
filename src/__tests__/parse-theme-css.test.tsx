import { describe, it, expect } from "vitest"
import { parseThemeCSS } from "@/components/theme-tokens"

describe("parseThemeCSS", () => {
  it("parses :root and .dark blocks", () => {
    const css = `
:root {
  --primary: oklch(0.55 0.25 265);
  --background: #fff;
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.65 0.22 265);
  --background: #111;
}
`
    const preset = parseThemeCSS(css, "test", "Test")
    expect(preset.name).toBe("test")
    expect(preset.light.primary).toBe("oklch(0.55 0.25 265)")
    expect(preset.light.background).toBe("#fff")
    expect(preset.light.radius).toBe("0.5rem")
    expect(preset.dark.primary).toBe("oklch(0.65 0.22 265)")
    expect(preset.dark.background).toBe("#111")
  })

  it("parses .light selector as light theme", () => {
    const css = `.light { --primary: oklch(0.5 0.2 300); }`
    const preset = parseThemeCSS(css)
    expect(preset.light.primary).toBe("oklch(0.5 0.2 300)")
  })

  it("falls back to raw declarations when no selectors found", () => {
    const css = `--primary: oklch(0.6 0.3 10); --ring: oklch(0.7 0.1 20);`
    const preset = parseThemeCSS(css)
    expect(preset.light.primary).toBe("oklch(0.6 0.3 10)")
    expect(preset.light.ring).toBe("oklch(0.7 0.1 20)")
    expect(Object.keys(preset.dark)).toHaveLength(0)
  })

  it("ignores unknown CSS properties", () => {
    const css = `:root { --primary: red; --unknown-prop: blue; --font-size: 16px; }`
    const preset = parseThemeCSS(css)
    expect(preset.light.primary).toBe("red")
    expect((preset.light as Record<string, string>)["unknown-prop"]).toBeUndefined()
  })

  it("handles all sidebar tokens", () => {
    const css = `:root {
  --sidebar: oklch(0.98 0 0);
  --sidebar-foreground: oklch(0.15 0 0);
  --sidebar-primary: oklch(0.55 0.25 265);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.95 0 0);
  --sidebar-accent-foreground: oklch(0.2 0 0);
  --sidebar-border: oklch(0.92 0 0);
  --sidebar-ring: oklch(0.55 0.25 265);
}`
    const preset = parseThemeCSS(css)
    expect(preset.light.sidebar).toBe("oklch(0.98 0 0)")
    expect(preset.light["sidebar-ring"]).toBe("oklch(0.55 0.25 265)")
  })

  it("handles chart tokens", () => {
    const css = `:root {
  --chart-1: oklch(0.6 0.2 40);
  --chart-2: oklch(0.5 0.1 180);
  --chart-3: oklch(0.4 0.07 230);
  --chart-4: oklch(0.8 0.2 80);
  --chart-5: oklch(0.7 0.2 70);
}`
    const preset = parseThemeCSS(css)
    expect(preset.light["chart-1"]).toBe("oklch(0.6 0.2 40)")
    expect(preset.light["chart-5"]).toBe("oklch(0.7 0.2 70)")
  })
})
