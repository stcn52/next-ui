/**
 * Stepper — multi-step progress indicator with horizontal/vertical layouts.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Stepper, Step } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const meta: Meta = {
  title: "Components/Stepper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "步骤条组件 — 支持水平/垂直布局、完成/进行中/未开始三种状态，适用于多步表单、向导流程等场景。",
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS = [
  { label: "账户信息", description: "设置用户名和邮箱" },
  { label: "个人资料", description: "填写头像和简介" },
  { label: "偏好设置", description: "选择主题和语言" },
  { label: "完成", description: "确认并提交" },
]

function StepperDemo({ orientation }: { orientation?: "horizontal" | "vertical" }) {
  const [step, setStep] = useState(1)
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">创建账户</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper activeStep={step} orientation={orientation}>
          {STEPS.map((s) => (
            <Step key={s.label} label={s.label} description={s.description} />
          ))}
        </Stepper>
        <div className="mt-6 rounded-lg border p-4 text-sm text-muted-foreground">
          当前步骤：<span className="font-medium text-foreground">{STEPS[step]?.label ?? "已完成"}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          上一步
        </Button>
        <Button
          size="sm"
          disabled={step >= STEPS.length}
          onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
        >
          {step === STEPS.length - 1 ? "完成" : "下一步"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export const Horizontal: Story = {
  render: () => <StepperDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("创建账户")).toBeInTheDocument()
    await expect(canvas.getByText("个人资料")).toBeInTheDocument()
    // Click next
    await userEvent.click(canvas.getByText("下一步"))
    await expect(canvas.getByText("当前步骤：")).toBeInTheDocument()
  },
}

export const Vertical: Story = {
  render: () => <StepperDemo orientation="vertical" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("账户信息")).toBeInTheDocument()
    await expect(canvas.getByText("偏好设置")).toBeInTheDocument()
  },
}
