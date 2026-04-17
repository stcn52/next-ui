import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/display/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/display/badge"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is the card content area.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Card Title")).toBeInTheDocument()
    await expect(canvas.getByText("Cancel")).toBeInTheDocument()
    await expect(canvas.getByText("Confirm")).toBeInTheDocument()
  },
}

export const WithBadge: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <div data-slot="card-action">
          <Badge variant="secondary">Beta</Badge>
        </div>
        <CardDescription>Current project overview.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Everything is running smoothly.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Small: Story = {
  render: () => (
    <Card className="w-72" size="sm">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>Compact size variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Compact content.</p>
      </CardContent>
    </Card>
  ),
}
