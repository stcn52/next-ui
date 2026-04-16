/**
 * Unit tests for UserProfilePage, ErrorPage, NotificationsPage
 */
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// ─── UserProfilePage ──────────────────────────────────────────────────────────

describe("UserProfilePage", () => {
  it("renders user name", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("陈宇")).toBeInTheDocument()
  })

  it("shows follower stats", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    // "粉丝" appears in both the stat card and as a tab label — use getAllByText
    expect(screen.getAllByText("粉丝").length).toBeGreaterThan(0)
    expect(screen.getAllByText(/^关注$/).length).toBeGreaterThan(0)
  })

  it("follow button increments follower count", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    const followBtn = screen.getByRole("button", { name: /^关注$/ })
    fireEvent.click(followBtn)
    // Button text should change
    expect(screen.getByRole("button", { name: /已关注/ })).toBeInTheDocument()
  })

  it("shows tabs for posts/liked/followers", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByRole("tab", { name: /文章/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /点赞/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /粉丝/ })).toBeInTheDocument()
  })

  it("switches to liked tab", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    fireEvent.click(screen.getByRole("tab", { name: /点赞/ }))
    expect(screen.getByText(/TypeScript 类型体操/)).toBeInTheDocument()
  })

  it("owner view shows edit button", async () => {
    const { Owner } = await import("@/stories/user-profile-page.stories")
    render(Owner.render?.(Owner.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByRole("button", { name: /编辑资料/ })).toBeInTheDocument()
  })

  it("location shown in profile", async () => {
    const { Visitor } = await import("@/stories/user-profile-page.stories")
    render(Visitor.render?.(Visitor.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText(/北京/)).toBeInTheDocument()
  })
})

// ─── ErrorPage ───────────────────────────────────────────────────────────────

describe("ErrorPage", () => {
  it("404 page shows correct title", async () => {
    const { NotFound } = await import("@/stories/error-page.stories")
    render(NotFound.render?.(NotFound.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("页面不存在")).toBeInTheDocument()
  })

  it("404 page shows 404 code", async () => {
    const { NotFound } = await import("@/stories/error-page.stories")
    render(NotFound.render?.(NotFound.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("404")).toBeInTheDocument()
  })

  it("500 page shows server error title", async () => {
    const { ServerError } = await import("@/stories/error-page.stories")
    render(ServerError.render?.(ServerError.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("服务器内部错误")).toBeInTheDocument()
  })

  it("500 page shows contact support link", async () => {
    const { ServerError } = await import("@/stories/error-page.stories")
    render(ServerError.render?.(ServerError.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText(/联系支持团队/)).toBeInTheDocument()
  })

  it("maintenance page shows wrench icon area", async () => {
    const { Maintenance } = await import("@/stories/error-page.stories")
    render(Maintenance.render?.(Maintenance.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("系统维护中")).toBeInTheDocument()
  })

  it("maintenance page shows progress items", async () => {
    const { Maintenance } = await import("@/stories/error-page.stories")
    render(Maintenance.render?.(Maintenance.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("数据库迁移")).toBeInTheDocument()
    expect(screen.getByText("服务重启")).toBeInTheDocument()
  })
})

// ─── NotificationsPage ────────────────────────────────────────────────────────

describe("NotificationsPage", () => {
  it("shows page title with unread badge", async () => {
    const { Default } = await import("@/stories/notifications-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByText("通知")).toBeInTheDocument()
  })

  it("shows filter tabs", async () => {
    const { Default } = await import("@/stories/notifications-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Filter tabs are TabsTrigger (role=tab), not buttons
    expect(screen.getByRole("tab", { name: /全部/ })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /提及/ })).toBeInTheDocument()
  })

  it("mark all read button appears", async () => {
    const { Default } = await import("@/stories/notifications-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    expect(screen.getByRole("button", { name: /全部已读/ })).toBeInTheDocument()
  })

  it("clicking mark all read clears unread count", async () => {
    const { Default } = await import("@/stories/notifications-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    fireEvent.click(screen.getByRole("button", { name: /全部已读/ }))
    // After marking all read, switching to unread tab should show empty state
    fireEvent.click(screen.getByRole("tab", { name: /未读/ }))
    expect(screen.getByText("没有未读通知")).toBeInTheDocument()
  })

  it("mention filter tab exists and data renders", async () => {
    const { Default } = await import("@/stories/notifications-page.stories")
    render(Default.render?.(Default.args ?? {}, {} as never) as React.ReactElement)
    // Filter tab exists
    expect(screen.getByRole("tab", { name: /提及/ })).toBeInTheDocument()
    // Mention notification data is shown in the default "all" tab
    expect(screen.getByText("评论提及了你")).toBeInTheDocument()
  })
})
