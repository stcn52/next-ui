import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchEl = canvas.getByRole("switch")
    await expect(switchEl).not.toBeChecked()
    await userEvent.click(switchEl)
    await expect(switchEl).toBeChecked()
  },
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane Mode</Label>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sm" size="sm" defaultChecked />
        <Label htmlFor="sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="md" size="default" defaultChecked />
        <Label htmlFor="md">Default</Label>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
