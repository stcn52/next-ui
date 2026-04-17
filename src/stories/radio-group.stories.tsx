import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { RadioGroup, RadioGroupItem } from "@/components/ui/inputs/radio-group"
import { Label } from "@/components/ui/inputs/label"

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Option 1")).toBeInTheDocument()
    await expect(canvas.getByText("Option 2")).toBeInTheDocument()
    await expect(canvas.getByText("Option 3")).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="dr1" />
        <Label htmlFor="dr1">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="dr2" disabled />
        <Label htmlFor="dr2" className="opacity-50">Disabled</Label>
      </div>
    </RadioGroup>
  ),
}
