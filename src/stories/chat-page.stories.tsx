import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { cn } from "@/lib/utils"
import {
  ConfigProvider,
  resolveLocale,
  useTranslation,
} from "@/components/config-provider"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Button } from "@/components/ui/button"
import {
  buildChatBubbleLabels,
  buildChatCommandPaletteTexts,
  buildChatConversationsLabels,
  buildChatPresenceLabels,
  buildChatSenderLabels,
} from "@/components/ui/chat/chat-i18n"
import {
  Bubble,
  type BubbleProps,
  TypingIndicator,
} from "@/components/ui/chat/chat-bubble"
import {
  ChatCommandPalette,
  type ChatCommandItem,
} from "@/components/ui/chat/chat-command-palette"
import { ChatPresence } from "@/components/ui/chat/chat-presence"
import { ChatConversations, type ConversationItem } from "@/components/ui/chat/chat-conversations"
import { ChatSender, type Attachment, type MentionItem } from "@/components/ui/chat/chat-sender"
import {
  PromptLibrary,
  type PromptLibraryApplyResult,
  type PromptLibraryItem,
} from "@/components/ui/prompt-library"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlays/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select"
import { Bot, FileText, FileUp, Image, Search, Sparkles, X } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  status?: "sending" | "sent" | "error"
  thinking?: string[]
  streaming?: boolean
  model?: string
}

type ToolPanel = "prompts" | "commands" | null

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "claude-4", label: "Claude Opus 4" },
  { id: "deepseek-v3", label: "DeepSeek V3" },
]
function buildLocalizedChatPageContent(t: (key: string, vars?: Record<string, string | number>) => string) {
  return {
    conversations: [
      { key: "1", label: t("chatPageConversation1Label"), description: t("chatPageConversation1Description"), time: "10:30", unread: 2, group: t("chatPageConversation1Group") },
      { key: "2", label: t("chatPageConversation2Label"), description: t("chatPageConversation2Description"), time: "09:15", group: t("chatPageConversation2Group") },
      { key: "3", label: t("chatPageConversation3Label"), description: t("chatPageConversation3Description"), time: t("chatPageConversation3Time"), group: t("chatPageConversation3Group") },
      { key: "4", label: t("chatPageConversation4Label"), description: t("chatPageConversation4Description"), time: t("chatPageConversation4Time"), group: t("chatPageConversation4Group") },
      { key: "5", label: t("chatPageConversation5Label"), description: t("chatPageConversation5Description"), time: t("chatPageConversation5Time"), group: t("chatPageConversation5Group") },
    ] satisfies ConversationItem[],
    initialMessages: [
      { id: "sys-1", role: "system", content: t("chatPageSystemToday"), timestamp: "" },
      { id: "m1", role: "assistant", content: t("chatPageAssistantGreeting"), timestamp: "10:00", model: "gpt-4o" },
      { id: "m2", role: "user", content: t("chatPageUserDebouncePrompt"), timestamp: "10:05", status: "sent" },
      {
        id: "m3",
        role: "assistant",
        content: t("chatPageAssistantDebounceReply"),
        timestamp: "10:05",
        thinking: [
          t("chatPageAssistantDebounceThinking1"),
          t("chatPageAssistantDebounceThinking2"),
          t("chatPageAssistantDebounceThinking3"),
        ],
        model: "gpt-4o",
      },
      { id: "m4", role: "user", content: t("chatPageUserLoadingPrompt"), timestamp: "10:28", status: "sent" },
      {
        id: "m5",
        role: "assistant",
        content: t("chatPageAssistantLoadingReply"),
        timestamp: "10:30",
        thinking: [
          t("chatPageAssistantLoadingThinking1"),
          t("chatPageAssistantLoadingThinking2"),
          t("chatPageAssistantLoadingThinking3"),
          t("chatPageAssistantLoadingThinking4"),
        ],
        model: "gpt-4o",
      },
    ] satisfies ChatMessage[],
    promptSuggestions: [
      { icon: "💡", text: t("chatPagePromptSuggestion1") },
      { icon: "🔍", text: t("chatPagePromptSuggestion2") },
      { icon: "🧪", text: t("chatPagePromptSuggestion3") },
      { icon: "📝", text: t("chatPagePromptSuggestion4") },
    ],
    quickReplies: [
      t("chatPageQuickReply1"),
      t("chatPageQuickReply2"),
      t("chatPageQuickReply3"),
    ],
    mentionItems: [
      { key: "file", label: t("chatPageMentionFileLabel"), description: t("chatPageMentionFileDescription") },
      { key: "code", label: t("chatPageMentionCodeLabel"), description: t("chatPageMentionCodeDescription") },
      { key: "doc", label: t("chatPageMentionDocLabel"), description: t("chatPageMentionDocDescription") },
      { key: "web", label: t("chatPageMentionWebLabel"), description: t("chatPageMentionWebDescription") },
    ] satisfies MentionItem[],
    commandItems: [
      { key: "model-gpt-4o", label: t("chatPageCommandModelGpt4oLabel"), description: t("chatPageCommandModelGpt4oDescription"), group: t("chatPageCommandModelGroup"), icon: <Bot className="size-4" />, keywords: ["model", "gpt", "4o"] },
      { key: "model-claude-4", label: t("chatPageCommandModelClaudeLabel"), description: t("chatPageCommandModelClaudeDescription"), group: t("chatPageCommandModelGroup"), icon: <Sparkles className="size-4" />, keywords: ["model", "claude", "opus"] },
      { key: "context-file", label: t("chatPageCommandContextFileLabel"), description: t("chatPageCommandContextFileDescription"), group: t("chatPageCommandContextGroup"), icon: <FileText className="size-4" />, keywords: ["file", "context", "attachment"] },
      { key: "context-ticket", label: t("chatPageCommandContextTicketLabel"), description: t("chatPageCommandContextTicketDescription"), group: t("chatPageCommandContextGroup"), icon: <FileUp className="size-4" />, keywords: ["ticket", "requirement", "layout"] },
      { key: "prompt-compact-layout", label: t("chatPageCommandPromptCompactLabel"), description: t("chatPageCommandPromptCompactDescription"), group: t("chatPageCommandPromptGroup"), icon: <Sparkles className="size-4" />, keywords: ["prompt", "layout", "compact"] },
      { key: "prompt-tests", label: t("chatPageCommandPromptTestsLabel"), description: t("chatPageCommandPromptTestsDescription"), group: t("chatPageCommandPromptGroup"), icon: <FileText className="size-4" />, keywords: ["test", "coverage", "regression"] },
      { key: "clear-chat", label: t("chatPageCommandClearLabel"), description: t("chatPageCommandClearDescription"), group: t("chatPageCommandSessionGroup"), icon: <X className="size-4" />, keywords: ["clear", "reset", "chat"] },
    ] satisfies ChatCommandItem[],
    promptItems: [
      {
        key: "compact-layout",
        title: t("chatPagePromptCompactTitle"),
        description: t("chatPagePromptCompactDescription"),
        category: t("chatPagePromptCompactCategory"),
        content: t("chatPagePromptCompactContent"),
        variables: [
          { key: "component", label: t("chatPagePromptCompactComponentLabel"), placeholder: t("chatPagePromptCompactComponentPlaceholder"), defaultValue: "ChatPage" },
          { key: "goal", label: t("chatPagePromptCompactGoalLabel"), placeholder: t("chatPagePromptCompactGoalPlaceholder"), defaultValue: t("chatPagePromptCompactGoalDefault") },
        ],
      },
      {
        key: "command-workflow",
        title: t("chatPagePromptWorkflowTitle"),
        description: t("chatPagePromptWorkflowDescription"),
        category: t("chatPagePromptWorkflowCategory"),
        content: t("chatPagePromptWorkflowContent"),
        variables: [
          { key: "surface", label: t("chatPagePromptWorkflowSurfaceLabel"), placeholder: t("chatPagePromptWorkflowSurfacePlaceholder"), defaultValue: "ChatSender" },
          { key: "features", label: t("chatPagePromptWorkflowFeaturesLabel"), placeholder: t("chatPagePromptWorkflowFeaturesPlaceholder"), defaultValue: t("chatPagePromptWorkflowFeaturesDefault") },
        ],
      },
      {
        key: "regression-check",
        title: t("chatPagePromptRegressionTitle"),
        description: t("chatPagePromptRegressionDescription"),
        category: t("chatPagePromptRegressionCategory"),
        content: t("chatPagePromptRegressionContent"),
        variables: [
          { key: "scope", label: t("chatPagePromptRegressionScopeLabel"), placeholder: t("chatPagePromptRegressionScopePlaceholder"), defaultValue: t("chatPagePromptRegressionScopeDefault") },
          { key: "risk", label: t("chatPagePromptRegressionRiskLabel"), placeholder: t("chatPagePromptRegressionRiskPlaceholder"), defaultValue: t("chatPagePromptRegressionRiskDefault") },
        ],
      },
    ] satisfies PromptLibraryItem[],
  }
}

