/**
 * Task/Job Engine Page — compact scheduling and execution management.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { TaskJobEnginePage } from "@/components/pages/task-job-engine-page"

const meta: Meta = {
  title: "Pages/Task Job Engine",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "作业调度示例页，展示批量脚本、文件分发和 Cron 任务的统一管理方式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <TaskJobEnginePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("作业调度服务")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索任务、队列、标签…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /批量脚本执行/ })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("tab", { name: "历史执行" }))
    await expect(canvas.getByText("最近执行记录")).toBeInTheDocument()
  },
}
