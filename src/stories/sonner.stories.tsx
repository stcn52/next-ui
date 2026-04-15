import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"

const meta: Meta = {
  title: "UI/Sonner (Toast)",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <Story />
        <Toaster />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast("Event has been created.")}>
      Show Toast
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Show Toast")).toBeInTheDocument()
  },
}

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("Profile updated successfully!")}>
      Success Toast
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button variant="destructive" onClick={() => toast.error("Something went wrong.")}>
      Error Toast
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning("Your storage is almost full.")}>
      Warning Toast
    </Button>
  ),
}

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.info("A new version is available.")}>
      Info Toast
    </Button>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => toast("Default toast")}>Default</Button>
      <Button size="sm" onClick={() => toast.success("Success!")}>Success</Button>
      <Button size="sm" onClick={() => toast.error("Error!")}>Error</Button>
      <Button size="sm" onClick={() => toast.warning("Warning!")}>Warning</Button>
      <Button size="sm" onClick={() => toast.info("Info!")}>Info</Button>
      <Button size="sm" variant="outline" onClick={() => toast.loading("Loading...")}>Loading</Button>
    </div>
  ),
}
