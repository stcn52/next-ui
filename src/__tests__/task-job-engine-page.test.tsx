import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TaskJobEnginePage } from "@/components/pages/task-job-engine-page"

describe("TaskJobEnginePage", () => {
  it("renders the job engine header", () => {
    render(<TaskJobEnginePage />)
    expect(screen.getByText("作业调度服务")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索任务、队列、标签…")).toBeInTheDocument()
  })

  it("switches the selected job from the list", () => {
    render(<TaskJobEnginePage />)

    fireEvent.click(screen.getByRole("button", { name: /文件分发/ }))

    expect(screen.getByText("对接分发平台，向多组目标主机推送制品、配置和补丁文件。")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "文件分发" })).toBeInTheDocument()
  })

  it("shows schedule content in the schedule tab", () => {
    render(<TaskJobEnginePage />)

    fireEvent.click(screen.getByRole("tab", { name: "调度策略" }))

    expect(screen.getByText("集成通道")).toBeInTheDocument()
  })
})
