import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const meta: Meta = {
  title: "UI/Resizable",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("One")).toBeInTheDocument()
    await expect(canvas.getByText("Two")).toBeInTheDocument()
  },
}

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const WithHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const ThreePanel: Story = {
  name: "Three Panels",
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] max-w-lg rounded-lg border"
    >
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Nav</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Main</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Detail</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
