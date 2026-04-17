import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Separator } from "@/components/ui/display/separator"

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 flex flex-col gap-3">
      <p className="text-sm">Above the separator</p>
      <Separator />
      <p className="text-sm">Below the separator</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Above the separator")).toBeInTheDocument()
    await expect(canvas.getByRole("separator")).toBeInTheDocument()
  },
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
}
