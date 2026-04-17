/**
 * CI/CD Service Page — compact pipeline orchestration with stages and run history.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { CICDServicePage } from "@/components/pages/cicd-service-page"

const meta: Meta = {
  title: "Pages/CI CD Service",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CI/CD 流水线示例页，展示构建、测试、镜像、部署和历史执行记录，适合对接 GitLab、GitHub、Jenkins 和 Tekton 的运维平台。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <CICDServicePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("CI/CD 流水线")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索流水线、仓库、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /核心支付流水线/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "阶段" }))
    await expect(canvas.getByText("阶段编排")).toBeInTheDocument()
  },
}
