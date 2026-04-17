import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CMDBServicePage } from "@/components/pages/cmdb-service-page"

describe("CMDBServicePage", () => {
  it("renders the service overview header", () => {
    render(<CMDBServicePage />)
    expect(screen.getByText("CMDB 服务总览")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索服务、负责人、标签…")).toBeInTheDocument()
  })

  it("switches the selected service from the list", () => {
    render(<CMDBServicePage />)

    fireEvent.click(screen.getByRole("button", { name: /订单中心/ }))

    expect(screen.getByText("承接订单写入和状态流转，负责将支付结果同步到订单域。")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "订单中心" })).toBeInTheDocument()
  })

  it("shows relation content when relation tab is selected", () => {
    render(<CMDBServicePage />)

    fireEvent.click(screen.getByRole("tab", { name: "关系" }))

    expect(screen.getAllByText("上游依赖").length).toBeGreaterThan(0)
    expect(screen.getAllByText("下游服务").length).toBeGreaterThan(0)
  })
})
