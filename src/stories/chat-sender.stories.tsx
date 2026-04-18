import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { ConfigProvider, useTranslation } from "@/components/config-provider"
import { buildChatSenderLabels } from "@/components/ui/chat/chat-i18n"
import { ChatSender, type Attachment, type MentionItem } from "@/components/ui/chat/chat-sender"
import { Button } from "@/components/ui/button"
import { Mic, Image } from "lucide-react"

const meta: Meta<typeof ChatSender> = {
  title: "Chat/Sender",
  component: ChatSender,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof ChatSender>

/* ------------------------------------------------------------------ */
/*  Basic                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    const [messages, setMessages] = useState<string[]>([])
    return (
      <div className="w-[480px]">
        {messages.length > 0 && (
          <div className="mb-3 flex flex-col gap-1 rounded-lg bg-muted p-3">
            {messages.map((m, i) => (
              <p key={i} className="text-xs">已发送: {m}</p>
            ))}
          </div>
        )}
        <ChatSender
          value={value}
          onChange={setValue}
          placeholder="输入消息… (Enter 发送)"
          onSubmit={(text) => {
            setMessages((prev) => [...prev, text])
            setValue("")
          }}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText("输入消息… (Enter 发送)")
    await expect(textarea).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "发送" })).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  With Suggestions                                                   */
/* ------------------------------------------------------------------ */

export const WithSuggestions: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          suggestions={["解释一下", "生成测试", "优化代码", "添加类型"]}
          suggestionLimit={3}
          onSuggestionClick={(s) => setValue(s)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: "打开快捷提示" })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "打开快捷提示" }))
    await expect(canvas.getByLabelText("应用提示 解释一下")).toBeInTheDocument()
    await expect(canvas.getByLabelText("应用提示 生成测试")).toBeInTheDocument()
    await userEvent.click(canvas.getByLabelText("应用提示 解释一下"))
    await expect(canvas.getByRole("textbox")).toHaveValue("解释一下")
  },
}

export const InlineSuggestions: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          suggestions={["继续写完", "补测试", "提炼 API", "输出边界说明"]}
          suggestionsVariant="inline"
          suggestionLimit={2}
          onSuggestionClick={(suggestion) => setValue(suggestion)}
        />
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  Loading / Stop                                                     */
/* ------------------------------------------------------------------ */

export const LoadingState: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(true)
    return (
      <div className="w-[480px]">
        <ChatSender
          value=""
          loading={loading}
          onCancel={() => setLoading(false)}
          footerText="AI 正在生成回复…"
        />
        {!loading && (
          <Button size="sm" className="mt-2" onClick={() => setLoading(true)}>
            重新触发 loading
          </Button>
        )}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("停止生成")).toBeInTheDocument()
    await expect(canvas.getByText("AI 正在生成回复…")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Disabled                                                           */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  render: () => (
    <div className="w-[480px]">
      <ChatSender disabled placeholder="暂时无法输入" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("textbox")).toBeDisabled()
    await expect(canvas.getByRole("button", { name: "发送" })).toBeDisabled()
  },
}

/* ------------------------------------------------------------------ */
/*  Custom Prefix/Suffix                                               */
/* ------------------------------------------------------------------ */

export const CustomSlots: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          leadingActions={
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <Image className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <Mic className="size-4" />
              </Button>
            </div>
          }
          showDefaultAttachmentButton
          statusActions={<span className="text-[10px] text-muted-foreground">上下文: 12k</span>}
          footerText="支持发送图片和语音"
        />
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode                                                  */
/* ------------------------------------------------------------------ */

