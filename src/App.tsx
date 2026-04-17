import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"
import { Badge } from "@/components/ui/display/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/display/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/display/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlays/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/overlays/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/display/alert"
import { Separator } from "@/components/ui/display/separator"
import { Skeleton } from "@/components/ui/display/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-foreground border-b pb-2">{title}</h2>
      <div className="flex flex-wrap gap-3 items-start">{children}</div>
    </section>
  )
}

function App() {
  const [, setInputValue] = useState("")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              UI
            </div>
            <span className="font-semibold text-lg">自定义 UI 库</span>
            <Badge variant="secondary">基于 shadcn/ui v3</Badge>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm">文档</Button>
            <Button variant="ghost" size="sm">组件</Button>
            <Button size="sm">开始使用</Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">打造你的 UI 组件库</h1>
          <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
            基于 shadcn/ui v3 · Tailwind CSS v4 · React 19 · Vite 构建的纯前端组件库
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => toast.success("欢迎使用 UI 库！", { description: "开始探索组件吧" })}
            >
              快速开始
            </Button>
            <Button size="lg" variant="outline">查看文档</Button>
          </div>
        </div>

        {/* Buttons */}
        <Section title="Button 按钮">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </Section>

        {/* Badge */}
        <Section title="Badge 徽章">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Section>

        {/* Avatar */}
        <Section title="Avatar 头像">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>YZ</AvatarFallback>
          </Avatar>
        </Section>

        {/* Alert */}
        <Section title="Alert 警告">
          <Alert className="w-full max-w-lg">
            <AlertTitle>提示</AlertTitle>
            <AlertDescription>这是一条普通提示信息，用于展示 Alert 组件的默认样式。</AlertDescription>
          </Alert>
          <Alert variant="destructive" className="w-full max-w-lg">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>出现了一个错误，请检查你的输入后重试。</AlertDescription>
          </Alert>
        </Section>

        {/* Input & Form */}
        <Section title="Input / Label 输入框">
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="请输入密码" />
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="disabled">禁用状态</Label>
            <Input id="disabled" disabled placeholder="不可编辑" />
          </div>
        </Section>

        {/* Select */}
        <Section title="Select 选择器">
          <Select>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="选择框架" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        {/* Tabs */}
        <Section title="Tabs 标签页">
          <Tabs defaultValue="account" className="w-full max-w-lg">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">账户</TabsTrigger>
              <TabsTrigger value="password">密码</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>账户信息</CardTitle>
                  <CardDescription>修改你的个人账户信息。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label>用户名</Label>
                    <Input defaultValue="chenyang" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>保存更改</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>修改密码</CardTitle>
                  <CardDescription>确保你的账户使用强密码。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label>当前密码</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label>新密码</Label>
                    <Input type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>更新密码</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>偏好设置</CardTitle>
                  <CardDescription>管理你的应用偏好设置。</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">设置内容即将推出...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Section>

        {/* Card */}
        <Section title="Card 卡片">
          <Card className="w-72">
            <CardHeader>
              <CardTitle>项目统计</CardTitle>
              <CardDescription>本月项目数据概览</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">+20.1% 较上月</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">查看详情</Button>
            </CardFooter>
          </Card>
          <Card className="w-72">
            <CardHeader>
              <CardTitle>团队成员</CardTitle>
              <CardDescription>邀请成员协作</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">邀请成员</Button>
            </CardFooter>
          </Card>
        </Section>

        {/* Dialog & Dropdown */}
        <Section title="Dialog 对话框 / DropdownMenu 下拉菜单">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">打开对话框</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认操作</DialogTitle>
                <DialogDescription>
                  你确定要执行此操作吗？此操作不可撤销。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">取消</Button>
                <Button onClick={() => toast.error("已删除！")}>确认删除</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">下拉菜单</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("跳转到个人资料")}>个人资料</DropdownMenuItem>
              <DropdownMenuItem>账单</DropdownMenuItem>
              <DropdownMenuItem>设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        {/* Separator */}
        <Section title="Separator 分隔符">
          <div className="w-full max-w-lg">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Radix UI</h4>
              <p className="text-sm text-muted-foreground">一个开源的无样式 UI 组件库。</p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>Blog</div>
              <Separator orientation="vertical" />
              <div>Docs</div>
              <Separator orientation="vertical" />
              <div>Source</div>
            </div>
          </div>
        </Section>

        {/* Skeleton */}
        <Section title="Skeleton 骨架屏">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <Card className="w-72">
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        </Section>

        {/* Toast */}
        <Section title="Sonner Toast 通知">
          <Button onClick={() => toast("普通消息通知")} variant="outline">默认</Button>
          <Button onClick={() => toast.success("操作成功！")} variant="outline">成功</Button>
          <Button onClick={() => toast.error("发生错误！")} variant="outline">错误</Button>
          <Button onClick={() => toast.warning("警告提示！")} variant="outline">警告</Button>
          <Button onClick={() => toast.info("这是一条信息")} variant="outline">信息</Button>
          <Button
            onClick={() =>
              toast("带操作的通知", {
                description: "这是通知的详细描述内容",
                action: { label: "撤销", onClick: () => toast.success("已撤销") },
              })
            }
            variant="outline"
          >
            带操作
          </Button>
        </Section>
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          基于{" "}
          <a href="https://v3.shadcn.com" className="underline underline-offset-4 hover:text-foreground" target="_blank" rel="noreferrer">
            shadcn/ui v3
          </a>{" "}
          构建的纯前端 UI 组件库 · React 19 · Tailwind CSS v4 · Vite
        </div>
      </footer>
    </div>
  )
}

export default App
