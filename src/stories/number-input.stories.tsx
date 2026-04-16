/**
 * NumberInput — 数字输入框，支持步进按钮、精度、范围限制、前缀/后缀。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof NumberInput> = {
  title: "UI/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "数字输入框 — 支持步进按钮、最大/最小值约束、小数精度控制、货币前缀和单位后缀。",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NumberInput>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<number | undefined>(0)
    return (
      <div className="flex flex-col gap-1.5 w-48">
        <Label>数量</Label>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={1}
        />
        <p className="text-xs text-muted-foreground">当前值：{value ?? "—"}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const incrementBtn = canvas.getByRole("button", { name: "增加" })
    await userEvent.click(incrementBtn)
    await expect(canvas.getByDisplayValue("1")).toBeInTheDocument()
  },
}

export const WithCurrencyPrefix: Story = {
  render: function Render() {
    const [value, setValue] = useState<number | undefined>(99.99)
    return (
      <div className="flex flex-col gap-1.5 w-48">
        <Label>价格</Label>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          step={0.01}
          precision={2}
          prefix="¥"
        />
      </div>
    )
  },
}

export const WithUnitSuffix: Story = {
  render: function Render() {
    const [value, setValue] = useState<number | undefined>(70)
    return (
      <div className="flex flex-col gap-1.5 w-48">
        <Label>重量</Label>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={500}
          step={0.5}
          precision={1}
          suffix="kg"
        />
      </div>
    )
  },
}

export const WithoutControls: Story = {
  render: function Render() {
    const [value, setValue] = useState<number | undefined>(42)
    return (
      <div className="flex flex-col gap-1.5 w-48">
        <Label>无按钮模式</Label>
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={999}
          showControls={false}
          placeholder="输入数字"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-48">
      <Label>禁用状态</Label>
      <NumberInput value={50} disabled />
    </div>
  ),
}

export const FormExample: Story = {
  name: "表单示例",
  render: function Render() {
    const [qty, setQty] = useState<number | undefined>(1)
    const [price, setPrice] = useState<number | undefined>(29.9)
    const total = ((qty ?? 0) * (price ?? 0)).toFixed(2)
    return (
      <div className="w-64 space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label>单价（元）</Label>
          <NumberInput
            value={price}
            onChange={setPrice}
            min={0}
            step={0.1}
            precision={2}
            prefix="¥"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>数量</Label>
          <NumberInput
            value={qty}
            onChange={setQty}
            min={1}
            max={999}
            step={1}
          />
        </div>
        <div className="rounded-lg bg-muted px-3 py-2 text-sm">
          合计：<span className="font-semibold">¥{total}</span>
        </div>
      </div>
    )
  },
}
