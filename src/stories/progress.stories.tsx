import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/display/progress"
import { useEffect, useState } from "react"

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 60 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("progressbar")).toBeInTheDocument()
  },
}

export const WithLabel: Story = {
  render: () => (
    <Progress value={75} className="w-80">
      <ProgressLabel>Uploading...</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Progress value={0}>
        <ProgressLabel>Not started</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={33}>
        <ProgressLabel>In progress</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={67}>
        <ProgressLabel>Almost done</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

function AnimatedProgress() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 5))
    }, 200)
    return () => clearInterval(timer)
  }, [])

  return (
    <Progress value={value} className="w-80">
      <ProgressLabel>Downloading...</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

export const Animated: Story = {
  render: () => <AnimatedProgress />,
}
