/**
 * Subscription Page — 套餐订阅页，含月/年计费切换、三档方案对比与 FAQ。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { CheckIcon, ZapIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/display/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/display/separator"
import { Switch } from "@/components/ui/inputs/switch"
import { Label } from "@/components/ui/inputs/label"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/SubscriptionPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Billing = "monthly" | "yearly"

interface Plan {
  id: string
  name: string
  description: string
  monthly: number
  yearly: number
  icon: React.ElementType
  popular?: boolean
  cta: string
  color: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "入门版",
    description: "适合个人开发者和小型项目",
    monthly: 0,
    yearly: 0,
    icon: ZapIcon,
    cta: "免费开始",
    color: "text-muted-foreground",
    features: [
      "最多 3 个项目",
      "3 GB 存储空间",
      "基础组件库",
      "社区支持",
      "公开仓库",
    ],
  },
  {
    id: "pro",
    name: "专业版",
    description: "适合成长中的团队与商业项目",
    monthly: 99,
    yearly: 79,
    icon: ShieldCheckIcon,
    popular: true,
    cta: "开始 14 天免费试用",
    color: "text-primary",
    features: [
      "无限项目",
      "50 GB 存储空间",
      "全部组件库",
      "优先邮件支持",
      "私有仓库",
      "CI/CD 流水线",
      "自定义域名",
    ],
  },
  {
    id: "enterprise",
    name: "企业版",
    description: "适合大型团队与高安全要求场景",
    monthly: 299,
    yearly: 239,
    icon: SparklesIcon,
    cta: "联系销售",
    color: "text-amber-500",
    features: [
      "无限项目与存储",
      "SLA 99.99% 可用性",
      "全部组件与定制服务",
      "专属客户成功经理",
      "私有部署选项",
      "SSO / SAML",
      "审计日志",
      "高级安全扫描",
    ],
  },
]

const FAQS = [
  { q: "可以随时取消订阅吗？", a: "可以。你可以在账单周期结束前随时取消，取消后仍可使用至当期结束。" },
  { q: "年付相比月付节省多少？", a: "年付最高节省约 20%，具体以套餐显示价格为准。" },
  { q: "免费试用期结束后会自动扣费吗？", a: "不会。试用期结束前我们会发送提醒邮件，你需要主动确认升级方可扣费。" },
  { q: "可以在不同套餐之间切换吗？", a: "可以。随时升降级，按比例计算余额差。" },
  { q: "支持哪些支付方式？", a: "支持支付宝、微信支付、银行卡及 PayPal。" },
]

// ---------------------------------------------------------------------------
// Plan Card
// ---------------------------------------------------------------------------

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "yearly" ? plan.yearly : plan.monthly
  const Icon = plan.icon

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-shadow",
        plan.popular && "ring-2 ring-primary shadow-lg",
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge size="sm" className="px-3 shadow">推荐</Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className={cn("size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2", plan.popular && "bg-primary/15")}>
          <Icon className={cn("size-5", plan.color)} />
        </div>
        <CardTitle className="text-base">{plan.name}</CardTitle>
        <CardDescription className="text-xs">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="mb-4">
          {price === 0 ? (
            <p className="text-3xl font-bold">免费</p>
          ) : (
            <div className="flex items-end gap-1">
              <p className="text-3xl font-bold">¥{price}</p>
              <p className="text-sm text-muted-foreground mb-1">/ 月</p>
            </div>
          )}
          {billing === "yearly" && price > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              按年付 ¥{price * 12}，省 ¥{(plan.monthly - plan.yearly) * 12}
            </p>
          )}
        </div>

        <Separator className="mb-4" />

        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
          size="sm"
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SubscriptionPage() {
  const [billing, setBilling] = useState<Billing>("monthly")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b px-6 py-10 text-center">
        <Badge variant="secondary" className="mb-3">套餐与价格</Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">选择适合你的方案</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          从免费入门，到专业版再到企业级服务，按需选择，随时升降级。
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Label
            htmlFor="billing-toggle"
            className={cn("text-sm cursor-pointer", billing === "monthly" && "font-medium")}
          >
            按月付
          </Label>
          <Switch
            id="billing-toggle"
            checked={billing === "yearly"}
            onCheckedChange={(v) => setBilling(v ? "yearly" : "monthly")}
          />
          <Label
            htmlFor="billing-toggle"
            className={cn("text-sm cursor-pointer flex items-center gap-1.5", billing === "yearly" && "font-medium")}
          >
            按年付
            <Badge variant="secondary" size="sm" className="text-[10px] px-1.5">省 20%</Badge>
          </Label>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Compare note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          所有方案均含 SSL 加密、每日自动备份和 24/7 基础监控。
          <button type="button" className="ml-1 underline hover:text-foreground transition-colors">
            查看完整功能对比
          </button>
        </p>

        <Separator className="my-10" />

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-5">常见问题</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SubscriptionPage />,
}

export const YearlyBilling: Story = {
  render: () => {
    const [billing] = useState<Billing>("yearly")
    return (
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>
      </div>
    )
  },
}
