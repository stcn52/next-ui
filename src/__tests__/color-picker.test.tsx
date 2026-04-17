/**
 * Unit tests for ColorPicker component (enhanced with recent colors)
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ColorPicker } from "@/components/ui/color-picker"

describe("ColorPicker", () => {
  it("renders the trigger button with background color", () => {
    render(<ColorPicker value="#ef4444" />)
    const trigger = screen.getByRole("button", { name: "打开颜色选择器" })
    expect(trigger).toBeInTheDocument()
    // The inner span should have the background color
    const swatch = trigger.querySelector("span")
    expect(swatch).toHaveStyle({ backgroundColor: "#ef4444" })
  })

  it("renders a hex label next to trigger", () => {
    render(<ColorPicker value="#ef4444" />)
    expect(screen.getByText("#EF4444")).toBeInTheDocument()
  })

  it("disabled state disables trigger", () => {
    render(<ColorPicker value="#3b82f6" disabled />)
    const trigger = screen.getByRole("button", { name: "打开颜色选择器" })
    expect(trigger).toBeDisabled()
  })

  it("opens popover and shows HSL sliders", async () => {
    render(<ColorPicker value="#3b82f6" />)
    const trigger = screen.getByRole("button", { name: "打开颜色选择器" })
    fireEvent.click(trigger)
    // H, S, L sliders should appear
    const sliders = screen.getAllByRole("slider")
    expect(sliders.length).toBeGreaterThanOrEqual(3)
  })

  it("calls onChange when a preset swatch is clicked", async () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#ffffff" onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: "打开颜色选择器" }))
    // Click the red preset swatch
    const redSwatch = screen.getByRole("button", { name: "#EF4444" })
    fireEvent.click(redSwatch)
    expect(onChange).toHaveBeenCalledWith("#ef4444")
  })

  it("shows recent colors after picking a color", async () => {
    render(<ColorPicker value="#ffffff" />)
    fireEvent.click(screen.getByRole("button", { name: "打开颜色选择器" }))
    const redSwatch = screen.getByRole("button", { name: "#EF4444" })
    fireEvent.click(redSwatch)
    // Recent section should now appear
    expect(screen.getByText("最近使用")).toBeInTheDocument()
  })

  it("maxRecent=0 hides recent colors section", async () => {
    render(<ColorPicker value="#ffffff" maxRecent={0} />)
    fireEvent.click(screen.getByRole("button", { name: "打开颜色选择器" }))
    const redSwatch = screen.getByRole("button", { name: "#EF4444" })
    fireEvent.click(redSwatch)
    expect(screen.queryByText("最近使用")).not.toBeInTheDocument()
  })

  it("showPresets=false hides preset swatches", async () => {
    render(<ColorPicker value="#3b82f6" showPresets={false} />)
    fireEvent.click(screen.getByRole("button", { name: "打开颜色选择器" }))
    expect(screen.queryByText("预设颜色")).not.toBeInTheDocument()
  })

  it("hex input updates color on valid hex input", async () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#3b82f6" onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: "打开颜色选择器" }))
    // There's an Input for the hex value
    const inputs = screen.getAllByRole("textbox")
    const hexInput = inputs[0]
    fireEvent.change(hexInput, { target: { value: "ef4444" } })
    // Valid hex — onChange should be called
    expect(onChange).toHaveBeenCalled()
  })
})
