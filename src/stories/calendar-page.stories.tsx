import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/date/calendar"
import { Badge } from "@/components/ui/display/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"

const meta: Meta = {
  title: "Pages/Calendar",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj

function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date("2026-04-16"))

  const events = [
    { id: 1, title: "版本发布评审", time: "10:00 - 11:00", level: "high" },
    { id: 2, title: "设计走查", time: "14:00 - 14:30", level: "medium" },
    { id: 3, title: "周会", time: "18:00 - 18:45", level: "low" },
  ]

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-3 p-4 md:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">团队日历</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {date ? `${format(date, "yyyy-MM-dd")} 日程` : "请选择日期"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{event.title}</p>
                <Badge variant={event.level === "high" ? "destructive" : event.level === "medium" ? "default" : "secondary"}>
                  {event.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export const Default: Story = {
  render: () => <CalendarPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("团队日历")).toBeInTheDocument()
    await expect(canvas.getByText("版本发布评审")).toBeInTheDocument()
  },
}
