import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { Textarea } from "@/components/ui/inputs/textarea"
import { Label } from "@/components/ui/inputs/label"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant (integrates with ConfigProvider)",
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: "Type your message here..." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText("Type your message here...")
    await expect(textarea).toBeInTheDocument()
    await userEvent.type(textarea, "Hello, World!")
    await expect(textarea).toHaveValue("Hello, World!")
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: "Disabled textarea", disabled: true },
}

export const Invalid: Story = {
  args: { placeholder: "Invalid textarea", "aria-invalid": true },
}
