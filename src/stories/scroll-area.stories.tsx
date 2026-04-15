import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const meta: Meta = {
  title: "UI/ScrollArea",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

const tags = Array.from({ length: 50 }).map(
  (_, i) => `v1.${i}.0-beta`
)

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Tags")).toBeInTheDocument()
  },
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <figure key={i} className="shrink-0">
            <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-md border bg-muted">
              <span className="text-sm font-medium">Image {i + 1}</span>
            </div>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
