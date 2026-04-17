/**
 * Unit tests for SettingsPage component
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { SettingsPage } from "@/components/pages/settings-page"

describe("SettingsPage", () => {
  it("renders the navigation sidebar", () => {
    render(<SettingsPage />)
    expect(screen.getByRole("navigation", { name: "设置导航" })).toBeInTheDocument()
  })

  it("renders all tab buttons", () => {
    render(<SettingsPage />)
    expect(screen.getByRole("tab", { name: "个人信息" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "安全设置" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "通知偏好" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "外观" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "危险操作" })).toBeInTheDocument()
  })

  it("shows profile tab content by default", () => {
    render(<SettingsPage />)
    expect(screen.getByText("显示名称")).toBeInTheDocument()
    expect(screen.getByDisplayValue("陈宇")).toBeInTheDocument()
  })

  it("switches to security tab on click", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "安全设置" }))
    expect(screen.getByText("修改密码")).toBeInTheDocument()
    expect(screen.getByText("双因素认证 (2FA)")).toBeInTheDocument()
  })

  it("switches to notifications tab on click", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "通知偏好" }))
    expect(screen.getByText("每日邮件摘要")).toBeInTheDocument()
    expect(screen.getByText("@提及通知")).toBeInTheDocument()
  })

  it("switches to appearance tab on click", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "外观" }))
    expect(screen.getByText("界面主题")).toBeInTheDocument()
    expect(screen.getByText("紧凑模式")).toBeInTheDocument()
  })

  it("switches to danger tab on click", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "危险操作" }))
    expect(screen.getByText("删除账号")).toBeInTheDocument()
    expect(screen.getByText("导出数据")).toBeInTheDocument()
  })

  it("profile form updates name input", () => {
    render(<SettingsPage />)
    const nameInput = screen.getByDisplayValue("陈宇")
    fireEvent.change(nameInput, { target: { value: "新名字" } })
    expect(screen.getByDisplayValue("新名字")).toBeInTheDocument()
  })

  it("save button shows confirmation on click", () => {
    render(<SettingsPage />)
    const saveBtn = screen.getByRole("button", { name: "保存更改" })
    fireEvent.click(saveBtn)
    expect(screen.getByText(/已保存/)).toBeInTheDocument()
  })

  it("danger tab disables delete button unless DELETE typed", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "危险操作" }))
    const deleteBtn = screen.getByRole("button", { name: "永久删除账号" })
    expect(deleteBtn).toBeDisabled()

    const confirmInput = screen.getByRole("textbox", { name: "确认删除" })
    fireEvent.change(confirmInput, { target: { value: "DELETE" } })
    expect(deleteBtn).not.toBeDisabled()
  })

  it("notifications tab toggle changes switch state", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "通知偏好" }))
    // "任务分配" starts disabled — its switch should be unchecked
    const taskSwitch = screen.getByRole("switch", { name: "任务分配" })
    expect(taskSwitch).toHaveAttribute("aria-checked", "false")
    fireEvent.click(taskSwitch)
    expect(taskSwitch).toHaveAttribute("aria-checked", "true")
  })

  it("security tab 2FA switch toggles", () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByRole("tab", { name: "安全设置" }))
    const switch2fa = screen.getByRole("switch", { name: "启用双因素认证" })
    expect(switch2fa).toHaveAttribute("aria-checked", "false")
    fireEvent.click(switch2fa)
    expect(switch2fa).toHaveAttribute("aria-checked", "true")
  })
})