export const Uncontrolled: Story = {
  render: function Render() {
    const [sent, setSent] = useState<string[]>([])
    return (
      <div className="w-[480px]">
        {sent.length > 0 && (
          <div className="mb-3 flex flex-col gap-1 rounded-lg bg-muted p-3">
            {sent.map((m, i) => (
              <p key={i} className="text-xs">已发送: {m}</p>
            ))}
          </div>
        )}
        <ChatSender
          defaultValue=""
          placeholder="不受控模式 — 内部管理状态"
          onSubmit={(text) => setSent((prev) => [...prev, text])}
          allowAttachment={false}
        />
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  Footer text                                                        */
/* ------------------------------------------------------------------ */

export const WithFooter: Story = {
  render: () => (
    <div className="w-[480px]">
      <ChatSender
        placeholder="输入问题…"
        footerText="AI 回复仅供参考，请以实际为准 · 模型: GPT-4o"
      />
    </div>
  ),
}

export const LocalizedWithProvider: Story = {
  render: function Render() {
    function LocalizedSender() {
      const [value, setValue] = useState("")
      const t = useTranslation()
      return (
        <div className="w-[480px]">
          <ChatSender
            value={value}
            onChange={setValue}
            suggestions={["Explain it", "Write tests", "Refine API", "Summarize changes"]}
            attachments={[
              { id: "1", name: "spec.md", type: "file", status: "done" },
              { id: "2", name: "wireframe.png", type: "image", status: "uploading", progress: 42 },
            ]}
            labels={buildChatSenderLabels(t)}
            footerText="Provider-backed locale labels"
          />
        </div>
      )
    }

    return (
      <ConfigProvider locale="en">
        <LocalizedSender />
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByPlaceholderText("Type a message…")).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Attachment Preview                                                 */
/* ------------------------------------------------------------------ */

const SAMPLE_ATTACHMENTS: Attachment[] = [
  { id: "1", name: "screenshot.png", type: "image", size: "256KB", previewUrl: "https://placehold.co/80x80/6c47ff/white?text=IMG", status: "done" },
  { id: "2", name: "document.pdf", type: "file", size: "1.2MB", status: "uploading", progress: 58 },
  { id: "3", name: "photo.jpg", type: "image", size: "512KB", status: "error", error: "网络超时" },
]

export const WithAttachments: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    const [attachments, setAttachments] = useState<Attachment[]>(SAMPLE_ATTACHMENTS)
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          attachments={attachments}
          onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
          onSubmit={(text, atts) => {
            alert(`发送: ${text}\n附件: ${atts?.map((a) => a.name).join(", ")}`)
            setValue("")
            setAttachments([])
          }}
          onAttach={() => {
            const id = `att-${Date.now()}`
            setAttachments((prev) => [...prev, { id, name: `新文件-${prev.length + 1}.txt`, type: "file" as const, size: "64KB" }])
          }}
          onRetryAttachment={(id) => {
            setAttachments((prev) =>
              prev.map((a) => (a.id === id ? { ...a, status: "uploading", progress: 30, error: undefined } : a)),
            )
          }}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("screenshot.png")).toBeInTheDocument()
    await expect(canvas.getByText("document.pdf")).toBeInTheDocument()
    await expect(canvas.getByText("photo.jpg")).toBeInTheDocument()
    // Verify remove button exists
    await expect(canvas.getByLabelText("移除 screenshot.png")).toBeInTheDocument()
  },
}

export const CompactAttachmentPreview: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[460px] space-y-2">
        <div className="rounded-lg border bg-muted/30 p-2 text-[11px] text-muted-foreground">
          只保留前两个附件卡片，其余附件折叠成摘要，避免 preview 模式把 sender 撑高。
        </div>
        <ChatSender
          value={value}
          onChange={setValue}
          attachmentDisplay="preview"
          maxVisibleAttachments={2}
          attachments={SAMPLE_ATTACHMENTS}
          leadingActionsVisibility="auto"
          trailingActionsVisibility="auto"
          leadingActions={
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <Mic className="size-3.5" />
            </Button>
          }
          trailingActions={
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <Image className="size-3.5" />
            </Button>
          }
        />
      </div>
    )
  },
}

export const DenseSummaryMode: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          density="dense"
          attachmentDisplay="summary"
          attachmentSummaryPlacement="input"
          attachmentSummaryDetail="compact"
          attachments={SAMPLE_ATTACHMENTS}
          suggestions={["继续处理", "补充边界", "输出结论"]}
          suggestionLimit={2}
          footerText="Dense 模式会优先保留输入区空间"
          footerTextPlacement="input"
          statusActionsPlacement="input"
          statusActions={<span className="text-[9px] text-muted-foreground">模型: GPT-4o</span>}
          leadingActions={
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <Mic className="size-3.5" />
            </Button>
          }
          trailingActions={
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <Image className="size-3.5" />
            </Button>
          }
          showDefaultAttachmentButton
        />
      </div>
    )
  },
}

