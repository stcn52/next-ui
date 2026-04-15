import { test, expect } from "@playwright/test"

test.describe("Kanban Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=pages-kanban--default&viewMode=story")
    await page.waitForSelector("[data-slot='sidebar']")
  })

  test("renders sidebar navigation", async ({ page }) => {
    await expect(page.getByRole("button", { name: /工作区/ })).toBeVisible()
    await expect(page.getByRole("button", { name: "事项", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "设置" })).toBeVisible()
  })

  test("renders kanban columns", async ({ page }) => {
    await expect(page.getByText("待梳理")).toBeVisible()
    await expect(page.getByText("进行中")).toBeVisible()
    await expect(page.getByText("已完成")).toBeVisible()
  })

  test("renders task cards", async ({ page }) => {
    await expect(page.getByText("用户登录流程重构")).toBeVisible()
    await expect(page.getByText("KAN-101")).toBeVisible()
  })

  test("filter tabs switch correctly", async ({ page }) => {
    const memberTab = page.getByTestId("filter-member")
    await memberTab.click()

    // Member filter: only tasks with assignees shown
    // Agent tab should show empty
    const agentTab = page.getByTestId("filter-agent")
    await agentTab.click()
    await expect(page.getByText("无匹配结果")).toBeVisible()

    // Switch back to all
    const allTab = page.getByTestId("filter-all")
    await allTab.click()
    await expect(page.getByText("用户登录流程重构")).toBeVisible()
  })

  test("demo state controls work", async ({ page }) => {
    // Switch to loading state
    await page.getByText("加载中").click()
    await expect(page.locator(".animate-pulse").first()).toBeVisible()

    // Switch to error state
    await page.getByText("异常").click()
    await expect(page.getByText("数据加载失败")).toBeVisible()

    // Retry button goes back to normal
    await page.getByRole("button", { name: "重试" }).click()
    await expect(page.getByText("待梳理")).toBeVisible()
  })
})
