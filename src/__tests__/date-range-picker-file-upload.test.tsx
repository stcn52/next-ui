import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DateRangePicker } from "@/components/ui/date/date-range-picker"
import {
  FileUpload,
  FileUploadItemRow,
  formatBytes,
} from "@/components/ui/file-upload"
import type { FileUploadItem } from "@/components/ui/file-upload"

/* ================================================================== */
/*  formatBytes                                                        */
/* ================================================================== */

describe("formatBytes", () => {
  it("returns '0 B' for zero", () => {
    expect(formatBytes(0)).toBe("0 B")
  })

  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B")
  })

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB")
  })

  it("formats megabytes", () => {
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1.5 MB")
  })

  it("formats gigabytes", () => {
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toBe("2 GB")
  })
})

/* ================================================================== */
/*  DateRangePicker                                                    */
/* ================================================================== */

describe("DateRangePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DateRangePicker />)
    const btn = screen.getByRole("button")
    expect(btn).toBeTruthy()
  })

  it("shows formatted date range label when range is provided", () => {
    const from = new Date(2024, 0, 1) // Jan 1 2024
    const to = new Date(2024, 0, 7)   // Jan 7 2024
    render(<DateRangePicker dateRange={{ from, to }} />)
    // The button aria-label should contain date info
    const btn = screen.getByRole("button")
    expect(btn.getAttribute("aria-label")).toContain("2024")
  })

  it("shows only start date when no end date", () => {
    const from = new Date(2024, 5, 15) // Jun 15 2024
    render(<DateRangePicker dateRange={{ from }} />)
    const btn = screen.getByRole("button")
    expect(btn.getAttribute("aria-label")).toBeTruthy()
  })

  it("uses custom placeholder prop", () => {
    render(<DateRangePicker placeholder="选择范围" />)
    expect(screen.getByText("选择范围")).toBeTruthy()
  })

  it("accepts onDateRangeChange callback prop without errors", () => {
    const spy = vi.fn()
    // Just verify it renders without error when callback is provided
    expect(() => render(<DateRangePicker onDateRangeChange={spy} />)).not.toThrow()
    const btn = screen.getByRole("button")
    expect(btn).toBeTruthy()
    // Verify callback is not called before user interaction
    expect(spy).not.toHaveBeenCalled()
  })

  it("accepts className prop", () => {
    render(<DateRangePicker className="test-class" />)
    const btn = screen.getByRole("button")
    expect(btn.classList.contains("test-class")).toBe(true)
  })
})

/* ================================================================== */
/*  FileUploadItemRow                                                  */
/* ================================================================== */

function makeFile(name: string, type: string, size = 1024): File {
  const file = new File(["x".repeat(size)], name, { type })
  return file
}

describe("FileUploadItemRow", () => {
  it("renders file name and size", () => {
    const item: FileUploadItem = {
      id: "1",
      file: makeFile("report.pdf", "application/pdf", 2048),
    }
    render(<FileUploadItemRow item={item} />)
    expect(screen.getByText("report.pdf")).toBeTruthy()
    expect(screen.getByText("2 KB")).toBeTruthy()
  })

  it("shows error message when status is error", () => {
    const item: FileUploadItem = {
      id: "2",
      file: makeFile("bad.txt", "text/plain"),
      status: "error",
      error: "文件太大",
    }
    render(<FileUploadItemRow item={item} />)
    expect(screen.getByText("文件太大")).toBeTruthy()
  })

  it("shows default error message when error prop is omitted", () => {
    const item: FileUploadItem = {
      id: "3",
      file: makeFile("bad.txt", "text/plain"),
      status: "error",
    }
    render(<FileUploadItemRow item={item} />)
    expect(screen.getByText("上传失败")).toBeTruthy()
  })

  it("shows '完成' badge when status is done", () => {
    const item: FileUploadItem = {
      id: "4",
      file: makeFile("done.txt", "text/plain"),
      status: "done",
    }
    render(<FileUploadItemRow item={item} />)
    expect(screen.getByText("完成")).toBeTruthy()
  })

  it("renders remove button with correct aria-label", () => {
    const spy = vi.fn()
    const item: FileUploadItem = {
      id: "5",
      file: makeFile("image.png", "image/png"),
    }
    render(<FileUploadItemRow item={item} onRemove={spy} />)
    const btn = screen.getByRole("button", { name: "移除 image.png" })
    expect(btn).toBeTruthy()
  })

  it("calls onRemove with correct id when remove button is clicked", () => {
    const spy = vi.fn()
    const item: FileUploadItem = { id: "x1", file: makeFile("x.txt", "text/plain") }
    render(<FileUploadItemRow item={item} onRemove={spy} />)
    fireEvent.click(screen.getByRole("button", { name: "移除 x.txt" }))
    expect(spy).toHaveBeenCalledWith("x1")
  })

  it("shows progress bar when status is uploading", () => {
    const item: FileUploadItem = {
      id: "6",
      file: makeFile("upload.zip", "application/zip"),
      status: "uploading",
      progress: 60,
    }
    const { container } = render(<FileUploadItemRow item={item} />)
    // Progress bar rendered
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy()
  })
})

