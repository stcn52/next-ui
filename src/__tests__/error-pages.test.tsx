import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

function NotFoundPage() {
  return (
    <div>
      <div>404</div>
      <h1>页面未找到</h1>
      <p>抱歉，你访问的页面不存在。</p>
      <Button>返回上一页</Button>
      <Button>回到首页</Button>
    </div>
  )
}

function ServerErrorPage() {
  return (
    <div>
      <div>500</div>
      <h1>服务器异常</h1>
      <p>服务器遇到了一个错误，请稍后重试。</p>
      <Button>刷新页面</Button>
      <Button>回到首页</Button>
    </div>
  )
}

function MaintenancePage() {
  return (
    <div>
      <h1>系统维护中</h1>
      <p>我们正在进行系统升级维护。</p>
    </div>
  )
}

describe("NotFoundPage", () => {
  it("renders 404 content", () => {
    render(<NotFoundPage />)
    expect(screen.getByText("404")).toBeInTheDocument()
    expect(screen.getByText("页面未找到")).toBeInTheDocument()
    expect(screen.getByText("返回上一页")).toBeInTheDocument()
    expect(screen.getByText("回到首页")).toBeInTheDocument()
  })
})

describe("ServerErrorPage", () => {
  it("renders 500 content", () => {
    render(<ServerErrorPage />)
    expect(screen.getByText("500")).toBeInTheDocument()
    expect(screen.getByText("服务器异常")).toBeInTheDocument()
    expect(screen.getByText("刷新页面")).toBeInTheDocument()
  })
})

describe("MaintenancePage", () => {
  it("renders maintenance content", () => {
    render(<MaintenancePage />)
    expect(screen.getByText("系统维护中")).toBeInTheDocument()
  })
})
