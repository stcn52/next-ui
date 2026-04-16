/**
 * OTPInput — 一次性密码输入框 stories
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { OTPInput } from "@/components/ui/otp-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof OTPInput> = {
  title: "UI/OTPInput",
  component: OTPInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "一次性密码输入框 — 支持自动跳格、粘贴整串 OTP、退格删除，以及掩码、下划线和幽灵三种视觉变体。",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof OTPInput>

export const Default: Story = {
  render: function Render() {
    const [otp, setOtp] = useState("")
    const [verified, setVerified] = useState(false)
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <Label>验证码（6 位）</Label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={(v) => setVerified(v === "123456")}
          />
          <p className="text-xs text-muted-foreground">请输入 123456 进行测试</p>
        </div>
        {verified && (
          <p className="text-sm font-medium text-green-600">✓ 验证成功</p>
        )}
        <Button
          size="sm"
          disabled={otp.length < 6}
          onClick={() => setVerified(otp === "123456")}
        >
          验证
        </Button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByLabelText("第 1 位")
    await expect(first).toBeInTheDocument()
    await userEvent.click(first)
    await userEvent.type(first, "1")
  },
}

export const FourDigit: Story = {
  name: "4 位 PIN",
  render: function Render() {
    const [pin, setPin] = useState("")
    return (
      <div className="flex flex-col items-center gap-3">
        <Label>PIN 码</Label>
        <OTPInput
          length={4}
          value={pin}
          onChange={setPin}
          mask
          onComplete={(v) => alert(`PIN: ${v}`)}
        />
        <p className="text-xs text-muted-foreground">已输入 {pin.length} / 4 位</p>
      </div>
    )
  },
}

export const Underline: Story = {
  name: "下划线样式",
  render: function Render() {
    const [otp, setOtp] = useState("")
    return (
      <div className="flex flex-col items-center gap-3">
        <Label>短信验证码</Label>
        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          variant="underline"
        />
      </div>
    )
  },
}

export const Ghost: Story = {
  name: "幽灵样式",
  render: function Render() {
    const [otp, setOtp] = useState("")
    return (
      <div className="flex flex-col items-center gap-3">
        <Label>邮箱验证码</Label>
        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          variant="ghost"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Label>禁用状态</Label>
      <OTPInput length={6} defaultValue="12" disabled />
    </div>
  ),
}
