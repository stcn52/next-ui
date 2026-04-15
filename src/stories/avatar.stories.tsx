import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const avatar = canvas.getByRole("img", { name: /shadcn/i })
    await expect(avatar).toBeInTheDocument()
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm"><AvatarFallback>AB</AvatarFallback></Avatar>
      <Avatar size="default"><AvatarFallback>CY</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>XY</AvatarFallback></Avatar>
    </div>
  ),
}
