import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Skeleton } from "@/components/ui/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: { className: "h-4 w-48" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("status")).toBeInTheDocument()
  },
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72 p-4 rounded-xl border">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  ),
}

export const AvatarSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
}