export const LayoutControls: Story = {
  render: function Render() {
    const [value, setValue] = useState("请帮我继续收口这个工单")
    return (
      <div className="w-[520px] space-y-3">
        <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          这个变体展示更紧凑的 sender：默认动作合并成一组，建议项按需展开，附件摘要和模型信息都内联到底部操作区。
        </div>
        <ChatSender
          value={value}
          onChange={setValue}
          density="compact"
          minRows={1}
          maxRows={4}
          attachmentDisplay="summary"
          attachmentSummaryPlacement="input"
          attachmentSummaryDetail="compact"
          statusActionsPlacement="input"
          footerTextPlacement="input"
          attachments={[
            { id: "1", name: "context.md", type: "file", status: "done" },
            { id: "2", name: "wireframe.png", type: "image", status: "uploading", progress: 42 },
          ]}
          suggestions={["继续压缩布局", "加上 slash 命令", "生成回归测试", "精简附件摘要"]}
          suggestionLimit={2}
          footerText="仅保留必要说明"
          statusActions={<span className="text-[10px] text-muted-foreground">上下文 18k</span>}
        />
      </div>
    )
  },
}

export const CompactActionRail: Story = {
  render: function Render() {
    const [value, setValue] = useState("/")
    const [loading, setLoading] = useState(false)

    return (
      <div className="w-[440px] space-y-2">
        <div className="rounded-lg border bg-muted/30 p-2 text-[11px] text-muted-foreground">
          用于高密度聊天页：slash 激活时隐藏快捷提示入口，停止按钮收成 icon-only，命令面板也切到 dense。
        </div>
        <ChatSender
          value={value}
          onChange={setValue}
          density="dense"
          minRows={1}
          maxRows={3}
          loading={loading}
          onCancel={() => setLoading(false)}
          onSubmit={() => setLoading(true)}
          suggestions={["继续压缩", "补回归", "整理结论"]}
          suggestionTriggerVisibility="hidden"
          overlayDensity="dense"
          showStopLabel={false}
          attachmentDisplay="summary"
          attachmentSummaryPlacement="input"
          attachmentSummaryDetail="compact"
          attachments={[{ id: "1", name: "issue-compact.md", type: "file", status: "done" }]}
          footerText="保留主输入区"
          footerTextPlacement="input"
          statusActionsPlacement="input"
          statusActions={<span className="text-[9px] text-muted-foreground">上下文 12k</span>}
          showDefaultAttachmentButton
        />
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  @Mention                                                           */
/* ------------------------------------------------------------------ */

const MENTION_LIST: MentionItem[] = [
  { key: "file", label: "文件", description: "引用项目文件" },
  { key: "code", label: "代码块", description: "引用代码片段" },
  { key: "doc", label: "文档", description: "引用技术文档" },
  { key: "web", label: "网页", description: "引用网页内容" },
]

export const WithMentions: Story = {
  render: function Render() {
    const [value, setValue] = useState("@")
    return (
      <div className="w-[480px]">
        <p className="mb-2 text-xs text-muted-foreground">输入 @ 触发提及列表</p>
        <ChatSender
          value={value}
          onChange={setValue}
          mentions={MENTION_LIST}
          onMentionSelect={(item) => console.log("Mention selected:", item)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Mention dropdown should be visible because value starts with @
    await expect(canvas.getByText("@文件")).toBeInTheDocument()
    await expect(canvas.getByText("@代码块")).toBeInTheDocument()
    await expect(canvas.getByText("@文档")).toBeInTheDocument()
    await expect(canvas.getByText("@网页")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Full Featured                                                      */
/* ------------------------------------------------------------------ */

export const FullFeatured: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    const [attachments, setAttachments] = useState<Attachment[]>([
      { id: "1", name: "代码截图.png", type: "image", size: "128KB" },
    ])
    return (
      <div className="w-[480px]">
        <ChatSender
          value={value}
          onChange={setValue}
          suggestions={["解释代码", "写测试", "优化"]}
          onSuggestionClick={(s) => setValue(s)}
          attachments={attachments}
          onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
          mentions={MENTION_LIST}
          onAttach={() => {
            const id = `att-${Date.now()}`
            setAttachments((prev) => [...prev, { id, name: `文件-${prev.length + 1}.txt`, type: "file" as const }])
          }}
          footerText="AI 回复仅供参考 · 支持 @提及 和附件"
        />
      </div>
    )
  },
}
