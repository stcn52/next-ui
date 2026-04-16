/**
 * User List Page — DataTable with avatar, role badges, actions dropdown.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  ConfigProvider,
  useTranslation,
} from "@/components/config-provider"
import { UserListPage } from "@/components/pages/user-list-page"
import { USERS } from "@/components/pages/user-list-page.data"
import { Card, CardContent } from "@/components/ui/card"

const meta: Meta = {
  title: "Pages/UserList",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "User management page with searchable table, role badges, avatar, bulk selection, and actions dropdown.",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  name: "User List",
  render: () => (
    <ConfigProvider locale="zh-CN">
      <UserListPage />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("用户管理")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索用户…")).toBeInTheDocument()
    await expect(canvas.getAllByRole("row").length).toBeGreaterThan(1)
  },
}

export const EnglishLocale: Story = {
  name: "User List (en)",
  render: () => (
    <ConfigProvider locale="en">
      <UserListPage />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("User Management")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("Search users…")).toBeInTheDocument()
  },
}

/* Stats cards above the table */
function UserStats() {
  const t = useTranslation()
  const stats = [
    { label: t("userStatsTotal"), value: USERS.length },
    { label: t("userStatsAdmin"), value: USERS.filter((u) => u.role === "admin").length },
    { label: t("userStatsActive"), value: USERS.filter((u) => u.status === "active").length },
    { label: t("userStatsInactive"), value: USERS.filter((u) => u.status === "inactive").length },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 p-5 max-w-5xl mx-auto">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const Stats: Story = {
  name: "User Stats",
  render: () => (
    <ConfigProvider locale="zh-CN">
      <UserStats />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("总用户")).toBeInTheDocument()
    await expect(canvas.getByText(String(USERS.length))).toBeInTheDocument()
  },
}
