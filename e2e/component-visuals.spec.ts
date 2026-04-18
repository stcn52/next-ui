import { expect, test } from "@playwright/test"

test.describe("Component visuals", () => {
  test("ChatConversations localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 720 })
    await page.goto("/iframe.html?id=chat-conversations--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()

    await expect(page.locator('[data-slot="chat-conversations"]')).toHaveScreenshot("chat-conversations-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatSender localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 620, height: 520 })
    await page.goto("/iframe.html?id=chat-sender--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expect(page.locator('[data-slot="chat-sender"]')).toHaveScreenshot("chat-sender-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatBubble localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 620, height: 620 })
    await page.goto("/iframe.html?id=chat-bubble--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-bubble"]').first()).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("chat-bubble-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatPage localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 })
    await page.goto("/iframe.html?id=pages-chat--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("chat-page-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatPage ultra-compact state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1380, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--ultra-compact&viewMode=story")
    await expect(page.locator('[data-slot="chat-conversations"]')).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("chat-page-ultra-compact.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatPage adaptive mid-width state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1380, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--adaptive-mid-width&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("chat-page-adaptive-mid-width.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("ChatPage welcome state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 920 })
    await page.goto("/iframe.html?id=pages-chat--welcome&viewMode=story")
    await expect(page.locator('[data-slot="chat-sender"]')).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("chat-page-welcome.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("PromptLibrary localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 })
    await page.goto("/iframe.html?id=chat-promptlibrary--localized-with-provider&viewMode=story")
    await expect(page.locator('[data-slot="prompt-library"]')).toBeVisible()

    await expect(page.locator('[data-slot="prompt-library"]')).toHaveScreenshot("prompt-library-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("FileManager localized state matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 })
    await page.goto("/iframe.html?id=pages-filemanager--localized-with-provider&viewMode=story")
    await expect(page.getByPlaceholder("Search files/directories")).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("file-manager-localized.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("DatePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 720 })
    await page.goto("/iframe.html?id=ui-datepicker--with-preselected-date&viewMode=story")
    await page.getByRole("button").click()
    await expect(page.getByRole("grid")).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("date-picker-open.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("DateRangePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1040, height: 760 })
    await page.goto("/iframe.html?id=ui-daterangepicker--with-preselected-range&viewMode=story")
    await page.getByRole("button").click()
    await expect(page.getByRole("grid").first()).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("date-range-picker-open.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("DataTable default matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 720 })
    await page.goto("/iframe.html?id=ui-datatable--default&viewMode=story")
    await expect(page.locator('[data-slot="data-table"]')).toBeVisible()

    await expect(page.locator('[data-slot="data-table"]')).toHaveScreenshot("data-table-default.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("TimePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 420 })
    await page.goto("/iframe.html?id=ui-timepicker--with-default&viewMode=story")
    await page.getByRole("combobox").click()
    await expect(page.getByText("Done")).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("time-picker-open.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })

  test("DateTimePicker open panel matches the visual baseline", async ({ page }) => {
    await page.setViewportSize({ width: 860, height: 760 })
    await page.goto("/iframe.html?id=ui-datetimepicker--with-default&viewMode=story")
    await page.getByRole("combobox").click()
    await expect(page.getByText("Done")).toBeVisible()

    await expect(page.locator("body")).toHaveScreenshot("date-time-picker-open.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    })
  })
})
