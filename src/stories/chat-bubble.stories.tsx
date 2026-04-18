import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { ConfigProvider, useTranslation } from "@/components/config-provider"
import { buildChatBubbleLabels } from "@/components/ui/chat/chat-i18n"
import {
  Bubble,
  BubbleList,
  CodeBlock,
  RichContent,
  ThoughtChain,
  TypingIndicator,
} from "@/components/ui/chat/chat-bubble"

const meta: Meta = {
  title: "Chat/Bubble",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj

/* ------------------------------------------------------------------ */
/*  Basic                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-4">
      <Bubble role="assistant" content="你好！有什么可以帮你的？" timestamp="10:00" />
      <Bubble role="user" content="帮我写一个函数" timestamp="10:01" status="sent" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("你好！有什么可以帮你的？")).toBeInTheDocument()
    await expect(canvas.getByText("帮我写一个函数")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Roles                                                              */
/* ------------------------------------------------------------------ */

export const Roles: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-4">
      <Bubble role="system" content="2025年1月15日" />
      <Bubble role="assistant" content="我是 AI 助手，很高兴为你服务！" timestamp="09:00" />
      <Bubble role="user" content="你能做什么？" timestamp="09:01" status="sent" />
      <Bubble
        role="assistant"
        content="我可以帮你：\n- 编写代码\n- 解释概念\n- 翻译文本\n- 数据分析"
        timestamp="09:01"
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

export const Variants: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">filled (default)</p>
        <div className="flex flex-col gap-3">
          <Bubble role="assistant" content="Filled variant — assistant" variant="filled" />
          <Bubble role="user" content="Filled variant — user" variant="filled" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">outlined</p>
        <div className="flex flex-col gap-3">
          <Bubble role="assistant" content="Outlined variant — assistant" variant="outlined" />
          <Bubble role="user" content="Outlined variant — user" variant="outlined" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">shadow</p>
        <div className="flex flex-col gap-3">
          <Bubble role="assistant" content="Shadow variant — assistant" variant="shadow" />
          <Bubble role="user" content="Shadow variant — user" variant="shadow" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">borderless</p>
        <div className="flex flex-col gap-3">
          <Bubble role="assistant" content="Borderless variant — assistant" variant="borderless" />
          <Bubble role="user" content="Borderless variant — user" variant="borderless" />
        </div>
      </div>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Shapes                                                             */
/* ------------------------------------------------------------------ */

export const Shapes: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-6">
      {(["default", "round", "corner"] as const).map((shape) => (
        <div key={shape}>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{shape}</p>
          <div className="flex flex-col gap-3">
            <Bubble role="assistant" content={`Shape: ${shape}`} shape={shape} />
            <Bubble role="user" content={`Shape: ${shape}`} shape={shape} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  ThoughtChain                                                       */
/* ------------------------------------------------------------------ */

export const WithThoughtChain: Story = {
  render: () => (
    <div className="w-[480px]">
      <Bubble
        role="assistant"
        content="函数实现如下：\n\n```typescript\nfunction add(a: number, b: number) {\n  return a + b\n}\n```"
        thinking={[
          "分析用户需求：编写一个简单函数",
          "确定参数类型和返回值",
          "选择 TypeScript 语法",
          "生成代码及注释",
        ]}
        timestamp="10:05"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("思考过程 (4 步)")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  Code Block                                                         */
/* ------------------------------------------------------------------ */

export const WithCodeBlock: Story = {
  render: () => (
    <div className="w-[480px]">
      <Bubble
        role="assistant"
        content={"这里有两个示例：\n\n```javascript\nconst greet = (name) => `Hello, ${name}!`\n```\n\n也可以用 Python：\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n```"}
        timestamp="10:10"
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export const WithActions: Story = {
  render: function Render() {
    const [feedback, setFeedback] = useState("")
    return (
      <div className="flex w-[480px] flex-col gap-4">
        <p className="text-xs text-muted-foreground">悬停消息可见操作按钮</p>
        <Bubble
          role="assistant"
          content="这条消息支持复制、点赞/踩、重新生成。"
          timestamp="10:00"
          onCopy={() => setFeedback("已复制")}
          onFeedback={(type) => setFeedback(`反馈: ${type}`)}
          onRegenerate={() => setFeedback("重新生成中…")}
        />
        <Bubble
          role="user"
          content="这条消息支持复制和编辑。"
          timestamp="10:01"
          status="sent"
          onCopy={() => setFeedback("已复制")}
          onEdit={(newText) => setFeedback(`编辑为: ${newText}`)}
        />
        {feedback && (
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            操作反馈: {feedback}
          </p>
        )}
      </div>
    )
  },
}

/* ------------------------------------------------------------------ */
/*  Header / Footer                                                    */
/* ------------------------------------------------------------------ */

export const CustomHeaderFooter: Story = {
  render: () => (
    <div className="w-[480px]">
      <Bubble
        role="assistant"
        content="这是一条带有自定义头部和底部的消息。"
        header={<span className="text-[10px] text-muted-foreground">模型: GPT-4o · Token: 156</span>}
        footer={<span className="text-[10px] text-green-600">✓ 已通过安全检查</span>}
        timestamp="10:00"
      />
    </div>
  ),
}

export const InlineMeta: Story = {
  render: () => (
    <div className="w-[480px]">
      <Bubble
        role="assistant"
        content="这条消息把模型信息收进了底部元信息带，而不是单独占一行。"
        metaLabel="模型: GPT-4o"
        timestamp="10:02"
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  Streaming                                                          */
/* ------------------------------------------------------------------ */

export const Streaming: Story = {
  render: () => (
    <div className="w-[480px]">
      <Bubble
        role="assistant"
        content="正在逐字输出这段文本，模拟 AI 流式响应效果…"
        streaming
        timestamp="10:00"
      />
    </div>
  ),
}

export const LocalizedWithProvider: Story = {
  render: function Render() {
    function LocalizedBubble() {
      const t = useTranslation()
      return (
        <div className="flex w-[480px] flex-col gap-4">
          <Bubble
            role="assistant"
            content="Here is a localized assistant reply."
            timestamp="10:00"
            thinking={["Identify the user goal", "Match the correct labels", "Return the localized UI"]}
            onCopy={() => {}}
            onFeedback={() => {}}
            onRegenerate={() => {}}
            labels={buildChatBubbleLabels(t)}
          />
          <Bubble
            role="user"
            content="Can you switch the labels to English?"
            timestamp="10:01"
            status="sent"
            onCopy={() => {}}
            onEdit={() => {}}
            labels={buildChatBubbleLabels(t)}
          />
        </div>
      )
    }

    return (
      <ConfigProvider locale="en">
        <LocalizedBubble />
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Thinking steps (3)")).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */
/*  BubbleList                                                         */
/* ------------------------------------------------------------------ */

export const List: Story = {
  render: () => (
    <div className="h-96 w-[480px] overflow-hidden rounded-xl border">
      <BubbleList
        className="h-full px-4 py-3"
        items={[
          { role: "system", content: "今天" },
          { role: "assistant", content: "你好！有什么可以帮你的？", timestamp: "09:00" },
          { role: "user", content: "帮我解释一下 useEffect", timestamp: "09:01", status: "sent" },
          {
            role: "assistant",
            content: "useEffect 是 React 的副作用 Hook，用于在组件挂载、更新或卸载时执行操作。\n\n```javascript\nuseEffect(() => {\n  // 副作用逻辑\n  return () => { /* 清理 */ }\n}, [deps])\n```",
            timestamp: "09:02",
            thinking: ["分析问题", "组织回答"],
          },
          { role: "user", content: "依赖数组怎么用？", timestamp: "09:03", status: "sent" },
          { role: "assistant", content: "依赖数组控制 effect 的执行时机：\n- `[]` 空数组：只在挂载时执行一次\n- `[a, b]` 有依赖：当 a 或 b 变化时重新执行\n- 不传：每次渲染都执行", timestamp: "09:03" },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("帮我解释一下 useEffect")).toBeInTheDocument()
  },
}

export const CompactList: Story = {
  render: () => (
    <div className="h-80 w-[440px] overflow-hidden rounded-xl border">
      <BubbleList
        density="compact"
        className="h-full px-3 py-2.5"
        items={[
          { role: "system", content: "今天" },
          { role: "assistant", content: "先给你一个更紧凑的回复版本。", timestamp: "09:00" },
          { role: "user", content: "把布局再压一压。", timestamp: "09:01", status: "sent" },
          {
            role: "assistant",
            content: "可以先从消息间距、头像尺寸、时间行和动作按钮密度入手。",
            timestamp: "09:02",
            thinking: ["识别冗余留白", "保留操作可点击性"],
          },
        ]}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  ThoughtChain standalone                                            */
/* ------------------------------------------------------------------ */

export const ThoughtChainStory: Story = {
  name: "ThoughtChain",
  render: () => (
    <div className="w-80">
      <ThoughtChain
        steps={[
          "解析用户查询意图",
          "检索相关文档和代码",
          "对比多种实现方案",
          "选择最优解并生成代码",
          "验证代码正确性",
        ]}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  CodeBlock standalone                                               */
/* ------------------------------------------------------------------ */

export const CodeBlockStory: Story = {
  name: "CodeBlock",
  render: () => (
    <div className="w-[480px]">
      <CodeBlock
        language="typescript"
        code={`interface User {\n  id: string\n  name: string\n  email: string\n}\n\nfunction getUser(id: string): Promise<User> {\n  return fetch(\`/api/users/\${id}\`).then(r => r.json())\n}`}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  RichContent standalone                                             */
/* ------------------------------------------------------------------ */

export const RichContentStory: Story = {
  name: "RichContent",
  render: () => (
    <div className="w-[480px] rounded-lg border p-4 text-sm leading-relaxed">
      <RichContent
        content={"这是普通文本。\n\n下面是代码块：\n\n```python\ndef hello():\n    print('Hello, World!')\n```\n\n以上就是一个 Python 示例。"}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/*  TypingIndicator standalone                                         */
/* ------------------------------------------------------------------ */

export const TypingIndicatorStory: Story = {
  name: "TypingIndicator",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-muted">
        <TypingIndicator />
      </div>
      <div className="rounded-2xl bg-muted">
        <TypingIndicator text="正在搜索相关文档…" density="compact" />
      </div>
    </div>
  ),
}
