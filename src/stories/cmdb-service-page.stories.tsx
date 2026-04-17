/**
 * CMDB Service Page — compact service inventory with dependency and change views.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { CMDBServicePage } from "@/components/pages/cmdb-service-page"

const meta: Meta = {
  title: "Pages/CMDB Service",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMDB 服务示例页，展示服务列表、服务画像、依赖关系和变更记录，适合后台资产管理场景。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <CMDBServicePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("CMDB 服务总览")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索服务、负责人、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /核心支付服务/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "关系" }))
    await expect(canvas.getByText("上游依赖")).toBeInTheDocument()
    await expect(canvas.getByText("下游服务")).toBeInTheDocument()
  },
}
