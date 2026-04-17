import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { WebTerminalServicePage } from "@/components/pages/web-terminal-service-page"

describe("WebTerminalServicePage", () => {
  it("renders the terminal service header", () => {
    render(<WebTerminalServicePage />)
    expect(screen.getByText("Web Terminal 服务")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索主机、用户、标签…")).toBeInTheDocument()
  })

  it("switches the selected session from the list", () => {
    render(<WebTerminalServicePage />)

    fireEvent.click(screen.getByRole("button", { name: /数据库运维终端/ }))

    expect(screen.getAllByText("命令脱敏后保存 365 天").length).toBeGreaterThan(0)
    expect(screen.getByRole("heading", { name: "数据库运维终端" })).toBeInTheDocument()
  })

  it("shows recording content in the recording tab", () => {
    render(<WebTerminalServicePage />)

    fireEvent.click(screen.getByRole("tab", { name: "录屏" }))

    expect(screen.getByText("录屏片段")).toBeInTheDocument()
    expect(screen.getAllByText("P0 会话自动录屏，保留 180 天").length).toBeGreaterThan(0)
  })
})
