import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import {
  ConfigProvider,
  useConfig,
  builtinLocales,
} from "@/components/config-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Size } from "@/components/config-provider"

const meta: Meta = {
  title: "Config/ConfigProvider",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

function ConfigDemo() {
  const { size, locale, classPrefix } = useConfig()
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Current Config</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Size</span>
          <Badge variant="secondary">{size}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Locale</span>
          <Badge variant="secondary">{locale.locale}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class prefix</span>
          <Badge variant="outline">{classPrefix || "(none)"}</Badge>
        </div>
        <div className="mt-2 flex gap-2">
          <Button size="sm">{locale.confirm}</Button>
          <Button size="sm" variant="outline">
            {locale.cancel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const Default: Story = {
  render: () => (
    <ConfigProvider>
      <ConfigDemo />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Current Config")).toBeInTheDocument()
    await expect(canvas.getByText("Confirm")).toBeInTheDocument()
    await expect(canvas.getByText("Cancel")).toBeInTheDocument()
  },
}

export const ChineseLocale: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN" size="lg">
      <ConfigDemo />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("zh-CN")).toBeInTheDocument()
    await expect(canvas.getByText("确认")).toBeInTheDocument()
    await expect(canvas.getByText("取消")).toBeInTheDocument()
  },
}

export const Interactive: Story = {
  render: () => {
    const [size, setSize] = useState<Size>("md")
    const [locale, setLocale] = useState<string>("en")
    return (
      <ConfigProvider size={size} locale={locale}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Size:</span>
            {(["sm", "md", "lg"] as Size[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Locale:</span>
            {Object.keys(builtinLocales).map((l) => (
              <Button
                key={l}
                size="sm"
                variant={locale === l ? "default" : "outline"}
                onClick={() => setLocale(l)}
              >
                {l}
              </Button>
            ))}
          </div>
          <ConfigDemo />
        </div>
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to zh-CN
    await userEvent.click(canvas.getByText("zh-CN"))
    await expect(canvas.getByText("确认")).toBeInTheDocument()
    // Switch size to lg
    await userEvent.click(canvas.getByText("lg"))
    await expect(canvas.getByText("lg")).toBeInTheDocument()
  },
}
