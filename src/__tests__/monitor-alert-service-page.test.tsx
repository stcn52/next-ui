import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MonitorAlertServicePage } from "@/components/pages/monitor-alert-service-page"

describe("MonitorAlertServicePage", () => {
  it("renders the monitoring overview header", () => {
    render(<MonitorAlertServicePage />)
    expect(screen.getByText("监控告警服务")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索监控源、团队、标签…")).toBeInTheDocument()
  })

  it("switches the selected monitor service from the list", () => {
    render(<MonitorAlertServicePage />)

    fireEvent.click(screen.getByRole("button", { name: /Zabbix 主机监控/ }))

    expect(screen.getByText("接入主机与网络设备监控，负责探针、阈值和离线告警的统一收口。")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Zabbix 主机监控" })).toBeInTheDocument()
  })

  it("shows routing content in the routing tab", () => {
    render(<MonitorAlertServicePage />)

    fireEvent.click(screen.getByRole("tab", { name: "路由" }))

    expect(screen.getByText("路由规则")).toBeInTheDocument()
    expect(screen.getByText("支付中台值班群")).toBeInTheDocument()
  })
})
