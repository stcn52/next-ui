import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OTPInput } from "@/components/ui/inputs/otp-input"
import { ColorPicker } from "@/components/ui/color-picker"

// ---------------------------------------------------------------------------
// OTPInput
// ---------------------------------------------------------------------------

describe("OTPInput", () => {
  it("renders correct number of cells (default 6)", () => {
    render(<OTPInput />)
    expect(screen.getAllByRole("textbox")).toHaveLength(6)
  })

  it("renders custom length", () => {
    render(<OTPInput length={4} />)
    expect(screen.getAllByRole("textbox")).toHaveLength(4)
  })

  it("has correct aria-label on each cell", () => {
    render(<OTPInput length={3} />)
    expect(screen.getByLabelText("第 1 位")).toBeInTheDocument()
    expect(screen.getByLabelText("第 2 位")).toBeInTheDocument()
    expect(screen.getByLabelText("第 3 位")).toBeInTheDocument()
  })

  it("has role=group on container", () => {
    render(<OTPInput />)
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("calls onChange when typing", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={4} onChange={onChange} />)
    const cells = screen.getAllByRole("textbox")
    await user.type(cells[0], "1")
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls.at(-1)?.[0] as string
    expect(lastCall).toContain("1")
  })

  it("calls onComplete when all digits entered", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OTPInput length={4} onComplete={onComplete} />)
    const cells = screen.getAllByRole("textbox")
    await user.type(cells[0], "1")
    await user.type(cells[1], "2")
    await user.type(cells[2], "3")
    await user.type(cells[3], "4")
    expect(onComplete).toHaveBeenCalledWith("1234")
  })

  it("renders controlled value", () => {
    render(<OTPInput length={4} value="12" />)
    const cells = screen.getAllByRole("textbox") as HTMLInputElement[]
    expect(cells[0].value).toBe("1")
    expect(cells[1].value).toBe("2")
    expect(cells[2].value).toBe("")
  })

  it("disables all cells when disabled", () => {
    render(<OTPInput length={4} disabled />)
    const cells = screen.getAllByRole("textbox")
    cells.forEach((cell) => expect(cell).toBeDisabled())
  })

  it("renders with mask=true (type=password)", () => {
    render(<OTPInput length={4} mask />)
    // password inputs are not in role=textbox
    const all = document.querySelectorAll("input[type='password']")
    expect(all.length).toBe(4)
  })

  it("shows separator between halves for length>4", () => {
    render(<OTPInput length={6} />)
    expect(screen.getByText("–")).toBeInTheDocument()
  })

  it("does not show separator for length=4", () => {
    render(<OTPInput length={4} />)
    expect(screen.queryByText("–")).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------

describe("ColorPicker", () => {
  it("renders trigger button with aria-label", () => {
    render(<ColorPicker />)
    expect(screen.getByLabelText("打开颜色选择器")).toBeInTheDocument()
  })

  it("shows hex value text next to trigger", () => {
    render(<ColorPicker value="#3b82f6" />)
    expect(screen.getByText("#3B82F6")).toBeInTheDocument()
  })

  it("opens popover when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(<ColorPicker value="#3b82f6" />)
    const trigger = screen.getByLabelText("打开颜色选择器")
    await user.click(trigger)
    // Color sliders should appear
    expect(screen.getByText(/色调 H/i)).toBeInTheDocument()
    expect(screen.getByText(/饱和度 S/i)).toBeInTheDocument()
    expect(screen.getByText(/亮度 L/i)).toBeInTheDocument()
  })

  it("shows preset swatches when showPresets=true (default)", async () => {
    const user = userEvent.setup()
    render(<ColorPicker value="#3b82f6" showPresets />)
    const trigger = screen.getByLabelText("打开颜色选择器")
    await user.click(trigger)
    expect(screen.getByText("预设颜色")).toBeInTheDocument()
  })

  it("hides presets when showPresets=false", async () => {
    const user = userEvent.setup()
    render(<ColorPicker value="#3b82f6" showPresets={false} />)
    const trigger = screen.getByLabelText("打开颜色选择器")
    await user.click(trigger)
    expect(screen.queryByText("预设颜色")).not.toBeInTheDocument()
  })

  it("does not open popover when disabled", async () => {
    const user = userEvent.setup()
    render(<ColorPicker disabled />)
    const trigger = screen.getByLabelText("打开颜色选择器")
    await user.click(trigger)
    expect(screen.queryByText(/色调 H/i)).not.toBeInTheDocument()
  })

  it("calls onChange when preset is clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker value="#3b82f6" onChange={onChange} />)
    await user.click(screen.getByLabelText("打开颜色选择器"))
    // click the red preset
    const redSwatch = screen.getByLabelText("#EF4444")
    await user.click(redSwatch)
    expect(onChange).toHaveBeenCalledWith("#ef4444")
  })

  it("uncontrolled mode defaults to defaultValue", () => {
    render(<ColorPicker defaultValue="#ef4444" />)
    expect(screen.getByText("#EF4444")).toBeInTheDocument()
  })
})
