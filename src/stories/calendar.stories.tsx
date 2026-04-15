import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { Calendar } from "@/components/ui/calendar"

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("grid")).toBeInTheDocument()
    // Click a day button to select it
    const buttons = canvas.getAllByRole("gridcell")
    const clickable = buttons.find((b) => !b.hasAttribute("disabled") && !b.getAttribute("aria-disabled"))
    if (clickable) {
      await userEvent.click(clickable)
    }
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<{
      from: Date | undefined
      to?: Date | undefined
    }>({ from: new Date() })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={(r) => r && setRange(r)}
        numberOfMonths={2}
        className="rounded-md border"
      />
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[]>([new Date()])
    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={(d) => d && setDates(d)}
        className="rounded-md border"
      />
    )
  },
}
