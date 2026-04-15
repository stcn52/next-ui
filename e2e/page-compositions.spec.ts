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

  test("analytics page renders KPIs and tabs", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=pages-analytics--default&viewMode=story",
    )

    await expect(page.getByText("Analytics")).toBeVisible()
    await expect(page.getByText("45,231")).toBeVisible()
    await expect(page.getByText("Total Visitors")).toBeVisible()
    await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible()
    await expect(page.getByRole("tab", { name: "Top Pages" })).toBeVisible()
  })

  test("theme import playground parses CSS", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=docs-theme-import--playground&viewMode=story",
    )

    await expect(page.getByText("主题导入")).toBeVisible()
    await page.getByRole("button", { name: "解析 CSS" }).click()
    await expect(page.getByText("Light 模式")).toBeVisible()
  })

  test("inbox page renders emails and preview pane", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-inbox--default&viewMode=story")

    await expect(page.getByText("收件箱")).toBeVisible()
    await expect(
      page.getByText("[next-ui] New pull request #42").first(),
    ).toBeVisible()
    // Click second email to open preview
    await page
      .getByText("Deployment successful: next-ui-docs")
      .click()
    await expect(
      page.getByText("Your deployment for next-ui-docs was successful."),
    ).toBeVisible()
  })

  test("projects page renders cards and filters", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=pages-projects--default&viewMode=story",
    )

    await expect(page.getByText("项目").first()).toBeVisible()
    await expect(page.getByText("next-ui")).toBeVisible()
    await expect(page.getByText("API Gateway")).toBeVisible()
  })

  test("orders page renders table and KPIs", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-orders--default&viewMode=story")

    await expect(page.getByText("订单管理")).toBeVisible()
    await expect(page.getByText("ORD-001")).toBeVisible()
    await expect(page.getByText("¥59,693")).toBeVisible()
  })

  test("blog page renders featured post and articles", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-blog--default&viewMode=story")

    await expect(page.getByText("博客")).toBeVisible()
    await expect(page.getByText("构建可扩展的 React 组件库")).toBeVisible()
    await expect(page.getByText("精选")).toBeVisible()
  })

  test("landing page renders hero and features", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-landing--default&viewMode=story")

    await expect(page.getByText("构建精美 React 应用")).toBeVisible()
    await expect(page.getByText("50+ 组件")).toBeVisible()
    await expect(page.getByText("用户评价")).toBeVisible()
  })

  test("team page renders members and role badges", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-team--default&viewMode=story")

    await expect(page.getByText("团队管理")).toBeVisible()
    await expect(page.getByText("Chen Yang")).toBeVisible()
    await expect(page.getByRole("heading", { name: "邀请新成员" })).toBeVisible()
  })

  test("faq page renders questions and accordion", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-faq--default&viewMode=story")

    await expect(page.getByText("常见问题")).toBeVisible()
    await expect(page.getByText("如何安装 next-ui？")).toBeVisible()
  })

  test("changelog page renders version timeline", async ({ page }) => {
    await page.goto("/iframe.html?id=pages-changelog--default&viewMode=story")

    await expect(page.getByText("更新日志")).toBeVisible()
    await expect(page.getByText("v0.2.0")).toBeVisible()
    await expect(page.getByText("v0.1.0")).toBeVisible()
  })
})
