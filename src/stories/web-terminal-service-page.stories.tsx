/**
 * Web Terminal Service Page — compact browser SSH terminal with bastion recording.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { WebTerminalServicePage } from "@/components/pages/web-terminal-service-page"

const meta: Meta = {
  title: "Pages/Web Terminal",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Web Terminal 示例页，展示浏览器内 SSH 终端、XTerm 终端窗口、堡垒机录屏和命令审计，适合运维平台和安全审计场景。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <WebTerminalServicePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Web Terminal 服务")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索主机、用户、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /支付 API 终端/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "录屏" }))
    await expect(canvas.getByText("录屏片段")).toBeInTheDocument()
  },
}
