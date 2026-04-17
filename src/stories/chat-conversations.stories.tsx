import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { ChatConversations, type ConversationItem } from "@/components/ui/chat/chat-conversations"
import { MessageCircle, Code, Languages, FileSpreadsheet, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"

const meta: Meta<typeof ChatConversations> = {
  title: "Chat/Conversations",
  component: ChatConversations,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof ChatConversations>

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ITEMS: ConversationItem[] = [
  { key: "1", label: "AI 编码助手", description: "已为你生成代码片段…", time: "10:30", unread: 2, group: "今天" },
  { key: "2", label: "翻译助手", description: "翻译已完成", time: "09:15", group: "今天" },
  { key: "3", label: "PPT 大纲生成", description: "大纲内容如下…", time: "昨天", group: "昨天" },
  { key: "4", label: "数据分析报告", description: "报告已生成，请查收。", time: "昨天", group: "昨天" },
  { key: "5", label: "学习计划", description: "推荐以下学习路径…", time: "3天前", group: "更早" },
]

/* ------------------------------------------------------------------ */
/*  Default                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: function Render() {
    const [active, setActive] = useState("1")
    return (
      <div className="h-[500px] w-72 rounded-xl border">
        <ChatConversations
          items={ITEMS}
          activeKey={active}
          onChange={(key) => setActive(key)}
          onNewChat={() => setActive("new")}
          className="h-full"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("会话列表")).toBeInTheDocument()
    await expect(canvas.getByText("AI 编码助手")).toBeInTheDocument()
    await expect(canvas.getByText("翻译助手")).toBeInTheDocument()
    await expect(canvas.getByText("2")).toBeInTheDocument() // unread badge
  },
}

/* ------------------------------------------------------------------ */
/*  Grouped                                                            */
/* ------------------------------------------------------------------ */

export const Grouped: Story = {
  render: () => (
    <div className="h-[500px] w-72 rounded-xl border">
      <ChatConversations items={ITEMS} className="h-full" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("今天")).toBeInTheDocument()
    await expect(canvas.getByText("更早")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export const Searchable: Story = {
  render: function Render() {
    const [active, setActive] = useState("1")
    return (
      <div className="h-[500px] w-72 rounded-xl border">
        <ChatConversations
          items={ITEMS}
          activeKey={active}
          onChange={(key) => setActive(key)}
          className="h-full"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const search = canvas.getByPlaceholderText("搜索会话…")
    await userEvent.type(search, "翻译")
    await expect(canvas.getByText("翻译助手")).toBeInTheDocument()
    // Other items should be filtered out
    await expect(canvas.queryByText("AI 编码助手")).toBeNull()
  },
}

/* ------------------------------------------------------------------ */
/*  Custom icons                                                       */
/* ------------------------------------------------------------------ */

const CUSTOM_ICON_ITEMS: ConversationItem[] = [
  {
    key: "1",
    label: "通用对话",
    description: "闲聊…",
    time: "刚刚",
    group: "今天",
    icon: (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
          <MessageCircle className="size-3.5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    key: "2",
    label: "代码生成",
    description: "已生成组件",
    time: "10:30",
    group: "今天",
    icon: (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
          <Code className="size-3.5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    key: "3",
    label: "翻译",
    description: "EN → ZH",
    time: "昨天",
    group: "昨天",
    icon: (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xs">
          <Languages className="size-3.5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    key: "4",
    label: "数据分析",
    description: "CSV 已解析",
    time: "3天前",
    group: "更早",
    icon: (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
          <FileSpreadsheet className="size-3.5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    key: "5",
    label: "学习计划",
    description: "进度 60%",
    time: "上周",
    group: "更早",
    icon: (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
          <BookOpen className="size-3.5" />
        </AvatarFallback>
      </Avatar>
    ),
  },
]

export const CustomIcons: Story = {
  render: function Render() {
    const [active, setActive] = useState("1")
    return (
      <div className="h-[500px] w-72 rounded-xl border">
        <ChatConversations
          items={CUSTOM_ICON_ITEMS}
          activeKey={active}
          onChange={(key) => setActive(key)}
          onNewChat={() => setActive("new")}
          className="h-full"
        />
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  Custom title, no search                                            */
/* ------------------------------------------------------------------ */

export const CustomTitle: Story = {
  render: () => (
    <div className="h-[400px] w-72 rounded-xl border">
      <ChatConversations
        items={ITEMS}
        title="对话历史"
        searchable={false}
        className="h-full"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("对话历史")).toBeInTheDocument()
    await expect(canvas.queryByPlaceholderText("搜索会话…")).toBeNull()
  },
}

/* ------------------------------------------------------------------ */
/*  No grouping                                                        */
/* ------------------------------------------------------------------ */

export const Flat: Story = {
  name: "FlatList (no grouping)",
  render: () => (
    <div className="h-[400px] w-72 rounded-xl border">
      <ChatConversations
        items={ITEMS}
        groupable={false}
        className="h-full"
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

export const DisabledItems: Story = {
  render: function Render() {
    const items: ConversationItem[] = [
      { key: "1", label: "可用对话", description: "正常可点击" },
      { key: "2", label: "已归档", description: "不可操作", disabled: true },
      { key: "3", label: "另一个对话", description: "正常可点击" },
    ]
    const [active, setActive] = useState("1")
    return (
      <div className="h-[300px] w-72 rounded-xl border">
        <ChatConversations
          items={items}
          activeKey={active}
          onChange={(key) => setActive(key)}
          groupable={false}
          className="h-full"
        />
      </div>
    )
  },
}
