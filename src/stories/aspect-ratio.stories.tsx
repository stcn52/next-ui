import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { AspectRatio } from "@/components/ui/display/aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByAltText("Photo by Drew Beamer")).toBeInTheDocument()
  },
}

export const Square: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={1} className="rounded-xl overflow-hidden bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold text-2xl">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Ratios: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[
        { ratio: 16 / 9, label: "16:9" },
        { ratio: 4 / 3, label: "4:3" },
        { ratio: 1, label: "1:1" },
        { ratio: 21 / 9, label: "21:9" },
      ].map(({ ratio, label }) => (
        <div key={label} className="w-48">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <AspectRatio ratio={ratio} className="rounded-md overflow-hidden bg-muted">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
              {label}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}
