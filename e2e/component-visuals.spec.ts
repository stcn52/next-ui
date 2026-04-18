import { expect, test } from "@playwright/test"
import {
  expectMediumScreenshot,
  expectPageScreenshot,
  expectPanelScreenshot,
  freezeVisualTime,
} from "./visual-test-helpers"

test.describe("Component visuals", () => {
  test.beforeEach(async ({ page }) => {
    await freezeVisualTime(page)
  })

  test("ChatConversations localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 720 })
    await page.goto("/iframe.html?id=chat-conversations--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()

    await expectMediumScreenshot(page.locator('[data-slot="chat-conversations"]'), "chat-conversations-localized.png")
  })

  test("ChatSender localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 620, height: 520 })
    await page.goto("/iframe.html?id=chat-sender--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expectMediumScreenshot(page.locator('[data-slot="chat-sender"]'), "chat-sender-localized.png")
  })

  test("ChatBubble localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 620, height: 620 })
    await page.goto("/iframe.html?id=chat-bubble--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-bubble"]').first()).toBeVisible()

    await expectMediumScreenshot(page.locator("body"), "chat-bubble-localized.png")
  })

  test("ChatPage localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 })
    await page.goto("/iframe.html?id=pages-chat--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expectPageScreenshot(page.locator("body"), "chat-page-localized.png")
  })

  test("ChatPage ultra-compact state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1380, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--ultra-compact&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()

    await expectPageScreenshot(page.locator("body"), "chat-page-ultra-compact.png")
  })

  test("ChatPage adaptive mid-width state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1380, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--adaptive-mid-width&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expectPageScreenshot(page.locator("body"), "chat-page-adaptive-mid-width.png")
  })

  test("ChatPage welcome state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--welcome&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expectPageScreenshot(page.locator("body"), "chat-page-welcome.png")
  })

  test("PromptLibrary localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 })
    await page.goto("/iframe.html?id=chat-promptlibrary--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="prompt-library"]')).toBeVisible()

    await expectMediumScreenshot(page.locator('[data-slot="prompt-library"]'), "prompt-library-localized.png")
  })

  test("FileManager localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 })
    await page.goto("/iframe.html?id=pages-filemanager--localized-with-provider&viewMode=story")
    await expect(page.getByPlaceholder("Search files/directories")).toBeVisible()

    await expectPageScreenshot(page.locator("body"), "file-manager-localized.png")
  })

  test("DatePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 720 })
    await page.goto("/iframe.html?id=ui-datepicker--with-preselected-date&viewMode=story")
    await page.getByRole("button").click()
    await expect(page.getByRole("grid")).toBeVisible()

    await expectPanelScreenshot(page.locator("body"), "date-picker-open.png")
  })

  test("DateRangePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1040, height: 760 })
    await page.goto("/iframe.html?id=ui-daterangepicker--with-preselected-range&viewMode=story")
    await page.getByRole("button").click()
    await expect(page.getByRole("grid").first()).toBeVisible()

    await expectPanelScreenshot(page.locator("body"), "date-range-picker-open.png")
  })

  test("DataTable default matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 720 })
    await page.goto("/iframe.html?id=ui-datatable--default&viewMode=story")
    await expect(page.locator('[data-slot="data-table"]')).toBeVisible()

    await expectMediumScreenshot(page.locator('[data-slot="data-table"]'), "data-table-default.png")
  })

  test("TimePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 420 })
    await page.goto("/iframe.html?id=ui-timepicker--with-default&viewMode=story")
    await page.getByRole("combobox").click()
    await expect(page.getByText("Done")).toBeVisible()

    await expectPanelScreenshot(page.locator("body"), "time-picker-open.png")
  })

  test("DateTimePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 860, height: 760 })
    await page.goto("/iframe.html?id=ui-datetimepicker--with-default&viewMode=story")
    await page.getByRole("combobox").click()
    await expect(page.getByText("Done")).toBeVisible()

    await expectPanelScreenshot(page.locator("body"), "date-time-picker-open.png")
  })
})
