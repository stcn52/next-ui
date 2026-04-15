import { expect, test } from "@playwright/test"

test.describe("Composite Pages", () => {
  test("chat page story renders and accepts draft input", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-chat--default&viewMode=story")

    await expect(page.getByText("会话列表")).toBeVisible()

    const input = page.getByPlaceholder("输入消息…")
    await expect(input).toBeVisible()
    await expect(page.getByRole("button", { name: "发送" })).toBeVisible()
  })

  test("calendar page story renders events", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-calendar--default&viewMode=story")

    await expect(page.getByText("团队日历")).toBeVisible()
    await expect(page.getByText("版本发布评审")).toBeVisible()
  })

  test("pricing page story renders plan cards", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-pricing--default&viewMode=story")

    await expect(page.getByText("选择适合你的方案")).toBeVisible()
    await expect(page.getByText(/^Pro$/)).toBeVisible()
    await expect(page.getByText("升级到 Pro")).toBeVisible()
  })
})
