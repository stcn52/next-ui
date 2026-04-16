/**
 * RangeSlider stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { RangeSlider } from "@/components/ui/range-slider"

const meta: Meta<typeof RangeSlider> = {
  title: "UI/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
  args: { min: 0, max: 100 },
  decorators: [(S) => <div className="p-8 max-w-sm"><S /></div>],
}
export default meta
type Story = StoryObj<typeof RangeSlider>

export const Default: Story = { args: { defaultValue: [20, 80] } }

export const PriceRange: Story = {
  args: {
    min: 0,
    max: 10000,
    step: 100,
    defaultValue: [1000, 6000],
    formatLabel: (v) => `¥${v.toLocaleString()}`,
  },
}

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState<[number, number]>([30, 70])
    return (
      <div className="space-y-3">
        <RangeSlider value={val} onChange={setVal} min={0} max={100} />
        <p className="text-sm text-muted-foreground">区间: {val[0]} – {val[1]}</p>
      </div>
    )
  },
}

export const Disabled: Story = { args: { defaultValue: [20, 60], disabled: true } }

export const SmallStep: Story = { args: { min: 0, max: 1, step: 0.1, defaultValue: [0.2, 0.8], formatLabel: (v) => v.toFixed(1) } }
