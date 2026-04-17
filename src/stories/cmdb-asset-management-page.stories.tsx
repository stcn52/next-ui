/**
 * CMDB Asset Management Page — compact asset inventory, dynamic fields, and application tree.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { CMDBAssetManagementPage } from "@/components/pages/cmdb-asset-management-page"

const meta: Meta = {
  title: "Pages/CMDB Asset Management",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMDB 资产管理示例页，展示主机、云资源、网络设备和应用树，支持动态扩展字段与层级关系。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <CMDBAssetManagementPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("CMDB 资产管理")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索资产、负责人、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /K8s 生产集群/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "应用树" }))
    await expect(canvas.getByText("应用 - 集群 - 实例")).toBeInTheDocument()
  },
}

