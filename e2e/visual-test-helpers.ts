import { expect, type Locator, type Page } from "@playwright/test"

const FIXED_VISUAL_TIME = "2026-04-18T05:38:00.000Z"

const SCREENSHOT_BASE_OPTIONS = {
  animations: "disabled" as const,
  caret: "hide" as const,
  scale: "css" as const,
  // Allow minor Linux font rasterization drift without hiding real layout changes.
  threshold: 0.3,
}

const SCREENSHOT_OPTIONS = {
  panel: {
    ...SCREENSHOT_BASE_OPTIONS,
    maxDiffPixels: 2_500,
  },
  medium: {
    ...SCREENSHOT_BASE_OPTIONS,
    maxDiffPixels: 25_000,
  },
  page: {
    ...SCREENSHOT_BASE_OPTIONS,
    maxDiffPixels: 55_000,
  },
} as const

export async function freezeVisualTime(page: Page) {
  await page.addInitScript(({ fixedTime }) => {
    const OriginalDate = Date
    const fixedNow = OriginalDate.parse(fixedTime)

    class MockDate extends OriginalDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          super(fixedNow)
          return
        }
        super(...args)
      }

      static now() {
        return fixedNow
      }
    }

    MockDate.UTC = OriginalDate.UTC
    MockDate.parse = OriginalDate.parse
    MockDate.prototype = OriginalDate.prototype

    window.Date = MockDate as DateConstructor
  }, { fixedTime: FIXED_VISUAL_TIME })
}

export async function expectPanelScreenshot(locator: Locator, name: string) {
  await expect(locator).toHaveScreenshot(name, SCREENSHOT_OPTIONS.panel)
}

export async function expectMediumScreenshot(locator: Locator, name: string) {
  await expect(locator).toHaveScreenshot(name, SCREENSHOT_OPTIONS.medium)
}

export async function expectPageScreenshot(locator: Locator, name: string) {
  await expect(locator).toHaveScreenshot(name, SCREENSHOT_OPTIONS.page)
}
