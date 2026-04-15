import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>欢迎回来</CardTitle>
        <CardDescription>登录你的账户以继续</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="login-email">邮箱</Label>
        <Input id="login-email" type="email" placeholder="name@example.com" />
        <Label htmlFor="login-password">密码</Label>
        <Input id="login-password" type="password" placeholder="••••••••" />
        <Checkbox id="remember" />
        <Label htmlFor="remember">记住我</Label>
        <Button>登录</Button>
      </CardContent>
    </Card>
  )
}

function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>创建账户</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="reg-email">邮箱</Label>
        <Input id="reg-email" type="email" placeholder="name@example.com" />
        <Label htmlFor="reg-password">密码</Label>
        <Input id="reg-password" type="password" placeholder="至少 8 个字符" />
        <Button>注册</Button>
      </CardContent>
    </Card>
  )
}

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sent ? "邮件已发送" : "忘记密码"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!sent ? (
          <>
            <Label htmlFor="forgot-email">邮箱</Label>
            <Input id="forgot-email" type="email" placeholder="name@example.com" />
            <Button onClick={() => setSent(true)}>发送重置链接</Button>
          </>
        ) : (
          <Button onClick={() => setSent(false)}>重新发送</Button>
        )}
      </CardContent>
    </Card>
  )
}

describe("LoginPage", () => {
  it("renders title and form fields", () => {
    render(<LoginPage />)
    expect(screen.getByText("欢迎回来")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
    expect(screen.getByText("登录")).toBeInTheDocument()
  })

  it("allows typing in email and password", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    const email = screen.getByPlaceholderText("name@example.com")
    const password = screen.getByPlaceholderText("••••••••")
    await user.type(email, "test@example.com")
    await user.type(password, "secret123")
    expect(email).toHaveValue("test@example.com")
    expect(password).toHaveValue("secret123")
  })
})

describe("RegisterPage", () => {
  it("renders registration form", () => {
    render(<RegisterPage />)
    expect(screen.getByText("创建账户")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("至少 8 个字符")).toBeInTheDocument()
    expect(screen.getByText("注册")).toBeInTheDocument()
  })
})

describe("ForgotPasswordPage", () => {
  it("shows forgot password form initially", () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByText("忘记密码")).toBeInTheDocument()
    expect(screen.getByText("发送重置链接")).toBeInTheDocument()
  })

  it("switches to sent state on click", async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    await user.click(screen.getByText("发送重置链接"))
    expect(screen.getByText("邮件已发送")).toBeInTheDocument()
    expect(screen.getByText("重新发送")).toBeInTheDocument()
  })

  it("can resend from sent state", async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    await user.click(screen.getByText("发送重置链接"))
    await user.click(screen.getByText("重新发送"))
    expect(screen.getByText("忘记密码")).toBeInTheDocument()
  })
})
