import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CMDBAssetManagementPage } from "@/components/pages/cmdb-asset-management-page"

describe("CMDBAssetManagementPage", () => {
  it("renders the asset management header", () => {
    render(<CMDBAssetManagementPage />)
    expect(screen.getByText("CMDB 资产管理")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索资产、负责人、标签…")).toBeInTheDocument()
  })

  it("switches the selected asset", () => {
    render(<CMDBAssetManagementPage />)

    fireEvent.click(screen.getByRole("button", { name: /边界网关设备/ }))

    expect(
      screen.getByText(/承接外部访问与安全隔离的核心网络设备/),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "边界网关设备" })).toBeInTheDocument()
  })

  it("shows dynamic field content in the detail tab", () => {
    render(<CMDBAssetManagementPage />)

    expect(screen.getByText("动态字段已启用")).toBeInTheDocument()
    expect(screen.getByText("动态字段")).toBeInTheDocument()
    expect(screen.getByText("资源编号")).toBeInTheDocument()
  })
})
