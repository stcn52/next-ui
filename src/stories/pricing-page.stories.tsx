import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const meta: Meta = {
  title: "Pages/Pricing",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj

const plans = [
  {
    name: "Starter",
    price: "¥0",
    desc: "适合个人项目与原型验证",
    features: ["基础组件", "社区支持", "每月 1 次导出"],
    cta: "免费开始",
  },
  {
    name: "Pro",
    price: "¥199",
    desc: "适合小团队协作与交付",
    features: ["全部组件", "主题与 i18n", "优先支持"],
    cta: "升级到 Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "定制",
    desc: "适合大型组织和私有部署",
    features: ["SLA", "安全审计", "专属架构支持"],
    cta: "联系销售",
  },
]

function PricingPage() {
  return (
    <div className="w-full max-w-6xl p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">选择适合你的方案</h1>
        <p className="mt-2 text-sm text-muted-foreground">支持按月计费，随时升级或降级</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.highlight ? "border-primary shadow-md" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlight && <Badge>推荐</Badge>}
              </div>
              <p className="text-3xl font-bold">{plan.price}</p>
              <p className="text-sm text-muted-foreground">{plan.desc}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="flex flex-col gap-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button className="mt-2 w-full" variant={plan.highlight ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <PricingPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("选择适合你的方案")).toBeInTheDocument()
    await expect(canvas.getByText("Pro")).toBeInTheDocument()
    await expect(canvas.getByText("升级到 Pro")).toBeInTheDocument()
  },
}
