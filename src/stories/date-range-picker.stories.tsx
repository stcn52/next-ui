import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { DateRangePicker } from "@/components/ui/date/date-range-picker"
import type { DateRange } from "@/components/ui/date/date-range-picker"

const meta: Meta<typeof DateRangePicker> = {
  title: "UI/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return <DateRangePicker dateRange={range} onDateRangeChange={setRange} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button")).toBeInTheDocument()
  },
}

export const WithPreselectedRange: Story = {
  render: () => {
    const from = new Date()
    const to = new Date(from)
    to.setDate(to.getDate() + 7)
    const [range, setRange] = useState<DateRange | undefined>({ from, to })
    return <DateRangePicker dateRange={range} onDateRangeChange={setRange} />
  },
}

export const SingleMonth: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <DateRangePicker
        dateRange={range}
        onDateRangeChange={setRange}
        numberOfMonths={1}
        className="w-[240px]"
      />
    )
  },
}

export const CustomPlaceholder: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <DateRangePicker
        dateRange={range}
        onDateRangeChange={setRange}
        placeholder="旅行日期"
        className="w-[280px]"
      />
    )
  },
}
