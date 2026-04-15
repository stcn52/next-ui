import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: "Type your message here..." },
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
