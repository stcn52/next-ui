import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Slider } from "@/components/ui/slider"

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-[60%]",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("slider")).toBeInTheDocument()
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: "w-[60%]",
  },
}

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState([33])
    return (
      <div className="flex flex-col gap-2 w-[60%]">
        <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} max={100} step={1} />
        <p className="text-sm text-muted-foreground">Value: {value[0]}</p>
      </div>
    )
  },
}