/* ================================================================== */
/*  FileUpload (drop zone)                                            */
/* ================================================================== */

describe("FileUpload", () => {
  it("renders the drop zone with default placeholder", () => {
    render(<FileUpload />)
    expect(screen.getByText("拖拽文件到此处，或点击选择")).toBeTruthy()
  })

  it("renders custom placeholder", () => {
    render(<FileUpload placeholder="点击上传" />)
    expect(screen.getByText("点击上传")).toBeTruthy()
  })

  it("renders description text when provided", () => {
    render(<FileUpload description="最大 10 MB" />)
    expect(screen.getByText("最大 10 MB")).toBeTruthy()
  })

  it("renders file input element", () => {
    const { container } = render(<FileUpload />)
    const input = container.querySelector("input[type='file']")
    expect(input).toBeTruthy()
  })

  it("passes accept attribute to file input", () => {
    const { container } = render(<FileUpload accept="image/*" />)
    const input = container.querySelector("input[type='file']")
    expect(input?.getAttribute("accept")).toBe("image/*")
  })

  it("sets multiple attribute when multiple=true", () => {
    const { container } = render(<FileUpload multiple />)
    const input = container.querySelector("input[type='file']")
    expect(input?.hasAttribute("multiple")).toBe(true)
  })

  it("input is disabled when disabled=true", () => {
    const { container } = render(<FileUpload disabled />)
    const input = container.querySelector("input[type='file']") as HTMLInputElement
    expect(input?.disabled).toBe(true)
  })

  it("renders existing items", () => {
    const items: FileUploadItem[] = [
      { id: "a", file: makeFile("a.txt", "text/plain"), status: "done" },
      { id: "b", file: makeFile("b.png", "image/png") },
    ]
    render(<FileUpload items={items} />)
    expect(screen.getByText("a.txt")).toBeTruthy()
    expect(screen.getByText("b.png")).toBeTruthy()
  })

  it("calls onFilesChange when files are dropped", () => {
    const spy = vi.fn()
    render(<FileUpload placeholder="拖拽文件到此处，或点击选择" onFilesChange={spy} />)
    const dropZone = screen.getByRole("button", { name: "拖拽文件到此处，或点击选择" })
    const file = makeFile("drop.txt", "text/plain")
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    })
    expect(spy).toHaveBeenCalledWith([file])
  })

  it("filters files exceeding maxSize", () => {
    const spy = vi.fn()
    // Simulate a drop with one 50B file and one 200B file
    const small = makeFile("small.txt", "text/plain", 50)
    const large = makeFile("large.txt", "text/plain", 200)
    render(<FileUpload maxSize={100} onFilesChange={spy} />)
    const dropZone = screen.getByRole("button", { name: "拖拽文件到此处，或点击选择" })
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [small, large] },
    })
    // Only small file should pass
    expect(spy).toHaveBeenCalledWith([small])
  })
})