function buildDefaultChatPageContent(t: (key: string, vars?: Record<string, string | number>) => string) {
  return {
    ...buildLocalizedChatPageContent(t),
    models: MODELS,
    compactConversationTitle: t("chatPageCompactConversationTitle"),
    defaultConversationTitle: t("chatPageDefaultConversationTitle"),
    defaultCollapsedGroups: [t("chatPageConversation5Group")],
    headerTitle: t("chatPageHeaderTitle"),
    headerSubtitle: t("chatPageHeaderSubtitle"),
    searchMessagesPlaceholder: t("chatPageSearchMessagesPlaceholder"),
    closeSearchAriaLabel: t("chatPageCloseSearchAriaLabel"),
    searchMessagesAriaLabel: t("chatPageSearchMessagesAriaLabel"),
    senderPlaceholder: t("chatPageSenderPlaceholder"),
    senderFooterText: t("chatPageSenderFooterText"),
    modelMetaLabel: t("chatPageModelMetaLabel"),
    promptWorkbenchTitle: t("chatPagePromptWorkbenchTitle"),
    commandWorkbenchTitle: t("chatPageCommandWorkbenchTitle"),
    promptWorkbenchSubtitle: t("chatPagePromptWorkbenchSubtitle"),
    commandWorkbenchSubtitle: t("chatPageCommandWorkbenchSubtitle"),
    closeToolPanelAriaLabel: t("chatPageCloseToolPanelAriaLabel"),
    attachmentDialogTriggerAriaLabel: t("chatPageAttachmentDialogTriggerAriaLabel"),
    attachmentDialogTitle: t("chatPageAttachmentDialogTitle"),
    attachmentDialogDescription: t("chatPageAttachmentDialogDescription"),
    attachmentImageLabel: t("chatPageAttachmentImageLabel"),
    attachmentDocumentLabel: t("chatPageAttachmentDocumentLabel"),
    modelSelectorAriaLabel: t("chatPageModelSelectorAriaLabel"),
    currentFileDraft: t("chatPageCurrentFileDraft"),
    ticketDraft: t("chatPageTicketDraft"),
    testsDraft: t("chatPageTestsDraft"),
    toolRailPromptsAriaLabel: t("chatPageToolRailPromptsAriaLabel"),
    toolRailCommandsAriaLabel: t("chatPageToolRailCommandsAriaLabel"),
    toolRailPromptsLabel: t("chatPageToolRailPromptsLabel"),
    toolRailCommandsLabel: t("chatPageToolRailCommandsLabel"),
    toolRailDefaultLabel: t("chatPageToolRailDefaultLabel"),
    assistantReplyThinking: [
      (userText: string) => t("chatPageAssistantReplyThinkingLead", {
        snippet: `${userText.slice(0, 20)}${userText.length > 20 ? "…" : ""}`,
      }),
      () => t("chatPageAssistantReplyThinking1"),
      () => t("chatPageAssistantReplyThinking2"),
    ],
    assistantReplyContent: (userText: string, replyModel: string) =>
      t("chatPageAssistantReplyContent", { text: userText, model: replyModel }),
    attachmentName: (index: number) => t("chatPageAttachmentName", { index }),
    searchResultCount: (count: number) => t("chatPageSearchResultCount", { count }),
    welcomeTitle: t("chatPageWelcomeTitle"),
    welcomeDescription: t("chatPageWelcomeDescription"),
    welcomeHeaderTitle: t("chatPageWelcomeHeaderTitle"),
    welcomeHeaderSubtitle: t("chatPageWelcomeHeaderSubtitle"),
    welcomeSenderPlaceholder: t("chatPageWelcomeSenderPlaceholder"),
    welcomeReply: (text: string) => t("chatPageWelcomeReply", { text }),
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function WelcomeScreen({
  onPrompt,
  title,
  description,
  suggestions,
}: {
  onPrompt: (text: string) => void
  title: string
  description: string
  suggestions: Array<{ icon: string; text: string }>
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-5">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg">
        <Sparkles className="size-7" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid w-full max-w-md grid-cols-2 gap-2.5">
        {suggestions.map((p) => (
          <button
            key={p.text}
            onClick={() => onPrompt(p.text)}
            className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
          >
            <span className="text-lg">{p.icon}</span>
            <span>{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AttachmentDialog({
  triggerAriaLabel,
  title,
  description,
  imageLabel,
  documentLabel,
}: {
  triggerAriaLabel: string
  title: string
  description: string
  imageLabel: string
  documentLabel: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={triggerAriaLabel}>
          <FileUp className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          <button className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent">
            <Image className="size-8 text-blue-500" />
            <span className="text-sm">{imageLabel}</span>
            <span className="text-[10px] text-muted-foreground">PNG, JPG, GIF</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent">
            <FileText className="size-8 text-green-500" />
            <span className="text-sm">{documentLabel}</span>
            <span className="text-[10px] text-muted-foreground">PDF, TXT, MD</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModelSelector({
  value,
  onChange,
  ariaLabel,
  models,
}: {
  value: string
  onChange: (v: string) => void
  ariaLabel: string
  models: typeof MODELS
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-28 text-[11px]" aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {models.map((m) => (
          <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Chat",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}

export default meta
type Story = StoryObj

const zh = resolveLocale("zh-CN")
const en = resolveLocale("en")

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

function ChatPage({
  ultraCompact = false,
  initialDraft = "",
  initialAttachments = [],
  initialTool,
  localized = false,
}: {
  ultraCompact?: boolean
  initialDraft?: string
  initialAttachments?: Attachment[]
  initialTool?: ToolPanel
  localized?: boolean
}) {
  const t = useTranslation()
  const content = useMemo(() => buildDefaultChatPageContent(t), [t])
  const [activeConv, setActiveConv] = useState("1")
  const [messages, setMessages] = useState<ChatMessage[]>(content.initialMessages)
  const [draft, setDraft] = useState(initialDraft)
  const [isTyping, setIsTyping] = useState(false)
  const [model, setModel] = useState("gpt-4o")
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTool, setActiveTool] = useState<ToolPanel>(initialTool ?? (ultraCompact ? null : "prompts"))
  const [selectedPromptKey, setSelectedPromptKey] = useState(content.promptItems[0]?.key ?? "")
  const scrollRef = useRef<HTMLDivElement>(null)
  const streamIdRef = useRef(0)
  const slashDraft = draft.trimStart()
  const showInlineCommandPalette = slashDraft.startsWith("/")
  const useAdaptiveLayout = !ultraCompact && (showInlineCommandPalette || attachments.length > 0)
  const showCompactSearchChrome = ultraCompact || useAdaptiveLayout || searchOpen
  const visibleTool = showInlineCommandPalette && activeTool === "commands" ? null : activeTool
  const pageStyles = ultraCompact
    ? {
        shell: "h-[37.5rem] max-w-[84rem] rounded-md",
        sidebar: "w-52",
        header: "px-2.5 py-1.5",
        titleRow: "gap-1.5",
        subtitle: "hidden",
        actions: "gap-1",
        titleMeta: "gap-1",
        searchBar: "px-2.5 py-1",
        messages: "gap-1.5 px-2 py-1.5",
        sender: "px-2 pb-1.5 pt-0.5",
        senderDensity: "dense" as const,
        senderFooterText: undefined,
        showKeyboardHint: false,
        toolRail: "w-9 gap-0.5 py-1.5",
        toolPanelDocked: "w-[16.5rem]",
        toolPanelOverlay: "right-10 top-11 bottom-[4rem] w-[16.5rem]",
        toolPanelDockPadding: "p-1.5",
        toolPanelPadding: "p-1.5",
        showToolRailLabel: false,
        showToolPanelSubtitle: false,
        headerSearch: "w-[11.5rem] gap-1 rounded-md px-1.5 py-1",
        headerSearchInput: "text-[11px]",
      }
    : useAdaptiveLayout
      ? {
          shell: "h-[39rem] max-w-[88rem] rounded-lg",
          sidebar: "w-52",
          header: "px-2.5 py-1.5",
          titleRow: "gap-1.5",
          subtitle: "hidden",
          actions: "gap-1",
          titleMeta: "gap-1",
          searchBar: "px-2.5 py-1",
          messages: "gap-1.5 px-2 py-1.5",
          sender: "px-2 pb-1.5 pt-0.5",
          senderDensity: "dense" as const,
          senderFooterText: undefined,
          showKeyboardHint: false,
          toolRail: "w-9 gap-0.5 py-1.5",
          toolPanelDocked: "w-[16.5rem]",
          toolPanelOverlay: "right-10 top-11 bottom-[4rem] w-[16.5rem]",
          toolPanelDockPadding: "p-1.5",
          toolPanelPadding: "p-1.5",
          showToolRailLabel: false,
          showToolPanelSubtitle: false,
          headerSearch: "w-[12.5rem] gap-1 rounded-md px-1.5 py-1",
          headerSearchInput: "text-xs",
        }
    : {
        shell: "h-[40rem] max-w-[92rem] rounded-lg",
        sidebar: "w-56",
        header: "px-3 py-2",
        titleRow: "gap-2",
        subtitle: "text-[11px] text-muted-foreground",
        actions: "gap-1",
        titleMeta: "gap-1",
        searchBar: "px-3 py-1",
        messages: "gap-1.5 px-2.5 py-2",
        sender: "px-2.5 pb-2 pt-1",
        senderDensity: "compact" as const,
        senderFooterText: content.senderFooterText,
        showKeyboardHint: false,
        toolRail: "w-10 gap-1 py-2",
        toolPanelDocked: "w-[19rem]",
        toolPanelOverlay: "right-11 top-13 bottom-[4.75rem] w-[18rem]",
        toolPanelDockPadding: "p-2",
        toolPanelPadding: "p-2",
        showToolRailLabel: true,
        showToolPanelSubtitle: true,
        headerSearch: "w-[15rem] gap-1.5 rounded-lg px-2 py-1.5",
        headerSearchInput: "text-sm",
      }
  const useCompactSidebarChrome = ultraCompact || useAdaptiveLayout
  const shouldOverlayToolPanel = Boolean(visibleTool) && (ultraCompact || useAdaptiveLayout)
  const conversationLabels = localized ? buildChatConversationsLabels(t) : undefined
  const presenceLabels = localized ? buildChatPresenceLabels(t) : undefined
  const bubbleLabels = localized ? buildChatBubbleLabels(t) : undefined
  const senderLabels = localized ? buildChatSenderLabels(t) : undefined
  const commandPaletteTexts = localized ? buildChatCommandPaletteTexts(t) : undefined

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const simulateAIReply = useCallback((userText: string, replyModel: string) => {
    setIsTyping(true)
    const thinkSteps = [
      content.assistantReplyThinking[0](userText),
      content.assistantReplyThinking[1](),
      content.assistantReplyThinking[2](),
    ]
    const replyContent = content.assistantReplyContent(userText, replyModel)

    setTimeout(() => {
      setIsTyping(false)
      const id = `a-${Date.now()}`
      streamIdRef.current += 1
      const currentStream = streamIdRef.current
      setMessages((prev) => [
        ...prev,
        { id, role: "assistant", content: "", timestamp: new Date().toLocaleTimeString(localized ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" }), thinking: thinkSteps, streaming: true, model: replyModel },
      ])

      let charIndex = 0
      const interval = setInterval(() => {
        if (currentStream !== streamIdRef.current) {
          clearInterval(interval)
          return
        }
        charIndex += 3
        if (charIndex >= replyContent.length) {
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: replyContent, streaming: false } : m)))
          clearInterval(interval)
        } else {
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: replyContent.slice(0, charIndex) } : m)))
        }
      }, 20)
    }, 800)
  }, [content, localized])

  const handleSend = useCallback((text: string, atts?: Attachment[]) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: atts && atts.length > 0 ? `${text}\n\n📎 ${atts.map((a) => a.name).join(", ")}` : text,
      timestamp: new Date().toLocaleTimeString(localized ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }
    setMessages((prev) => [...prev, userMsg])
    setDraft("")
    setAttachments([])
    simulateAIReply(text, model)
  }, [localized, model, simulateAIReply])

  const handleAddAttachment = useCallback(() => {
    const id = `att-${Date.now()}`
    setAttachments((prev) => [...prev, { id, name: content.attachmentName(prev.length + 1), type: "image" as const, size: "128KB" }])
  }, [content])

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  const handleRegenerate = useCallback((msgId: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      const userMsg = [...prev].slice(0, idx).reverse().find((m) => m.role === "user")
      const updated = prev.filter((m) => m.id !== msgId)
      if (userMsg) setTimeout(() => simulateAIReply(userMsg.content, model), 0)
      return updated
    })
  }, [simulateAIReply, model])

  const handleEdit = useCallback((msgId: string, newContent: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      const updated = prev.slice(0, idx + 1).map((m) => (m.id === msgId ? { ...m, content: newContent } : m))
      setTimeout(() => simulateAIReply(newContent, model), 0)
      return updated
    })
  }, [simulateAIReply, model])

  const handleStopStreaming = useCallback(() => {
    streamIdRef.current += 1
    setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)))
    setIsTyping(false)
  }, [])

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text)
  }, [])

  const handleToolToggle = useCallback((tool: Exclude<ToolPanel, null>) => {
    setSearchOpen(false)
    setSearchQuery("")
    if (tool === "commands" && showInlineCommandPalette) {
      setActiveTool(null)
      return
    }
    setActiveTool((current) => (current === tool ? null : tool))
  }, [showInlineCommandPalette])

  const handlePromptApply = useCallback((result: PromptLibraryApplyResult) => {
    setDraft(result.rendered)
    setActiveTool(null)
  }, [])

  const handleCommandSelect = useCallback((item: ChatCommandItem) => {
    if (item.key === "model-gpt-4o") {
      setModel("gpt-4o")
      setDraft((current) => (current.trimStart().startsWith("/") ? "" : current))
      return
    }

    if (item.key === "model-claude-4") {
      setModel("claude-4")
      setDraft((current) => (current.trimStart().startsWith("/") ? "" : current))
      return
    }

    if (item.key === "context-file") {
      setAttachments((prev) => (
        prev.some((attachment) => attachment.name === "chat-page.tsx")
          ? prev
          : [
              ...prev,
              {
                id: `att-file-${Date.now()}`,
                name: "chat-page.tsx",
                type: "file",
                size: "14KB",
                status: "done",
              },
            ]
      ))
      setDraft((current) => {
        const normalized = current.trim()
        return !normalized || normalized.startsWith("/")
          ? content.currentFileDraft
          : current
      })
      return
    }

    if (item.key === "context-ticket") {
      setDraft(content.ticketDraft)
      return
    }

    if (item.key === "prompt-compact-layout") {
      setDraft((current) => (current.trimStart().startsWith("/") ? "" : current))
      setSelectedPromptKey("compact-layout")
      setActiveTool("prompts")
      return
    }

    if (item.key === "prompt-tests") {
      setDraft(content.testsDraft)
      return
    }

    if (item.key === "clear-chat") {
      setMessages(content.initialMessages.slice(0, 2))
      setAttachments([])
      setDraft("")
      setSearchQuery("")
      return
    }
  }, [content])

  const isStreaming = isTyping || messages.some((m) => m.streaming)

  const toolPanel = visibleTool ? (
    <div className={cn(
      "flex h-full flex-col overflow-hidden border bg-background/95 backdrop-blur",
      useCompactSidebarChrome ? "rounded-md shadow-xs" : "rounded-lg shadow-sm",
    )}>
      <div className={cn(
        "flex items-center justify-between border-b",
        useCompactSidebarChrome ? "px-2 py-1" : "px-2.5 py-1.5",
      )}>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">
            {visibleTool === "prompts" ? content.promptWorkbenchTitle : content.commandWorkbenchTitle}
          </p>
          {pageStyles.showToolPanelSubtitle && (
            <p className="truncate text-[10px] text-muted-foreground">
              {visibleTool === "prompts"
                ? content.promptWorkbenchSubtitle
                : content.commandWorkbenchSubtitle}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={content.closeToolPanelAriaLabel}
          onClick={() => setActiveTool(null)}
        >
          <X className="size-3.5" />
        </Button>
      </div>
      <div className={pageStyles.toolPanelPadding}>
        {visibleTool === "prompts" ? (
          <div className="h-full overflow-y-auto">
            <PromptLibrary
              items={content.promptItems}
              density="compact"
              layout="embedded"
              groupable
              showItemDescription={false}
              showTemplateDescription={false}
              showTemplateContent={false}
              selectedKey={selectedPromptKey}
              onSelect={(item) => setSelectedPromptKey(item.key)}
              onApply={handlePromptApply}
            />
          </div>
        ) : (
          <ChatCommandPalette
            open
            attachTo="standalone"
            density={useCompactSidebarChrome ? "dense" : "compact"}
            layout="embedded"
            showDescription={false}
            items={content.commandItems}
            onSelect={handleCommandSelect}
            className="max-w-none"
            emptyText={commandPaletteTexts?.emptyText}
            searchPlaceholder={commandPaletteTexts?.searchPlaceholder}
            defaultGroupLabel={commandPaletteTexts?.defaultGroupLabel}
          />
        )}
      </div>
    </div>
  ) : null

  return (
    <div className={`mx-auto flex overflow-hidden border bg-background shadow-sm ${pageStyles.shell}`}>
      {/* Conversations sidebar */}
      <ChatConversations
        items={content.conversations}
        activeKey={activeConv}
        onChange={(key) => setActiveConv(key)}
        onNewChat={() => setActiveConv("new")}
        title={useCompactSidebarChrome ? content.compactConversationTitle : content.defaultConversationTitle}
        density={useCompactSidebarChrome ? "dense" : "compact"}
        showTitle={!useCompactSidebarChrome}
        showNewChatButton={!useCompactSidebarChrome}
        searchMode={useCompactSidebarChrome ? "trigger" : "bar"}
        collapsibleGroups
        defaultCollapsedGroups={content.defaultCollapsedGroups}
        showDescription={false}
        showAvatar={!useCompactSidebarChrome}
        showTime={!useCompactSidebarChrome}
        showGroupCount={!useCompactSidebarChrome}
        className={`${pageStyles.sidebar} shrink-0 border-r`}
        labels={conversationLabels}
      />

      {/* Chat area */}
      <div className="relative flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Chat header */}
          <div className={`flex items-center justify-between border-b ${pageStyles.header}`}>
            <div className={`flex items-center ${pageStyles.titleRow}`}>
              <Avatar className="size-7">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                  <Bot className="size-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className={cn("flex items-center", pageStyles.titleMeta)}>
                  <h3 className="min-w-0 truncate text-sm font-semibold">{content.headerTitle}</h3>
                  <ChatPresence
                    layout="header"
                    status="online"
                    thinking={isTyping}
                    readState="read"
                    density={showCompactSearchChrome ? "dense" : "compact"}
                    participantLimit={2}
                    showStatusLabel={isTyping}
                    showReadLabel={false}
                    className={cn("hidden sm:flex", searchOpen && "sm:hidden")}
                    labels={presenceLabels}
                  />
                </div>
                {pageStyles.subtitle && !searchOpen && (
                  <p className={pageStyles.subtitle}>{content.headerSubtitle}</p>
                )}
              </div>
            </div>
            <div className={`flex items-center ${pageStyles.actions}`}>
              {searchOpen ? (
                <div className={cn(
                  "flex items-center border bg-background shadow-sm",
                  pageStyles.headerSearch,
                )}>
                  <Search className="size-3.5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={content.searchMessagesPlaceholder}
                    className={cn(
                      "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                      pageStyles.headerSearchInput,
                    )}
                    autoFocus
                  />
                  {searchQuery && (
                    <span className="hidden shrink-0 text-[10px] text-muted-foreground md:inline">
                      {content.searchResultCount(filteredMessages.filter((m) => m.role !== "system").length)}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={content.closeSearchAriaLabel}
                    className="shrink-0"
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <ModelSelector
                    value={model}
                    onChange={setModel}
                    ariaLabel={content.modelSelectorAriaLabel}
                    models={content.models}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={content.searchMessagesAriaLabel}
                    onClick={() => {
                      setActiveTool(null)
                      setSearchOpen(true)
                    }}
                  >
                    <Search className="size-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            <div className={`flex flex-col ${pageStyles.messages}`}>
              {filteredMessages.map((m) => {
                const props: BubbleProps = {
                  role: m.role,
                  content: m.content,
                  timestamp: m.timestamp,
                  status: m.status,
                  thinking: m.thinking,
                  streaming: m.streaming,
                  density: "compact",
                  metaLabel: m.model && m.role === "assistant" ? `${content.modelMetaLabel}: ${m.model}` : undefined,
                }
                return (
                  <Bubble
                    key={m.id}
                    {...props}
                    onCopy={() => handleCopy(m.content)}
                    onRegenerate={m.role === "assistant" ? () => handleRegenerate(m.id) : undefined}
                    onEdit={m.role === "user" ? (content) => handleEdit(m.id, content) : undefined}
                    labels={bubbleLabels}
                  />
                )
              })}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <Avatar className="mt-0.5 size-7.5 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                      <Bot className="size-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-bl-md bg-muted">
                    <TypingIndicator density="compact" />
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Sender */}
          <div className={cn("relative", pageStyles.sender)}>
            {showInlineCommandPalette && (
              <div className="pointer-events-none absolute right-0 bottom-full left-0 z-10 mb-1">
                <ChatCommandPalette
                  open
                  query={draft}
                  attachTo="chat-sender"
                  density={useCompactSidebarChrome ? "dense" : "compact"}
                  layout="embedded"
                  showDescription={false}
                  className="pointer-events-auto"
                  items={content.commandItems}
                  onSelect={handleCommandSelect}
                  emptyText={commandPaletteTexts?.emptyText}
                  searchPlaceholder={commandPaletteTexts?.searchPlaceholder}
                  defaultGroupLabel={commandPaletteTexts?.defaultGroupLabel}
                />
              </div>
            )}
            <ChatSender
              value={draft}
              onChange={setDraft}
              placeholder={content.senderPlaceholder}
              density={pageStyles.senderDensity}
              minRows={1}
              maxRows={ultraCompact ? 4 : 5}
              showKeyboardHint={pageStyles.showKeyboardHint}
              attachmentDisplay="summary"
              attachmentSummaryPlacement="input"
              attachmentSummaryDetail="compact"
              statusActionsPlacement="input"
              footerTextPlacement="input"
              suggestionLimit={2}
              suggestionTriggerVisibility={showInlineCommandPalette || attachments.length > 0 ? "hidden" : "auto"}
              overlayDensity={useCompactSidebarChrome ? "dense" : "compact"}
              loading={isStreaming}
              showStopLabel={!useCompactSidebarChrome}
              onSubmit={handleSend}
              onCancel={handleStopStreaming}
              suggestions={content.quickReplies}
              onSuggestionClick={(s) => setDraft(s)}
              attachments={attachments}
              onRemoveAttachment={handleRemoveAttachment}
              mentions={content.mentionItems}
              prefix={useCompactSidebarChrome ? undefined : (
                <AttachmentDialog
                  triggerAriaLabel={content.attachmentDialogTriggerAriaLabel}
                  title={content.attachmentDialogTitle}
                  description={content.attachmentDialogDescription}
                  imageLabel={content.attachmentImageLabel}
                  documentLabel={content.attachmentDocumentLabel}
                />
              )}
              onAttach={handleAddAttachment}
              statusActions={
                useCompactSidebarChrome ? undefined : (
                  <span className="text-[10px] text-muted-foreground">{content.modelMetaLabel}: {model}</span>
                )
              }
              footerText={pageStyles.senderFooterText}
              labels={senderLabels}
            />
          </div>
        </div>

        <div className={`flex shrink-0 flex-col items-center border-l bg-muted/10 ${pageStyles.toolRail}`}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={content.toolRailPromptsAriaLabel}
            className={visibleTool === "prompts" ? "bg-background text-foreground shadow-sm" : undefined}
            onClick={() => handleToolToggle("prompts")}
          >
            <Sparkles className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={content.toolRailCommandsAriaLabel}
            className={visibleTool === "commands" ? "bg-background text-foreground shadow-sm" : undefined}
            onClick={() => handleToolToggle("commands")}
          >
            <Bot className="size-3.5" />
          </Button>
          {pageStyles.showToolRailLabel && (
            <div className="mt-auto px-1 text-center text-[10px] leading-4 text-muted-foreground">
              {visibleTool === "prompts" ? content.toolRailPromptsLabel : visibleTool === "commands" ? content.toolRailCommandsLabel : content.toolRailDefaultLabel}
            </div>
          )}
        </div>

        {!shouldOverlayToolPanel && visibleTool && (
          <div className={cn(pageStyles.toolPanelDocked, pageStyles.toolPanelDockPadding, "shrink-0 border-l bg-muted/5")}>
            {toolPanel}
          </div>
        )}

        {shouldOverlayToolPanel && visibleTool && (
          <div className={`pointer-events-none absolute z-20 ${pageStyles.toolPanelOverlay}`}>
            <div className="pointer-events-auto h-full">{toolPanel}</div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Welcome variant                                                    */
/* ------------------------------------------------------------------ */

function ChatWelcomePage({ localized = false }: { localized?: boolean }) {
  const t = useTranslation()
  const content = useMemo(() => buildDefaultChatPageContent(t), [t])
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = useCallback(
    (text: string) => {
      const nextMessage = text.trim()
      if (!nextMessage) return

      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", content: nextMessage, timestamp: new Date().toLocaleTimeString(localized ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "sent" },
      ])
      setDraft("")

      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: content.welcomeReply(nextMessage), timestamp: new Date().toLocaleTimeString(localized ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" }) },
        ])
      }, 1500)
    },
    [content, localized],
  )

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text)
  }, [])

  const showWelcome = messages.length === 0

  return (
    <div className="mx-auto flex h-[41rem] max-w-3xl flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b px-4 py-2.5">
        <Avatar className="size-7.5">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
            <Sparkles className="size-3.5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">{content.welcomeHeaderTitle}</h3>
          <p className="text-xs text-muted-foreground">{content.welcomeHeaderSubtitle}</p>
        </div>
      </div>

      {/* Body */}
      {showWelcome ? (
        <WelcomeScreen
          onPrompt={handleSend}
          title={content.welcomeTitle}
          description={content.welcomeDescription}
          suggestions={content.promptSuggestions}
        />
      ) : (
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-2.5 px-3 py-2.5">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} timestamp={m.timestamp} status={m.status} density="compact" onCopy={() => handleCopy(m.content)} />
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <Avatar className="mt-0.5 size-7.5 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                    <Bot className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md bg-muted">
                  <TypingIndicator density="compact" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sender */}
      <div className="px-3 pb-2.5 pt-1.5">
        <ChatSender
          value={draft}
          onChange={setDraft}
          placeholder={content.welcomeSenderPlaceholder}
          density="compact"
          minRows={1}
          showKeyboardHint
          onSubmit={handleSend}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <ChatPage />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify conversations sidebar
    await expect(canvas.getByText(zh.chatPageDefaultConversationTitle)).toBeInTheDocument()
    await expect(canvas.getByRole("heading", { name: zh.chatPageHeaderTitle })).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageConversation2Label)).toBeInTheDocument()

    // Verify model selector
    await expect(canvas.getByLabelText(zh.chatPageModelSelectorAriaLabel)).toBeInTheDocument()

    // Verify messages rendered
    await expect(canvas.getByText(/useDebounceSearch/)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageUserDebouncePrompt)).toBeInTheDocument()

    // Apply a prompt template into the sender
    await expect(canvas.getByText(zh.chatPagePromptCompactTitle)).toBeInTheDocument()
    await userEvent.clear(canvas.getByPlaceholderText(zh.chatPagePromptCompactComponentLabel))
    await userEvent.type(canvas.getByPlaceholderText(zh.chatPagePromptCompactComponentLabel), "ChatPage")
    await userEvent.clear(canvas.getByPlaceholderText(zh.chatPagePromptCompactGoalLabel))
    await userEvent.type(canvas.getByPlaceholderText(zh.chatPagePromptCompactGoalLabel), "工具面板和消息区空间分配")
    await userEvent.click(canvas.getByRole("button", { name: zh.promptLibraryApplyLabel }))

    const textarea = canvas.getByPlaceholderText(zh.chatPageSenderPlaceholder)
    await expect(textarea).toHaveValue(
      "请针对 ChatPage 做高密度布局优化，重点处理 工具面板和消息区空间分配。要求保留高频操作、避免信息隐藏过深，并给出建议的间距和交互调整。",
    )

    // Trigger slash command and inject current file
    await userEvent.clear(textarea)
    await userEvent.type(textarea, "/")
    await expect(canvas.getByText(zh.chatPageCommandContextFileLabel)).toBeInTheDocument()
    await userEvent.click(canvas.getByText(zh.chatPageCommandContextFileLabel))
    await expect(canvas.getByText("1 附件")).toBeInTheDocument()

    // Search stays inside the header instead of opening a dedicated row
    await userEvent.click(canvas.getByRole("button", { name: zh.chatPageSearchMessagesAriaLabel }))
    await expect(canvas.getByPlaceholderText(zh.chatPageSearchMessagesPlaceholder)).toBeInTheDocument()
  },
}

