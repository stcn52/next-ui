import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

const meta: Meta = {
  title: "UI/Tooltip",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>
          <p>Tooltip content here</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Hover me")).toBeInTheDocument()
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon">
              <Info />
              <span className="sr-only">More info</span>
            </Button>
          }
        />
        <TooltipContent>
          <p>Click to learn more</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-16">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
          <TooltipContent side={side}>
            <p>Tooltip on {side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}
