import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  GitBranch,
  Rocket,
  ShieldCheck,
} from "lucide-react"

export type CICDEngine = "GitLab" | "GitHub Actions" | "Jenkins" | "Tekton"
export type CICDPipelineStatus = "成功" | "运行中" | "失败" | "暂停"

export interface CICDPipelineSummary {
  id: string
  name: string
  repo: string
  team: string
  engine: CICDEngine
  branch: string
  status: CICDPipelineStatus
  health: number
  tags: string[]
}

export interface CICDStage {
  name: string
  owner: string
  state: "成功" | "运行中" | "失败" | "待确认" | "暂停"
  duration: string
}

export interface CICDRun {
  build: string
  commit: string
  actor: string
  time: string
  status: "成功" | "失败" | "回滚"
  duration: string
}

export interface CICDPipelineDetail extends CICDPipelineSummary {
  description: string
  trigger: string
  approval: string
  artifact: string
  leadTime: string
  lastBuild: string
  environments: string[]
  integrations: string[]
  checks: Array<{ label: string; value: string }>
  stages: CICDStage[]
  runs: CICDRun[]
}

export const CICD_ICON_MAP: Record<string, LucideIcon> = {
  "核心支付流水线": Rocket,
  "前端发布流水线": GitBranch,
  "镜像构建流水线": Boxes,
  "灰度部署流水线": GitBranch,
  "紧急修复流水线": ShieldCheck,
}

export const CICD_PIPELINE_SUMMARIES: CICDPipelineSummary[] = [
  {
    id: "payment-release",
    name: "核心支付流水线",
    repo: "gitlab.company.com/payments/core",
    team: "支付中台",
    engine: "GitLab",
    branch: "main",
    status: "运行中",
    health: 97,
    tags: ["构建", "发布", "P0"],
  },
  {
    id: "frontend-release",
    name: "前端发布流水线",
    repo: "github.com/stcn52/next-ui",
    team: "前端平台",
    engine: "GitHub Actions",
    branch: "release/*",
    status: "成功",
    health: 94,
    tags: ["前端", "静态资源", "预发"],
  },
  {
    id: "image-build",
    name: "镜像构建流水线",
    repo: "gitlab.company.com/platform/images",
    team: "基础架构",
    engine: "Jenkins",
    branch: "stable",
    status: "成功",
    health: 91,
    tags: ["镜像", "制品", "缓存"],
  },
  {
    id: "gray-release",
    name: "灰度部署流水线",
    repo: "gitlab.company.com/platform/deploy",
    team: "发布平台",
    engine: "Tekton",
    branch: "main",
    status: "运行中",
    health: 88,
    tags: ["灰度", "流量", "自动回滚"],
  },
  {
    id: "hotfix-release",
    name: "紧急修复流水线",
    repo: "github.com/stcn52/ops-runbooks",
    team: "运维自动化",
    engine: "GitHub Actions",
    branch: "hotfix/*",
    status: "暂停",
    health: 83,
    tags: ["修复", "审批", "应急"],
  },
]

