/**
 * Auth Pages — Login, Register, Forgot Password templates.
 * Demonstrates Card, Form, Input, Button, Checkbox, Separator composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Input } from "@/components/ui/inputs/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/inputs/label"
import { Checkbox } from "@/components/ui/inputs/checkbox"
import { Separator } from "@/components/ui/display/separator"

const meta: Meta = {
  title: "Pages/Auth",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Authentication page templates: Login, Register, and Forgot Password. " +
          "Composes Card, Input, Button, Checkbox, and Label components.",
      },
    },
  },
}

export default meta
type Story = StoryObj

function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">
            U
          </div>
          <CardTitle className="text-xl">欢迎回来</CardTitle>
          <CardDescription>登录你的账户以继续</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="login-email">邮箱</Label>
            <Input id="login-email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">密码</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                忘记密码？
              </a>
            </div>
            <Input id="login-password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              记住我
            </Label>
          </div>
          <Button className="w-full">登录</Button>
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              或
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">GitHub</Button>
            <Button variant="outline" size="sm">Google</Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            还没有账户？{" "}
            <a href="#" className="text-primary hover:underline">注册</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">创建账户</CardTitle>
          <CardDescription>填写以下信息以注册</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="reg-first">姓</Label>
              <Input id="reg-first" placeholder="张" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-last">名</Label>
              <Input id="reg-last" placeholder="三" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">邮箱</Label>
            <Input id="reg-email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">密码</Label>
            <Input id="reg-password" type="password" placeholder="至少 8 个字符" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-confirm">确认密码</Label>
            <Input id="reg-confirm" type="password" placeholder="再次输入密码" />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="terms" className="mt-0.5" />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug">
              我同意{" "}
              <a href="#" className="text-primary hover:underline">
                服务条款
              </a>{" "}
              和{" "}
              <a href="#" className="text-primary hover:underline">
                隐私政策
              </a>
            </Label>
          </div>
          <Button className="w-full">注册</Button>
          <p className="text-center text-xs text-muted-foreground">
            已有账户？{" "}
            <a href="#" className="text-primary hover:underline">登录</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {sent ? "邮件已发送" : "忘记密码"}
          </CardTitle>
          <CardDescription>
            {sent
              ? "请检查你的邮箱，点击链接重置密码"
              : "输入你的邮箱地址，我们将发送重置链接"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!sent ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="forgot-email">邮箱</Label>
                <Input id="forgot-email" type="email" placeholder="name@example.com" />
              </div>
              <Button className="w-full" onClick={() => setSent(true)}>
                发送重置链接
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
              重新发送
            </Button>
          )}
          <p className="text-center text-xs text-muted-foreground">
            <a href="#" className="text-primary hover:underline">返回登录</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export const Login: Story = {
  name: "Login",
  render: () => <LoginPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("欢迎回来")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("name@example.com")).toBeInTheDocument()
  },
}

export const Register: Story = {
  name: "Register",
  render: () => <RegisterPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("创建账户")).toBeInTheDocument()
  },
}

export const ForgotPassword: Story = {
  name: "Forgot Password",
  render: () => <ForgotPasswordPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("忘记密码")).toBeInTheDocument()
    await expect(canvas.getByText("发送重置链接")).toBeInTheDocument()
  },
}
