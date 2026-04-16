/**
 * JsonViewer Stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { JsonViewer } from "@/components/ui/json-viewer"

const meta: Meta<typeof JsonViewer> = {
  title: "Components/JsonViewer",
  component: JsonViewer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof JsonViewer>

// ─── Sample data ──────────────────────────────────────────────────────────────

const USER = {
  id: 42,
  name: "陈宇",
  email: "chenyu@example.com",
  active: true,
  score: 9.8,
  address: {
    city: "上海",
    district: "浦东新区",
    zip: "200120",
  },
  tags: ["工程师", "架构师", "开源"],
  meta: null,
}

const API_RESPONSE = {
  code: 200,
  message: "success",
  data: {
    total: 3,
    items: [
      { id: 1, title: "第一项", done: false },
      { id: 2, title: "第二项", done: true },
      { id: 3, title: "第三项", done: false },
    ],
    pagination: { page: 1, pageSize: 10, totalPages: 1 },
  },
  timestamp: 1714300000000,
}

/** 用户对象 */
export const UserObject: Story = {
  render: () => (
    <div className="w-96">
      <JsonViewer data={USER} />
    </div>
  ),
}

/** API 响应（展开至第 2 层） */
export const ApiResponse: Story = {
  render: () => (
    <div className="w-96">
      <JsonViewer data={API_RESPONSE} maxDepth={2} />
    </div>
  ),
}

/** 初始折叠 */
export const InitiallyCollapsed: Story = {
  render: () => (
    <div className="w-96">
      <JsonViewer data={USER} expanded={false} />
    </div>
  ),
}

/** 数组根节点 */
export const ArrayRoot: Story = {
  render: () => (
    <div className="w-80">
      <JsonViewer data={["alpha", "beta", "gamma", 42, true, null]} />
    </div>
  ),
}

/** 基本类型 */
export const Primitives: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <JsonViewer data="Hello, 世界" />
      <JsonViewer data={3.14159} />
      <JsonViewer data={false} />
      <JsonViewer data={null} />
    </div>
  ),
}
