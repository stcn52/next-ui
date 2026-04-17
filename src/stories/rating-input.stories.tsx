/**
 * RatingInput — 星级评分，支持悬停预览、清除、只读、尺寸变体。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { RatingInput } from "@/components/ui/inputs/rating-input"
import { Label } from "@/components/ui/inputs/label"

const meta: Meta<typeof RatingInput> = {
  title: "UI/RatingInput",
  component: RatingInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "星级评分组件 — 支持悬停预览、点击清零、只读展示、5种及以上星数和 sm/md/lg 三种尺寸。",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof RatingInput>

export const Default: Story = {
  render: function Render() {
    const [rating, setRating] = useState(0)
    return (
      <div className="flex flex-col gap-1.5 items-center">
        <Label>你的评分</Label>
        <RatingInput value={rating} onChange={setRating} showValue />
        <p className="text-xs text-muted-foreground">
          {rating === 0 ? "点击星星评分" : `你选择了 ${rating} 星`}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const star3 = canvas.getByRole("radio", { name: "3 星" })
    await userEvent.click(star3)
    await expect(canvas.getByText("你选择了 3 星")).toBeInTheDocument()
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <span className="w-8 text-xs text-muted-foreground">sm</span>
        <RatingInput defaultValue={4} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-xs text-muted-foreground">md</span>
        <RatingInput defaultValue={4} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-xs text-muted-foreground">lg</span>
        <RatingInput defaultValue={4} size="lg" />
      </div>
    </div>
  ),
}

export const ReadOnly: Story = {
  name: "只读展示",
  render: () => (
    <div className="flex flex-col gap-3 items-center">
      <RatingInput value={5} readOnly size="lg" showValue />
      <RatingInput value={3} readOnly showValue />
      <RatingInput value={1} readOnly size="sm" showValue />
    </div>
  ),
}

export const TenStars: Story = {
  name: "10 星模式",
  render: function Render() {
    const [rating, setRating] = useState(7)
    return (
      <div className="flex flex-col gap-1.5 items-center">
        <RatingInput value={rating} onChange={setRating} max={10} size="sm" showValue />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => <RatingInput value={3} disabled showValue />,
}
