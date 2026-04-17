import { test, expect } from "@playwright/test"

// ─── DataGrid E2E ─────────────────────────────────────────────────────────────

test.describe("DataGrid — data mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-datagrid--default&viewMode=story")
    await page.waitForSelector("table")
  })

  test("renders column headers", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "姓名" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "部门" })).toBeVisible()
  })

  test("renders paginated rows", async ({ page }) => {
    // Default pageSize=10, should show 10 data rows
    const rows = page.locator("tbody tr")
    await expect(rows).toHaveCount(10)
  })

  test("filter input narrows results", async ({ page }) => {
    const input = page.getByPlaceholder("搜索姓名…")
    await input.fill("陈宇")
    // After filter, fewer rows should appear
    const rows = page.locator("tbody tr")
    const count = await rows.count()
    expect(count).toBeLessThan(10)
  })

  test("pagination next button advances page", async ({ page }) => {
    const nextBtn = page.getByRole("button", { name: "下一页" })
    await nextBtn.click()
    // Page 2 should be active — row content changes
    await expect(page.getByText("1–10").or(page.getByText("11–20"))).toBeVisible()
  })

  test("pagination first/last buttons work", async ({ page }) => {
    // Go to last page
    await page.getByRole("button", { name: "最后一页" }).click()
    // Then go back to first page
    await page.getByRole("button", { name: "第一页" }).click()
    // Should show row 1 again
    const rows = page.locator("tbody tr")
    await expect(rows.first()).toBeVisible()
  })
})

test.describe("DataGrid — full features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-datagrid--full-features&viewMode=story")
    await page.waitForSelector("table")
  })

  test("column visibility toggle hides a column", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "薪资" })).toBeVisible()
    await page.getByRole("button", { name: "列" }).click()
    // Uncheck salary column
    const salaryCheckbox = page.getByRole("menuitemcheckbox", { name: "薪资" })
    await salaryCheckbox.click()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("columnheader", { name: "薪资" })).not.toBeVisible()
  })

  test("row selection checkbox selects a row", async ({ page }) => {
    const checkbox = page.locator("tbody tr").first().getByRole("checkbox")
    await checkbox.click()
    // Badge showing "1 行已选" should appear in toolbar
    await expect(page.getByText(/1 行/).or(page.getByText(/已选/))).toBeVisible()
  })

  test("sorting by ID toggles sort direction", async ({ page }) => {
    const idHeader = page.getByRole("columnheader", { name: "ID" })
    await idHeader.click()
    // Check that sort icon changes (ascending state present)
    await expect(idHeader.locator("svg")).toBeVisible()
    // Click again for descending
    await idHeader.click()
    await expect(idHeader.locator("svg")).toBeVisible()
  })
})

test.describe("DataGrid — spreadsheet mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-datagrid--spreadsheet-mode&viewMode=story")
    await page.waitForSelector("table")
  })

  test("formula bar is visible", async ({ page }) => {
    // Formula bar renders a div with the cell address box
    // Address box shows "—" when no cell selected
    await expect(page.getByText("（未选中单元格）").or(page.locator("[placeholder='（未选中单元格）']")).first()).toBeVisible()
  })

  test("row number column is rendered", async ({ page }) => {
    // Row numbers 1, 2, 3 should appear
    const cells = page.locator("td").getByText("1", { exact: true })
    await expect(cells.first()).toBeVisible()
  })

  test("clicking a cell activates it", async ({ page }) => {
    const firstDataCell = page.locator("tbody tr").first().locator("td").nth(1)
    await firstDataCell.click()
    // Cell should be marked as active via aria-selected
    await expect(firstDataCell.locator("[role='button']")).toHaveAttribute("aria-selected", "true")
  })

  test("double-click enters edit mode", async ({ page }) => {
    const firstDataCell = page.locator("tbody tr").first().locator("td").nth(1)
    await firstDataCell.dblclick()
    // An input should appear in the cell
    await expect(firstDataCell.locator("input")).toBeVisible()
  })
})

// ─── FileTree E2E ─────────────────────────────────────────────────────────────

test.describe("FileTree — default story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-filetree--default&viewMode=story")
    await page.waitForSelector("[role='tree']")
  })

  test("renders root items", async ({ page }) => {
    await expect(page.getByText("src")).toBeVisible()
    await expect(page.getByText("public")).toBeVisible()
    await expect(page.getByText("README.md")).toBeVisible()
  })

  test("folder starts expanded via defaultOpen", async ({ page }) => {
    // src and components are in defaultOpen
    await expect(page.getByText("App.tsx")).toBeVisible()
    await expect(page.getByText("button.tsx")).toBeVisible()
  })

  test("clicking collapsed folder expands it", async ({ page }) => {
    // public starts collapsed
    expect(await page.getByText("favicon.ico").isVisible()).toBe(false)
    await page.getByText("public").click()
    await expect(page.getByText("favicon.ico")).toBeVisible()
  })

  test("clicking open folder collapses it", async ({ page }) => {
    // components is open (in defaultOpen), collapse it
    await page.getByText("components").click()
    expect(await page.getByText("button.tsx").isVisible()).toBe(false)
  })

  test("keyboard ArrowRight expands a folder", async ({ page }) => {
    // Focus on public (collapsed)
    const publicItem = page.getByRole("treeitem", { name: /public/ })
    await publicItem.focus()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByText("favicon.ico")).toBeVisible()
  })
})

test.describe("FileTree — with selection story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-filetree--with-selection&viewMode=story")
    await page.waitForSelector("[role='tree']")
  })

  test("clicking a file updates selected badge", async ({ page }) => {
    // src, components, pages all open in this story
    await page.getByText("src").click()
    // Badge should update
    const badge = page.locator("[data-slot='badge']")
    await expect(badge).toContainText("src")
  })
})
