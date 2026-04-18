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
const fixedFrom = new Date("2024-12-08T00:00:00")
const fixedTo = new Date("2024-12-15T00:00:00")

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
    const [range, setRange] = useState<DateRange | undefined>({ from: fixedFrom, to: fixedTo })
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