export const UltraCompact: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <ChatPage ultraCompact />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: zh.chatPageToolRailPromptsAriaLabel })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: zh.chatPageToolRailCommandsAriaLabel }))
    await expect(canvas.getByPlaceholderText("搜索命令…")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: zh.chatPageToolRailPromptsAriaLabel }))
    await expect(canvas.getByText(zh.promptLibraryTitle)).toBeInTheDocument()
  },
}

export const AdaptiveMidWidth: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <ChatPage
        initialDraft="/"
        initialAttachments={[
          { id: "att-seed", name: "layout-notes.md", type: "file", size: "12KB", status: "done" },
        ]}
        initialTool="commands"
      />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText(zh.chatPageDefaultConversationTitle)).toBeNull()
    await expect(canvas.getByRole("button", { name: zh.conversationOpenSearchAriaLabel })).toBeInTheDocument()
    await expect(canvas.getByText("1 附件")).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPageCommandContextFileLabel)).toBeInTheDocument()
  },
}

export const Welcome: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN">
      <ChatWelcomePage />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Welcome screen visible
    await expect(canvas.getByText(zh.chatPageWelcomeTitle)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPagePromptSuggestion1)).toBeInTheDocument()
    await expect(canvas.getByText(zh.chatPagePromptSuggestion3)).toBeInTheDocument()

    // Click a prompt suggestion
    await userEvent.click(canvas.getByText(zh.chatPagePromptSuggestion1))
    await expect(canvas.getByText(zh.chatPagePromptSuggestion1)).toBeInTheDocument()
  },
}

