/**
 * Onboarding Page — 4-step wizard using Stepper for new user setup flow.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { CheckCircle2Icon, RocketIcon, UserIcon, SettingsIcon, SparklesIcon } from "lucide-react"
import { Stepper, Step } from "@/components/ui/display/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"
import { Textarea } from "@/components/ui/inputs/textarea"
import { Switch } from "@/components/ui/inputs/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/display/card"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"

const meta: Meta = {
  title: "Pages/OnboardingPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Step data
// ---------------------------------------------------------------------------

const STEPS = [
  { label: "欢迎", description: "了解平台功能", icon: RocketIcon },
  { label: "基本信息", description: "完善个人资料", icon: UserIcon },
  { label: "偏好设置", description: "自定义体验", icon: SettingsIcon },
  { label: "完成", description: "开始使用", icon: SparklesIcon },
]

// ---------------------------------------------------------------------------
// Step 0 — Welcome
// ---------------------------------------------------------------------------

function WelcomeStep() {
  const highlights = [
    "统一的 UI 组件库，开箱即用",
    "支持亮色 / 暗色主题一键切换",
    "内置 i18n，支持中文 / English / 日本語",
    "Kanban、Chat、Dashboard 等完整页面模板",
  ]
  return (
    <div className="space-y-5 py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <RocketIcon className="size-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">欢迎使用 Next UI</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            完成以下几步设置，tailored 专属于你的体验。
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-green-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 1 — Profile
// ---------------------------------------------------------------------------

interface ProfileData {
  name: string
  username: string
  bio: string
}

function ProfileStep({
  data,
  onChange,
}: {
  data: ProfileData
  onChange: (d: ProfileData) => void
}) {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="text-lg">
            {data.name ? data.name[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-muted-foreground">头像将根据姓名自动生成</div>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="ob-name">姓名</Label>
          <Input
            id="ob-name"
            placeholder="你的姓名"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-username">用户名</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="ob-username"
              placeholder="username"
              className="rounded-l-none"
              value={data.username}
              onChange={(e) => onChange({ ...data, username: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-bio">简介</Label>
          <Textarea
            id="ob-bio"
            placeholder="介绍一下你自己（可选）"
            rows={3}
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Preferences
// ---------------------------------------------------------------------------

interface Prefs {
  darkMode: boolean
  notifications: boolean
  analytics: boolean
}

function PrefsStep({ prefs, onChange }: { prefs: Prefs; onChange: (p: Prefs) => void }) {
  const items: { key: keyof Prefs; label: string; desc: string }[] = [
    { key: "darkMode", label: "深色模式", desc: "默认使用深色主题" },
    { key: "notifications", label: "邮件通知", desc: "接收系统更新和动态提醒" },
    { key: "analytics", label: "使用分析", desc: "帮助我们改善产品体验（匿名）" },
  ]
  return (
    <div className="space-y-3 py-2">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Switch
            checked={prefs[item.key]}
            onCheckedChange={(v) => onChange({ ...prefs, [item.key]: v })}
          />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 3 — Done
// ---------------------------------------------------------------------------

function DoneStep({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle2Icon className="size-8 text-green-500" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">设置完成！</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {name ? `欢迎加入，${name}！` : "欢迎加入！"} 你已准备好开始使用平台。
        </p>
      </div>
      <Badge variant="secondary" className="mt-1">
        🎉 新用户
      </Badge>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<ProfileData>({ name: "", username: "", bio: "" })
  const [prefs, setPrefs] = useState<Prefs>({ darkMode: false, notifications: true, analytics: true })

  const isLast = step === STEPS.length - 1

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const stepContent = [
    <WelcomeStep key="welcome" />,
    <ProfileStep key="profile" data={profile} onChange={setProfile} />,
    <PrefsStep key="prefs" prefs={prefs} onChange={setPrefs} />,
    <DoneStep key="done" name={profile.name} />,
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base">账户初始化向导</CardTitle>
          <CardDescription>步骤 {step + 1} / {STEPS.length}</CardDescription>
          <div className="pt-2">
            <Stepper activeStep={step} orientation="horizontal">
              {STEPS.map((s) => (
                <Step key={s.label} label={s.label} />
              ))}
            </Stepper>
          </div>
        </CardHeader>

        <CardContent className="pt-5 pb-3">
          {stepContent[step]}
        </CardContent>

        <CardFooter className="gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={step === 0}
            onClick={handleBack}
          >
            上一步
          </Button>
          <div className="flex-1" />
          {!isLast ? (
            <Button size="sm" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button size="sm">开始使用</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export const Default: Story = {
  render: () => <OnboardingPage />,
}
