import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { CodeWorkspace, type CodeWorkspaceItem } from "@/components/ui/code-workspace"

const WORKSPACE_FILES: CodeWorkspaceItem[] = [
  {
    id: "public",
    name: "public",
    children: [
      { id: "favicon", name: "favicon.svg", content: "" },
      { id: "og", name: "og-image.png", content: "" },
    ],
  },
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "routes",
        name: "routes",
        children: [
          {
            id: "root",
            name: "__root.tsx",
            content: `import { createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: AppShell,
})

function AppShell() {
  return <div className="min-h-screen bg-background text-foreground" />
}`,
          },
          {
            id: "index",
            name: "index.tsx",
            content: `import { createFileRoute } from "@tanstack/react-router"
import { useForm, useTransform } from "@tanstack/react-form-start"
import { useStore } from "@tanstack/react-store"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return <main className="mx-auto max-w-4xl p-6" />
}`,
          },
        ],
      },
      {
        id: "utils",
        name: "utils",
        children: [
          { id: "form", name: "form.ts", content: "export const submitForm = async () => {}" },
          { id: "store", name: "store.ts", content: "export const store = new Map()" },
        ],
      },
    ],
  },
  {
    id: "package",
    name: "package.json",
    content: `{
  "name": "next-ui-demo",
  "private": true
}`,
    language: "json",
  },
]

const meta: Meta<typeof CodeWorkspace> = {
  title: "Patterns/Code Workspace",
  component: CodeWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof CodeWorkspace>

export const Default: Story = {
  render: () => {
    function Demo() {
      const [isFullscreen, setIsFullscreen] = useState(false)

      return (
        <div className={isFullscreen ? "h-screen p-0" : "h-[860px] p-4"}>
          <CodeWorkspace
            files={WORKSPACE_FILES}
            defaultActiveFileId="index"
            title="Code Explorer"
            subtitle="Interactive Sandbox"
            isFullscreen={isFullscreen}
            onBack={() => setIsFullscreen(false)}
            onToggleFullscreen={() => setIsFullscreen((current) => !current)}
          />
        </div>
      )
    }

    return <Demo />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Code Explorer")).toBeInTheDocument()
    await expect(canvas.getByText("Interactive Sandbox")).toBeInTheDocument()
    await expect(canvas.getByText("index.tsx")).toBeInTheDocument()
    await expect(canvas.getByLabelText("返回")).toBeInTheDocument()
    await expect(canvas.getByLabelText("进入全屏")).toBeInTheDocument()
    await userEvent.click(canvas.getByText("Interactive Sandbox"))
    await expect(canvas.getByText("Live Preview")).toBeInTheDocument()
    await userEvent.click(canvas.getByText("Code Explorer"))
    await expect(canvas.getByText("Files")).toBeInTheDocument()
  },
}