export const LocalizedWithProvider: Story = {
  render: () => (
    <ConfigProvider locale="en">
      <ChatPage localized />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(en.chatPageDefaultConversationTitle)).toBeInTheDocument()
    await expect(canvas.getByText(en.presenceOnline)).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText(en.senderPlaceholder)).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText(en.conversationSearchPlaceholder)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: en.chatPageSearchMessagesAriaLabel }))
    await expect(canvas.getByPlaceholderText(en.chatPageSearchMessagesPlaceholder)).toBeInTheDocument()
    await userEvent.type(canvas.getByPlaceholderText(en.chatPageSearchMessagesPlaceholder), "Hook")
    await expect(canvas.getByText(en.chatPageSearchResultCount.replace("{count}", "3"))).toBeInTheDocument()

    const textarea = canvas.getByPlaceholderText(en.senderPlaceholder)
    await userEvent.clear(textarea)
    await userEvent.type(textarea, "/")
    await expect(canvas.getByText(en.chatPageCommandContextFileLabel)).toBeInTheDocument()
    await userEvent.click(canvas.getByText(en.chatPageCommandContextFileLabel))
    await expect(canvas.getByText(/1 file/)).toBeInTheDocument()
    await expect(canvas.getByDisplayValue(en.chatPageCurrentFileDraft)).toBeInTheDocument()
  },
}
