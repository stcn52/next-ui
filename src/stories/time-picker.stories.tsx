/**
 * TimePicker stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { TimePicker } from "@/components/ui/date/time-picker"

const meta: Meta<typeof TimePicker> = {
  title: "UI/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {}
export const WithDefault: Story = { args: { defaultValue: "14:30" } }
export const Hour12: Story = { args: { hourCycle: 12, defaultValue: "09:00" } }
export const Disabled: Story = { args: { disabled: true, defaultValue: "08:00" } }
export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState("10:00")
    return (
      <div className="space-y-2">
        <TimePicker value={val} onChange={setVal} />
        <p className="text-sm text-muted-foreground">当前值：{val}</p>
      </div>
    )
  },
}
