/**
 * Profile Page — user profile with avatar, stats, tabs for activity and settings.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect } from "storybook/test"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Separator } from "@/components/ui/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Progress } from "@/components/ui/display/progress"
import {
  Calendar,
  GitFork,
  Globe,
  Mail,
  MapPin,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Profile",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "用户个人主页 — 资料展示、统计指标、活动记录，展示卡片与标签页组合模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

const ACTIVITIES = [
  { action: "发布了组件", target: "InputGroup", time: "2 小时前" },
  { action: "提交了 PR", target: "#142 parseThemeCSS", time: "5 小时前" },
  { action: "评论了 Issue", target: "#87 虚拟表格性能", time: "昨天" },
  { action: "Star 了仓库", target: "shadcn-themer", time: "2 天前" },
  { action: "更新了文档", target: "Theming Guide", time: "3 天前" },
]

const SKILLS = [
  { name: "React", level: 92 },
  { name: "TypeScript", level: 88 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Node.js", level: 72 },
  { name: "Next.js", level: 78 },
]

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

      <main className="max-w-4xl mx-auto px-6 -mt-16">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Avatar className="size-24 border-4 border-background shadow-lg">
            <AvatarFallback className="text-2xl font-bold">CY</AvatarFallback>
          </Avatar>
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">Chen Yang</h1>
              <Badge variant="secondary">Pro</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Full-Stack Developer · Open Source Enthusiast
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" /> Shanghai, China
              </span>
              <span className="flex items-center gap-1">
                <Globe className="size-3" /> stcn52.dev
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="size-3" /> @stcn52
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" /> 2024 年加入
              </span>
            </div>
          </div>
          <div className="flex gap-2 sm:pt-4">
            <Button size="sm">
              <Mail className="size-3.5 mr-1" /> 联系
            </Button>
            <Button variant="outline" size="sm">编辑资料</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "仓库", value: "24" },
            { label: "Star", value: "1.2k" },
            { label: "关注者", value: "386" },
            { label: "贡献", value: "847" },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <CardContent className="p-3">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Tabs */}
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">动态</TabsTrigger>
            <TabsTrigger value="skills">技能</TabsTrigger>
            <TabsTrigger value="about">关于</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">最近活动</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-2 rounded-full bg-primary shrink-0" />
                    <span>
                      {a.action}{" "}
                      <span className="font-medium">{a.target}</span>
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                      {a.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">技术栈</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SKILLS.map((s) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="font-medium">{s.level}%</span>
                    </div>
                    <Progress value={s.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">简介</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  热爱开源，专注于 React 生态和 UI 组件库开发。
                  日常使用 TypeScript、Tailwind CSS 和 Next.js 构建产品。
                </p>
                <p>
                  目前维护 @stcn52/next-ui 组件库，基于 shadcn/ui v3 提供 55+ 组件，
                  支持国际化、主题定制和无障碍访问。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export const Default: Story = {
  render: () => <ProfilePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Chen Yang")).toBeVisible()
    await expect(canvas.getByText("1.2k")).toBeVisible()
    await expect(canvas.getByText("最近活动")).toBeVisible()
  },
}
