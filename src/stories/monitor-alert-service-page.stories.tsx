/**
 * Monitor & Alert Service Page — compact alert aggregation and routing.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { MonitorAlertServicePage } from "@/components/pages/monitor-alert-service-page"

const meta: Meta = {
  title: "Pages/Monitor Alert Service",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "监控告警示例页，展示 Prometheus / Zabbix 接入、告警收敛、路由分发和最近事件记录，适合运维平台场景。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <MonitorAlertServicePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("监控告警服务")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索监控源、团队、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /Prometheus 收敛总线/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "路由" }))
    await expect(canvas.getByText("路由规则")).toBeInTheDocument()
  },
}
