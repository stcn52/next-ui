/**
 * ColorPicker — HSL 颜色选择器 stories
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ColorPicker } from "@/components/ui/color-picker"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const meta: Meta<typeof ColorPicker> = {
  title: "UI/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "HSL 颜色选择器 — 通过色调/饱和度/亮度三轴滑块精细控制颜色，支持 Hex 直接输入和预设色板。",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  render: function Render() {
    const [color, setColor] = useState("#3b82f6")
    return (
      <div className="flex flex-col gap-3 items-start">
        <Label>主题色</Label>
        <ColorPicker value={color} onChange={setColor} />
        <p className="text-xs text-muted-foreground">当前选色: {color.toUpperCase()}</p>
        <div
          className="mt-2 h-16 w-64 rounded-xl border"
          style={{ backgroundColor: color }}
        />
      </div>
    )
  },
}

export const NoPresets: Story = {
  name: "无预设色板",
  render: function Render() {
    const [color, setColor] = useState("#ef4444")
    return (
      <div className="flex flex-col gap-3 items-start">
        <Label>警告色</Label>
        <ColorPicker value={color} onChange={setColor} showPresets={false} />
      </div>
    )
  },
}

export const ThemeBuilder: Story = {
  name: "主题色配置演示",
  render: function Render() {
    const [primary, setPrimary] = useState("#3b82f6")
    const [accent, setAccent] = useState("#8b5cf6")
    const [success, setSuccess] = useState("#22c55e")
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-base">主题配色</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "主色", color: primary, set: setPrimary },
            { label: "强调色", color: accent, set: setAccent },
            { label: "成功色", color: success, set: setSuccess },
          ].map(({ label, color, set }) => (
            <div key={label} className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <ColorPicker value={color} onChange={set} showPresets={false} />
            </div>
          ))}
          <div className="mt-2 rounded-xl overflow-hidden h-10 flex">
            <div style={{ flex: 1, backgroundColor: primary }} />
            <div style={{ flex: 1, backgroundColor: accent }} />
            <div style={{ flex: 1, backgroundColor: success }} />
          </div>
        </CardContent>
      </Card>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      <Label>禁用状态</Label>
      <ColorPicker value="#6b7280" disabled />
    </div>
  ),
}
