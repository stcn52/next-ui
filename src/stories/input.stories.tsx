import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input size variant (integrates with ConfigProvider)",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "Enter text..." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText("Enter text...")
    await userEvent.click(input)
    await userEvent.type(input, "Hello Storybook")
    await expect(input).toHaveValue("Hello Storybook")
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-64">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText("Disabled input")
    await expect(input).toBeDisabled()
  },
}

export const Invalid: Story = {
  args: { placeholder: "Invalid input", "aria-invalid": true },
}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search..." />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Input size="sm" placeholder="Small (24px)" />
      <Input size="md" placeholder="Medium (28px)" />
      <Input size="lg" placeholder="Large (40px)" />
    </div>
  ),
}
