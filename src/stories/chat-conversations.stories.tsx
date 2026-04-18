import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import {
  ConfigProvider,
  resolveLocale,
  useTranslation,
} from "@/components/config-provider"
import { ChatConversations, type ConversationItem } from "@/components/ui/chat/chat-conversations"
import { buildChatConversationsLabels } from "@/components/ui/chat/chat-i18n"
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

const zh = resolveLocale("zh-CN")
const en = resolveLocale("en")

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

function buildConversationItems(t: (key: string, vars?: Record<string, string | number>) => string): ConversationItem[] {
  return [
    { key: "1", label: t("chatPageConversation1Label"), description: t("chatPageConversation1Description"), time: "10:30", unread: 2, group: t("chatPageConversation1Group") },
    { key: "2", label: t("chatPageConversation2Label"), description: t("chatPageConversation2Description"), time: "09:15", group: t("chatPageConversation2Group") },
    { key: "3", label: t("chatPageConversation3Label"), description: t("chatPageConversation3Description"), time: t("chatPageConversation3Time"), group: t("chatPageConversation3Group") },
    { key: "4", label: t("chatPageConversation4Label"), description: t("chatPageConversation4Description"), time: t("chatPageConversation4Time"), group: t("chatPageConversation4Group") },
    { key: "5", label: t("chatPageConversation5Label"), description: t("chatPageConversation5Description"), time: t("chatPageConversation5Time"), group: t("chatPageConversation5Group") },
  ]
}

function LocalizedConversationList({
  containerClassName = "h-[500px] w-72 rounded-xl border",
  className = "h-full",
  title,
  searchable = true,
  groupable = true,
  density,
  showTitle,
  showNewChatButton,
  searchMode,
  showDescription,
  showAvatar,
  showTime,
  showGroupCount,
  collapsibleGroups,
}: {
  containerClassName?: string
  className?: string
  title?: string
  searchable?: boolean
  groupable?: boolean
  density?: "compact" | "dense"
  showTitle?: boolean
  showNewChatButton?: boolean
  searchMode?: "bar" | "trigger"
  showDescription?: boolean
  showAvatar?: boolean
  showTime?: boolean
  showGroupCount?: boolean
  collapsibleGroups?: boolean
}) {
  const [active, setActive] = useState("1")
  const t = useTranslation()
  return (
    <div className={containerClassName}>
      <ChatConversations
        items={buildConversationItems(t)}
        activeKey={active}
        onChange={(key) => setActive(key)}
        onNewChat={() => setActive("new")}
        labels={buildChatConversationsLabels(t)}
        title={title}
        searchable={searchable}
        groupable={groupable}
        density={density}
        showTitle={showTitle}
        showNewChatButton={showNewChatButton}
        searchMode={searchMode}
        showDescription={showDescription}
        showAvatar={showAvatar}
        showTime={showTime}
        showGroupCount={showGroupCount}
        collapsibleGroups={collapsibleGroups}
        className={className}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Default                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(zh.conversationTitle)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageConversation1Label)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageConversation2Label)).toBeInTheDocument()
    await expect(canvas.getByText("2")).toBeInTheDocument() // unread badge
  },
}

/* ------------------------------------------------------------------ */
/*  Grouped                                                            */
/* ------------------------------------------------------------------ */

export const Grouped: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(zh.chatPageConversation1Group)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageConversation5Group)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageConversation5Time)).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export const Searchable: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const search = canvas.getByPlaceholderText(zh.conversationSearchPlaceholder)
    await userEvent.type(search, "翻译")
    await expect(canvas.getByText(zh.chatPageConversation2Label)).toBeInTheDocument()
    // Other items should be filtered out
    await expect(canvas.queryByText(zh.chatPageConversation1Label)).toBeNull()
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
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList title="对话历史" searchable={false} containerClassName="h-[400px] w-72 rounded-xl border" />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("对话历史")).toBeInTheDocument()
    await expect(canvas.queryByPlaceholderText(zh.conversationSearchPlaceholder)).toBeNull()
  },
}

export const LocalizedWithProvider: Story = {
  render: () => (
    <ConfigProvider locale="en">
      <LocalizedConversationList />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(en.conversationTitle)).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText(en.conversationSearchPlaceholder)).toBeInTheDocument()
    await expect(canvas.getByText(en.chatPageConversation3Time)).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  No grouping                                                        */
/* ------------------------------------------------------------------ */

export const Flat: Story = {
  name: "FlatList (no grouping)",
  render: () => (
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList groupable={false} containerClassName="h-[400px] w-72 rounded-xl border" />
    </ConfigProvider>
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

/* ------------------------------------------------------------------ */
/*  Minimal Chrome                                                     */
/* ------------------------------------------------------------------ */

export const MinimalChrome: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <LocalizedConversationList
        containerClassName="h-[420px] w-56 rounded-xl border"
        className="h-full"
        density="dense"
        showTitle={false}
        showNewChatButton={false}
        searchMode="trigger"
        showDescription={false}
        showAvatar={false}
        showTime={false}
        showGroupCount={false}
        collapsibleGroups
      />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText("会话列表")).toBeNull()
    await expect(canvas.queryByPlaceholderText("搜索会话…")).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: "打开搜索会话" }))
    await expect(canvas.getByPlaceholderText("搜索会话…")).toBeInTheDocument()
  },
}
