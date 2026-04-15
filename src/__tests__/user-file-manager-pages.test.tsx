import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ConfigProvider } from "@/components/config-provider"
import { UserListPage } from "@/components/pages/user-list-page"
import { FileManagerPage } from "@/components/pages/file-manager-page"

describe("UserListPage i18n", () => {
  it("renders zh-CN labels", () => {
    render(
      <ConfigProvider locale="zh-CN">
        <UserListPage />
      </ConfigProvider>,
    )

    expect(screen.getByText("用户管理")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索用户…")).toBeInTheDocument()
  })

  it("renders en labels", () => {
    render(
      <ConfigProvider locale="en">
        <UserListPage />
      </ConfigProvider>,
    )

    expect(screen.getByText("User Management")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search users…")).toBeInTheDocument()
  })

  it("filters users by search input", async () => {
    const user = userEvent.setup()
    render(
      <ConfigProvider locale="en">
        <UserListPage />
      </ConfigProvider>,
    )

    const search = screen.getByPlaceholderText("Search users…")
    await user.type(search, "not-found")

    expect(screen.getByText("No matching users")).toBeInTheDocument()
  })
})

describe("FileManagerPage i18n", () => {
  it("renders ja-JP labels", () => {
    render(
      <ConfigProvider locale="ja-JP">
        <FileManagerPage />
      </ConfigProvider>,
    )

    expect(screen.getByText("ファイルマネージャー")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("ファイルを検索…")).toBeInTheDocument()
  })

  it("shows empty state after filtering", async () => {
    const user = userEvent.setup()
    render(
      <ConfigProvider locale="en">
        <FileManagerPage />
      </ConfigProvider>,
    )

    const search = screen.getByPlaceholderText("Search files…")
    await user.type(search, "zzz-no-file")

    expect(screen.getByText("No matching files")).toBeInTheDocument()
  })
})