export const CICD_PIPELINE_DETAILS: Record<string, CICDPipelineDetail> = {
  "payment-release": {
    ...CICD_PIPELINE_SUMMARIES[0],
    description: "连接 GitLab、Jenkins 和 Tekton 的支付域流水线，统一完成构建、制品、灰度和生产发布。",
    trigger: "Merge Request / Tag / 手动",
    approval: "P0 生产发布需双人审批",
    artifact: "payment-core:2.18.4",
    leadTime: "11 分钟",
    lastBuild: "2 分钟前",
    environments: ["预发", "灰度", "生产"],
    integrations: ["GitLab", "Jenkins", "Kubernetes", "Argo Rollouts"],
    checks: [
      { label: "构建时长", value: "7m 42s" },
      { label: "失败重试", value: "2 次" },
      { label: "发布窗口", value: "21:00 - 23:00" },
      { label: "回滚策略", value: "自动回滚 + 人工确认" },
    ],
    stages: [
      { name: "源码拉取", owner: "平台组", state: "成功", duration: "18s" },
      { name: "单元测试", owner: "QA Bot", state: "成功", duration: "2m 10s" },
      { name: "镜像构建", owner: "CI Bot", state: "成功", duration: "3m 21s" },
      { name: "灰度部署", owner: "发布平台", state: "运行中", duration: "1m 06s" },
    ],
    runs: [
      { build: "build-2198", commit: "a1c9b7d", actor: "Chen Yang", time: "2 分钟前", status: "成功", duration: "7m 42s" },
      { build: "build-2197", commit: "9f31c02", actor: "Ops Bot", time: "18 分钟前", status: "成功", duration: "8m 11s" },
      { build: "build-2196", commit: "7d8a0ef", actor: "Mia", time: "昨天 20:45", status: "回滚", duration: "9m 03s" },
    ],
  },
  "frontend-release": {
    ...CICD_PIPELINE_SUMMARIES[1],
    description: "面向 next-ui 和站点资源的前端发布流水线，支持标签触发与快速回退。",
    trigger: "Tag / Release Branch",
    approval: "预发自动，生产需发布确认",
    artifact: "next-ui-docs:0.2.1",
    leadTime: "8 分钟",
    lastBuild: "14 分钟前",
    environments: ["预发", "生产"],
    integrations: ["GitHub Actions", "Vercel", "Cloudflare"],
    checks: [
      { label: "构建时长", value: "3m 20s" },
      { label: "失败重试", value: "1 次" },
      { label: "发布窗口", value: "工作日 10:00 - 18:00" },
      { label: "回滚策略", value: "版本回退" },
    ],
    stages: [
      { name: "Lint", owner: "CI Bot", state: "成功", duration: "35s" },
      { name: "Test", owner: "CI Bot", state: "成功", duration: "1m 20s" },
      { name: "Build", owner: "CI Bot", state: "成功", duration: "1m 15s" },
      { name: "Deploy", owner: "前端平台", state: "成功", duration: "30s" },
    ],
    runs: [
      { build: "v0.2.1", commit: "5baf20a", actor: "Release Bot", time: "14 分钟前", status: "成功", duration: "3m 20s" },
      { build: "v0.2.0", commit: "1c29b70", actor: "Release Bot", time: "昨天 19:10", status: "成功", duration: "3m 45s" },
    ],
  },
  "image-build": {
    ...CICD_PIPELINE_SUMMARIES[2],
    description: "统一构建基础镜像与制品缓存，供多个服务复用，降低重复构建成本。",
    trigger: "定时 / 手动 / 上游变更",
    approval: "基础镜像变更需安全组审批",
    artifact: "platform/base-image:2026.04.17",
    leadTime: "16 分钟",
    lastBuild: "27 分钟前",
    environments: ["构建池", "制品库"],
    integrations: ["Jenkins", "Harbor", "Nexus"],
    checks: [
      { label: "构建时长", value: "12m 14s" },
      { label: "失败重试", value: "3 次" },
      { label: "发布窗口", value: "24x7" },
      { label: "回滚策略", value: "版本锁定" },
    ],
    stages: [
      { name: "基础层拉取", owner: "基础架构", state: "成功", duration: "2m 02s" },
      { name: "依赖安装", owner: "CI Bot", state: "成功", duration: "4m 24s" },
      { name: "镜像打包", owner: "CI Bot", state: "成功", duration: "3m 52s" },
      { name: "推送制品库", owner: "制品平台", state: "成功", duration: "1m 56s" },
    ],
    runs: [
      { build: "img-7044", commit: "d3b6c11", actor: "Jenkins", time: "27 分钟前", status: "成功", duration: "12m 14s" },
      { build: "img-7043", commit: "9d30b56", actor: "Jenkins", time: "昨天 23:10", status: "失败", duration: "11m 03s" },
    ],
  },
  "gray-release": {
    ...CICD_PIPELINE_SUMMARIES[3],
    description: "Tekton 编排的灰度部署流水线，负责流量切换、健康检查和自动回滚。",
    trigger: "变更单 / 手动审批",
    approval: "生产灰度前需值班确认",
    artifact: "deploy-plan:2026.04.17-03",
    leadTime: "13 分钟",
    lastBuild: "6 分钟前",
    environments: ["灰度", "生产"],
    integrations: ["Tekton", "Kubernetes", "Argo Rollouts"],
    checks: [
      { label: "构建时长", value: "9m 08s" },
      { label: "失败重试", value: "2 次" },
      { label: "发布窗口", value: "晚高峰外" },
      { label: "回滚策略", value: "自动切流" },
    ],
    stages: [
      { name: "变更校验", owner: "发布平台", state: "成功", duration: "22s" },
      { name: "灰度扩容", owner: "发布平台", state: "成功", duration: "2m 01s" },
      { name: "流量切换", owner: "SRE", state: "运行中", duration: "1m 24s" },
      { name: "观察窗口", owner: "NOC", state: "待确认", duration: "10m" },
    ],
    runs: [
      { build: "gray-901", commit: "cc1f18a", actor: "Release Bot", time: "6 分钟前", status: "成功", duration: "9m 08s" },
      { build: "gray-900", commit: "b4a9d02", actor: "SRE", time: "昨天 22:00", status: "回滚", duration: "10m 17s" },
    ],
  },
  "hotfix-release": {
    ...CICD_PIPELINE_SUMMARIES[4],
    description: "紧急修复和热更新流水线，支持审批放行、手工确认和快速恢复。",
    trigger: "手动 / 值班指令",
    approval: "紧急变更需值班经理审批",
    artifact: "ops-runbook:hotfix-20260417",
    leadTime: "21 分钟",
    lastBuild: "昨天 21:40",
    environments: ["预发", "生产"],
    integrations: ["GitHub Actions", "Slack", "PagerDuty"],
    checks: [
      { label: "构建时长", value: "5m 50s" },
      { label: "失败重试", value: "人工确认" },
      { label: "发布窗口", value: "应急窗口" },
      { label: "回滚策略", value: "脚本回退" },
    ],
    stages: [
      { name: "审批确认", owner: "值班经理", state: "待确认", duration: "待定" },
      { name: "构建验证", owner: "CI Bot", state: "暂停", duration: "等待" },
      { name: "生产执行", owner: "SRE", state: "待确认", duration: "待定" },
    ],
    runs: [
      { build: "hotfix-017", commit: "f7d9a41", actor: "Ops Bot", time: "昨天 21:40", status: "失败", duration: "6m 02s" },
    ],
  },
}
