import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { DatePicker } from "@/components/ui/date/date-picker"

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return <DatePicker date={date} onDateChange={setDate} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button")).toBeInTheDocument()
  },
}

export const WithPreselectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <DatePicker date={date} onDateChange={setDate} />
  },
}

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="Select your birthday"
        className="w-[280px]"
      />
    )
  },
}
