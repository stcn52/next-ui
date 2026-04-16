import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TagInput } from "@/components/ui/tag-input"
import { RatingInput } from "@/components/ui/rating-input"

// ---------------------------------------------------------------------------
// TagInput
// ---------------------------------------------------------------------------

describe("TagInput", () => {
  it("renders initial tags", () => {
    render(<TagInput value={["React", "TypeScript"]} />)
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })

  it("shows placeholder when empty", () => {
    render(<TagInput placeholder="Add a tag…" />)
    expect(screen.getByPlaceholderText("Add a tag…")).toBeInTheDocument()
  })

  it("adds a tag on Enter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput defaultValue={[]} onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.type(input, "Vue{Enter}")
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["Vue"]))
  })

  it("does not add empty tag", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.type(input, "   {Enter}")
    expect(onChange).not.toHaveBeenCalled()
  })

  it("adds tag on comma delimiter", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} delimiters={[",", "Enter"]} />)
    const input = screen.getByRole("textbox")
    await user.type(input, "Node,")
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["Node"]))
  })

  it("removes a tag when × is clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={["A", "B"]} onChange={onChange} />)
    const removeBtn = screen.getByLabelText("移除标签 A")
    await user.click(removeBtn)
    expect(onChange).toHaveBeenCalledWith(["B"])
  })

  it("respects maxTags limit", () => {
    const onChange = vi.fn()
    render(<TagInput defaultValue={["a", "b"]} maxTags={2} onChange={onChange} />)
    // Input should not be visible when maxTags is reached
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("prevents duplicate tags when allowDuplicates=false", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput defaultValue={["React"]} allowDuplicates={false} onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.type(input, "React{Enter}")
    expect(onChange).not.toHaveBeenCalled()
  })

  it("allows duplicate tags when allowDuplicates=true", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput defaultValue={["React"]} allowDuplicates onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.type(input, "React{Enter}")
    expect(onChange).toHaveBeenCalledWith(["React", "React"])
  })

  it("removes last tag on Backspace when input is empty", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={["A", "B"]} onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.click(input)
    await user.keyboard("{Backspace}")
    expect(onChange).toHaveBeenCalledWith(["A"])
  })

  it("hides remove button when allowRemove=false", () => {
    render(<TagInput value={["X", "Y"]} allowRemove={false} />)
    expect(screen.queryByLabelText("移除标签 X")).not.toBeInTheDocument()
  })

  it("shows remove button when allowRemove=true (default)", () => {
    render(<TagInput value={["X"]} />)
    expect(screen.getByLabelText("移除标签 X")).toBeInTheDocument()
  })

  it("disables input and hides remove in disabled state", () => {
    render(<TagInput value={["A"]} disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
    // remove button should not be present when disabled
    expect(screen.queryByLabelText("移除标签 A")).not.toBeInTheDocument()
  })

  it("adds tag on blur when input has value", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole("textbox")
    await user.click(input)
    await user.type(input, "Go")
    await user.tab() // blur
    expect(onChange).toHaveBeenCalledWith(["Go"])
  })
})

// ---------------------------------------------------------------------------
// RatingInput
// ---------------------------------------------------------------------------

describe("RatingInput", () => {
  it("renders correct number of star buttons", () => {
    render(<RatingInput max={5} />)
    const stars = screen.getAllByRole("radio")
    expect(stars).toHaveLength(5)
  })

  it("respects custom max", () => {
    render(<RatingInput max={10} />)
    expect(screen.getAllByRole("radio")).toHaveLength(10)
  })

  it("calls onChange when a star is clicked", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[2]) // click 3rd star → value 3
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it("does not call onChange in readOnly mode", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput value={3} readOnly onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  it("does not call onChange when disabled", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput disabled onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[1])
    expect(onChange).not.toHaveBeenCalled()
  })

  it("clears value when same star is clicked (allowClear=true)", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput value={3} allowClear onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[2]) // click currently-selected star
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it("does not clear value when allowClear=false", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput value={3} allowClear={false} onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[2])
    expect(onChange).not.toHaveBeenCalledWith(0)
  })

  it("shows value text when showValue=true", () => {
    render(<RatingInput value={4} showValue />)
    expect(screen.getByText(/4/)).toBeInTheDocument()
  })

  it("controlled mode sets correct aria-checked on stars", () => {
    render(<RatingInput value={3} max={5} />)
    const stars = screen.getAllByRole("radio")
    // In a radiogroup, only the selected star (index 2 = star 3) is aria-checked
    expect(stars[2]).toHaveAttribute("aria-checked", "true")
    expect(stars[0]).toHaveAttribute("aria-checked", "false")
    expect(stars[4]).toHaveAttribute("aria-checked", "false")
  })

  it("renders in uncontrolled mode with defaultValue", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RatingInput defaultValue={2} onChange={onChange} />)
    const stars = screen.getAllByRole("radio")
    await user.click(stars[4]) // click 5th star
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('has role="radiogroup" on container', () => {
    render(<RatingInput />)
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
  })
})
