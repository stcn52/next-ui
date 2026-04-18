import { expect, test } from "@playwright/test"

test.describe("DataTable — default story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=ui-datatable--default&viewMode=story")
    await expect(page.locator('[data-slot="data-table"]')).toBeVisible()
  })

  test("renders column headers", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "Email" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Amount" })).toBeVisible()
  })

  test("filter input narrows results", async ({ page }) => {
    const input = page.getByPlaceholder("Filter emails...")
    await input.fill("ken")

    const rows = page.locator('[data-slot="table-body"] tr')
    await expect(page.getByText("ken99@yahoo.com")).toBeVisible()
    await expect(rows).toHaveCount(1)
  })

  test("pagination next button advances page", async ({ page }) => {
    await expect(page.getByText("ken99@yahoo.com")).toBeVisible()
    await page.getByRole("button", { name: "Next" }).click()
    await expect(page.getByText("casey@tech.io")).toBeVisible()
  })
})

test.describe("DataTable — sorting and selection story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=ui-datatable--with-sorting-and-selection&viewMode=story")
    await expect(page.locator('[data-slot="data-table"]')).toBeVisible()
  })

  test("row selection checkbox updates the selected summary", async ({ page }) => {
    const firstRowCheckbox = page.locator('[data-slot="table-body"] tr').first().getByRole("checkbox")
    await firstRowCheckbox.click()

    await expect(page.getByRole("status")).toContainText("1 of 12 row(s) selected.")
  })

  test("sorting by email reorders the first row", async ({ page }) => {
    const firstEmailCell = page.locator('[data-slot="table-body"] tr').first().locator("td").nth(2)
    await expect(firstEmailCell).toHaveText("ken99@yahoo.com")

    await page.getByRole("button", { name: "Email" }).click()

    await expect(firstEmailCell).toHaveText("abe45@gmail.com")
  })
})

test.describe("FileManager — default story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=pages-filemanager--default&viewMode=story")
    await page.setViewportSize({ width: 1600, height: 980 })
    await expect(page.getByPlaceholder("搜索文件/目录")).toBeVisible()
  })

  test("renders the main file list", async ({ page }) => {
    await expect(page.getByRole("cell", { name: "301" }).first()).toBeVisible()
    await expect(page.getByText("gfw301.bak.zip")).toBeVisible()
    await expect(page.getByText("在新窗口打开")).toBeVisible()
  })

  test("search narrows the list", async ({ page }) => {
    const input = page.getByPlaceholder("搜索文件/目录")
    await input.fill("gfwcli")

    const rows = page.locator('[data-slot="table-body"] tr')
    await expect(rows).toHaveCount(1)
    await expect(page.getByText("gfwcli.zip")).toBeVisible()
  })

  test("grid view toggle switches layout", async ({ page }) => {
    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "网格视图" }).click()
    await expect(page.getByRole("button", { name: "列表视图" })).toBeVisible()
    await expect(page.getByText("301", { exact: true })).toBeVisible()
  })

  test("matches the visual baseline", async ({ page }) => {
    await expect(page.locator("section").first()).toHaveScreenshot("file-manager-page.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })
})

test.describe("FileManager — dark story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=pages-filemanager--dark&viewMode=story")
    await page.setViewportSize({ width: 1600, height: 980 })
    await expect(page.getByPlaceholder("搜索文件/目录")).toBeVisible()
  })

  test("renders the dark file list", async ({ page }) => {
    await expect(page.getByRole("cell", { name: "301" }).first()).toBeVisible()
    await expect(page.getByText("在新窗口打开")).toBeVisible()
  })

  test("matches the dark visual baseline", async ({ page }) => {
    await expect(page.locator("section").first()).toHaveScreenshot("file-manager-page-dark.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })
})
