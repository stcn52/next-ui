/**
 * DateTimePicker stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DateTimePicker } from "@/components/ui/date-time-picker"

const meta: Meta<typeof DateTimePicker> = {
  title: "UI/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  args: { placeholder: "选择日期与时间" },
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {}

export const WithDefault: Story = {
  args: { defaultValue: new Date("2024-12-08T14:30:00") },
}

export const Hour12: Story = {
  args: { hourCycle: 12, placeholder: "12 小时制" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: new Date("2024-12-08T09:00:00") },
}

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
      <div className="space-y-3">
        <DateTimePicker value={date} onChange={setDate} />
        <p className="text-sm text-muted-foreground">
          已选：{date ? date.toLocaleString("zh-CN") : "无"}
        </p>
      </div>
    )
  },
}
