import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info, AlertTriangle } from "lucide-react"

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <Info />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole("alert")
    await expect(alert).toBeInTheDocument()
    await expect(canvas.getByText("Heads up!")).toBeVisible()
  },
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}

export const NoIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        A simple alert without an icon.
      </AlertDescription>
    </Alert>
  ),
}
