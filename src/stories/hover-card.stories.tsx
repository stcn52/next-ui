import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/overlays/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/display/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"

const meta: Meta = {
  title: "UI/HoverCard",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-16">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link">@chenyang</Button>} />
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/stcn52.png" />
              <AvatarFallback>CY</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@chenyang</h4>
              <p className="text-sm text-muted-foreground">
                Building @chenyang/ui – a modern component library with
                shadcn/ui v3 and Base UI.
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Joined April 2025
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("@chenyang")).toBeInTheDocument()
  },
}
