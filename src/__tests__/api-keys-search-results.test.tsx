/**
 * Unit tests for ApiKeysPage and SearchResultsPage stories (UI interaction)
 */
import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

// ─── ApiKeysPage helpers (inline mini-components to avoid story-level deps) ──

// We test the components logic directly rather than importing page stories,
// so we import the low-level building blocks used inside the pages.

// ─── Mock clipboard ──────────────────────────────────────────────────────────
const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
Object.defineProperty(navigator, "clipboard", { value: mockClipboard, configurable: true })

// ─── ApiKeysPage Tests ────────────────────────────────────────────────────────

describe("ApiKeysPage", () => {
  // We render the exported Default story directly
  it("renders page heading", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("API 密钥")).toBeInTheDocument()
  })

  it("shows active keys count", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // 3 active + 1 revoked
    expect(screen.getByText(/有效密钥 \(3\)/)).toBeInTheDocument()
  })

  it("shows revoked keys section", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText(/已吊销密钥 \(1\)/)).toBeInTheDocument()
  })

  it("shows usage stats card", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("本月用量")).toBeInTheDocument()
    expect(screen.getByText("API 调用次数")).toBeInTheDocument()
  })

  it("opens create key dialog on button click", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // There may be multiple buttons matching — click the header button (first)
    fireEvent.click(screen.getAllByRole("button", { name: /创建密钥/ })[0])
    expect(screen.getByText("创建新密钥")).toBeInTheDocument()
  })

  it("create button is disabled when name is empty", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    fireEvent.click(screen.getAllByRole("button", { name: /创建密钥/ })[0])
    const createBtn = screen.getByRole("button", { name: "创建" })
    expect(createBtn).toBeDisabled()
  })

  it("enables create button when name typed", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    fireEvent.click(screen.getAllByRole("button", { name: /创建密钥/ })[0])
    const input = screen.getByPlaceholderText(/生产环境/)
    fireEvent.change(input, { target: { value: "测试密钥" } })
    const createBtn = screen.getByRole("button", { name: "创建" })
    expect(createBtn).not.toBeDisabled()
  })

  it("creating a key shows the new key and warning", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    fireEvent.click(screen.getAllByRole("button", { name: /创建密钥/ })[0])
    const input = screen.getByPlaceholderText(/生产环境/)
    fireEvent.change(input, { target: { value: "集成测试密钥" } })
    fireEvent.click(screen.getByRole("button", { name: "创建" }))
    expect(screen.getByText(/密钥已创建/)).toBeInTheDocument()
    expect(screen.getByText(/请立即复制/)).toBeInTheDocument()
  })

  it("revoking a key updates the count", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Click the first revoke icon (生产环境)
    const revokeButtons = screen.getAllByRole("button", { name: /吊销/ })
    expect(revokeButtons.length).toBeGreaterThan(0)
    fireEvent.click(revokeButtons[0])
    // Active count should decrease
    expect(screen.getByText(/有效密钥 \(2\)/)).toBeInTheDocument()
  })

  it("shows key prefix in list", async () => {
    const { Default } = await import("@/stories/api-keys-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText(/sk-prod-Ax9K/)).toBeInTheDocument()
  })
})

// ─── SearchResultsPage Tests ─────────────────────────────────────────────────

describe("SearchResultsPage", () => {
  it("renders initial search query 'React'", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    const input = screen.getByPlaceholderText(/搜索文章/)
    expect(input).toHaveValue("React")
  })

  it("shows results count", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // With query "React" there should be multiple results
    expect(screen.getByText(/条结果/)).toBeInTheDocument()
  })

  it("clears query on × button click", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Find the clear button near the input by looking for the X icon button
    const inputWrapper = screen.getByPlaceholderText(/搜索文章/).closest("div")!
    const clearIcon = within(inputWrapper).getAllByRole("button")[0]
    fireEvent.click(clearIcon)
    expect(screen.getByPlaceholderText(/搜索文章/)).toHaveValue("")
  })

  it("filters by category", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Clear search query first so category filter isn't masked by text search
    const input = screen.getByPlaceholderText(/搜索文章/)
    fireEvent.change(input, { target: { value: "" } })
    // Click "测试" category
    const testingBtns = screen.getAllByRole("button", { name: "测试" })
    fireEvent.click(testingBtns[0])
    // Should show the Playwright article in 测试 category
    expect(screen.getAllByText(/Playwright/).length).toBeGreaterThan(0)
  })

  it("shows empty state when no match", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    const input = screen.getByPlaceholderText(/搜索文章/)
    fireEvent.change(input, { target: { value: "xyzxyz_no_match_999" } })
    expect(screen.getByText("未找到匹配结果")).toBeInTheDocument()
  })

  it("filters sidebar toggle works", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    const toggleBtn = screen.getByRole("button", { name: /收起筛选/ })
    fireEvent.click(toggleBtn)
    expect(screen.getByRole("button", { name: /展开筛选/ })).toBeInTheDocument()
  })

  it("highlights keyword in results", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // There should be <mark> elements for the keyword "React"
    const marks = document.querySelectorAll("mark")
    expect(marks.length).toBeGreaterThan(0)
  })

  it("clears all filters via clear button", async () => {
    const { Default } = await import("@/stories/search-results-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Clear search query then apply a category filter to trigger the clear button
    const input = screen.getByPlaceholderText(/搜索文章/)
    fireEvent.change(input, { target: { value: "" } })
    const testingBtns = screen.getAllByRole("button", { name: "测试" })
    fireEvent.click(testingBtns[0])
    // Clear filter button should appear — there may be multiple (header + sidebar empty state)
    const clearFilters = screen.getAllByRole("button", { name: /清除筛选/ })
    fireEvent.click(clearFilters[0])
    // Should be back to no active filter — clear button gone
    expect(screen.queryByRole("button", { name: /清除筛选/ })).not.toBeInTheDocument()
  })
})
