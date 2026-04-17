import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CICDServicePage } from "@/components/pages/cicd-service-page"

describe("CICDServicePage", () => {
  it("renders the pipeline overview header", () => {
    render(<CICDServicePage />)
    expect(screen.getByText("CI/CD 流水线")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("搜索流水线、仓库、标签…")).toBeInTheDocument()
  })

  it("switches the selected pipeline from the list", () => {
    render(<CICDServicePage />)

    fireEvent.click(screen.getByRole("button", { name: /前端发布流水线/ }))

    expect(screen.getByText("面向 next-ui 和站点资源的前端发布流水线，支持标签触发与快速回退。")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "前端发布流水线" })).toBeInTheDocument()
  })

  it("shows stage content in the stage tab", () => {
    render(<CICDServicePage />)

    fireEvent.click(screen.getByRole("tab", { name: "阶段" }))

    expect(screen.getByText("阶段编排")).toBeInTheDocument()
    expect(screen.getByText("源码拉取")).toBeInTheDocument()
  })
})
