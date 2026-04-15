/**
 * Timeline — vertical event timeline with dot variants and connectors.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect } from "storybook/test"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline"
import {
  Check,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  Rocket,
  Tag,
} from "lucide-react"

const meta: Meta = {
  title: "Components/Timeline",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "垂直时间线组件 — 适用于活动记录、版本历史、流程步骤等场景。支持 dot 颜色变体和自定义图标。",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="mx-auto max-w-lg p-8">
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="primary">
            <Rocket className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>v0.1.0 发布</TimelineTitle>
            <TimelineDescription>
              首个公开版本，包含 53 个组件、主题系统、i18n 支持。
            </TimelineDescription>
            <p className="mt-1 text-xs text-muted-foreground">2026-04-16</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="success">
            <Check className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>全部测试通过</TimelineTitle>
            <TimelineDescription>
              49 个单元测试 + 10 个 E2E 测试全部通过。
            </TimelineDescription>
            <p className="mt-1 text-xs text-muted-foreground">2026-04-16</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="default">
            <GitPullRequest className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>PR #42 合并</TimelineTitle>
            <TimelineDescription>
              添加 Timeline 组件 — 垂直布局、多种颜色变体。
            </TimelineDescription>
            <p className="mt-1 text-xs text-muted-foreground">2026-04-16</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="warning">
            <Tag className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>v0.0.9 预发布</TimelineTitle>
            <TimelineDescription>
              内部测试版本，验证 npm 发布流程。
            </TimelineDescription>
            <p className="mt-1 text-xs text-muted-foreground">2026-04-14</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem isLast>
          <TimelineDot variant="destructive">
            <GitCommit className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>项目初始化</TimelineTitle>
            <TimelineDescription>
              创建仓库，初始化 Vite + React 19 + Tailwind CSS v4。
            </TimelineDescription>
            <p className="mt-1 text-xs text-muted-foreground">2026-04-10</p>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("v0.1.0 发布")).toBeInTheDocument()
    await expect(canvas.getByText("项目初始化")).toBeInTheDocument()
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="mx-auto max-w-lg p-8">
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="primary">
            <MessageSquare className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>Alice 评论了你的代码</TimelineTitle>
            <TimelineDescription>
              "这个 Timeline 组件设计得很优雅！"
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineDot variant="success">
            <Check className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>CI 构建通过</TimelineTitle>
            <TimelineDescription>所有检查项已通过。</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem isLast>
          <TimelineDot>
            <GitCommit className="size-3.5" />
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>提交 ed70dda</TimelineTitle>
            <TimelineDescription>
              test: add parseThemeCSS unit tests
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}
