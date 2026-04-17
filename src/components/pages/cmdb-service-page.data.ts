import type { LucideIcon } from "lucide-react"
import {
  Database,
  GitBranch,
  Layers3,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Webhook,
} from "lucide-react"

export type ServiceTier = "P0" | "P1" | "P2"
export type ServiceStatus = "正常" | "告警" | "降级"

export interface CMDBServiceSummary {
  id: string
  name: string
  owner: string
  team: string
  tier: ServiceTier
  status: ServiceStatus
  health: number
  env: "生产" | "预发" | "开发"
  tags: string[]
}

export interface CMDBServiceChange {
  title: string
  actor: string
  time: string
  status: "成功" | "审核中" | "回滚"
}

export interface CMDBServiceIncident {
  title: string
  severity: "高" | "中" | "低"
  time: string
  status: "已恢复" | "处理中" | "已关闭"
}

export interface CMDBServiceConfigItem {
  name: string
  kind: string
  owner: string
  state: "已同步" | "待核验" | "异常"
  updatedAt: string
}

export interface CMDBServiceDetail extends CMDBServiceSummary {
  description: string
  region: string
  runtime: string
  version: string
  sla: string
  rto: string
  rpo: string
  lastChange: string
  lastSync: string
  contact: string
  upstream: string[]
  downstream: string[]
  changes: CMDBServiceChange[]
  incidents: CMDBServiceIncident[]
  configs: CMDBServiceConfigItem[]
}

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  核心支付服务: Rocket,
  订单中心: Layers3,
  用户中心: ShieldCheck,
  风控引擎: ShieldAlert,
  消息投递服务: Webhook,
  数据存储: Database,
  "API 网关": GitBranch,
}

export const SERVICE_SUMMARIES: CMDBServiceSummary[] = [
  {
    id: "payment-core",
    name: "核心支付服务",
    owner: "平台组",
    team: "支付中台",
    tier: "P0",
    status: "正常",
    health: 96,
    env: "生产",
    tags: ["支付", "核心链路", "高优先级"],
  },
  {
    id: "order-center",
    name: "订单中心",
    owner: "交易组",
    team: "交易平台",
    tier: "P1",
    status: "正常",
    health: 92,
    env: "生产",
    tags: ["订单", "交易", "SLA 99.95%"],
  },
  {
    id: "user-center",
    name: "用户中心",
    owner: "身份组",
    team: "账号体系",
    tier: "P1",
    status: "告警",
    health: 84,
    env: "生产",
    tags: ["账号", "鉴权", "风控前置"],
  },
  {
    id: "risk-engine",
    name: "风控引擎",
    owner: "风控组",
    team: "安全合规",
    tier: "P0",
    status: "正常",
    health: 98,
    env: "生产",
    tags: ["规则", "评分", "实时决策"],
  },
  {
    id: "message-delivery",
    name: "消息投递服务",
    owner: "基础架构组",
    team: "消息平台",
    tier: "P2",
    status: "正常",
    health: 89,
    env: "预发",
    tags: ["通知", "Webhook", "异步任务"],
  },
]

export const SERVICE_DETAILS: Record<string, CMDBServiceDetail> = {
  "payment-core": {
    ...SERVICE_SUMMARIES[0],
    description: "负责支付下单、扣款、结果回传，是 CMDB 中被依赖最广的核心服务。",
    region: "华东-杭州",
    runtime: "K8s / 6 副本",
    version: "v2.18.4",
    sla: "99.98%",
    rto: "5 分钟",
    rpo: "30 秒",
    lastChange: "2026-04-16 21:20",
    lastSync: "2 分钟前",
    contact: "oncall-payments@company.com",
    upstream: ["API 网关", "风控引擎", "用户中心"],
    downstream: ["订单中心", "消息投递服务", "数据存储"],
    changes: [
      { title: "配置限流阈值", actor: "Chen Yang", time: "20 分钟前", status: "成功" },
      { title: "灰度切换支付通道", actor: "Ava", time: "2 小时前", status: "审核中" },
      { title: "回滚超时重试策略", actor: "Ops Bot", time: "昨天 18:24", status: "回滚" },
    ],
    incidents: [
      { title: "第三方通道短时超时", severity: "高", time: "昨天 19:10", status: "已恢复" },
      { title: "订单确认延迟抖动", severity: "中", time: "本周二 14:30", status: "已关闭" },
    ],
    configs: [
      { name: "payment-core-prod", kind: "Deployment", owner: "平台组", state: "已同步", updatedAt: "2 分钟前" },
      { name: "payment-db-primary", kind: "PostgreSQL", owner: "DBA", state: "已同步", updatedAt: "18 分钟前" },
      { name: "payment-queue", kind: "Kafka Topic", owner: "消息平台", state: "待核验", updatedAt: "1 小时前" },
      { name: "risk-rule-pack", kind: "ConfigMap", owner: "风控组", state: "已同步", updatedAt: "6 分钟前" },
    ],
  },
  "order-center": {
    ...SERVICE_SUMMARIES[1],
    description: "承接订单写入和状态流转，负责将支付结果同步到订单域。",
    region: "华东-杭州",
    runtime: "K8s / 4 副本",
    version: "v1.9.2",
    sla: "99.95%",
    rto: "10 分钟",
    rpo: "1 分钟",
    lastChange: "2026-04-16 17:45",
    lastSync: "8 分钟前",
    contact: "oncall-orders@company.com",
    upstream: ["核心支付服务", "API 网关"],
    downstream: ["数据存储", "消息投递服务"],
    changes: [
      { title: "订单状态字段扩容", actor: "Mia", time: "30 分钟前", status: "成功" },
      { title: "补偿任务调度调整", actor: "Ops Bot", time: "3 小时前", status: "成功" },
    ],
    incidents: [
      { title: "订单确认重复消费", severity: "中", time: "昨天 09:20", status: "已关闭" },
    ],
    configs: [
      { name: "order-center-prod", kind: "Deployment", owner: "交易组", state: "已同步", updatedAt: "8 分钟前" },
      { name: "order-db", kind: "MySQL", owner: "DBA", state: "已同步", updatedAt: "21 分钟前" },
      { name: "order-event-topic", kind: "Kafka Topic", owner: "消息平台", state: "待核验", updatedAt: "45 分钟前" },
    ],
  },
  "user-center": {
    ...SERVICE_SUMMARIES[2],
    description: "统一处理登录态、用户档案与权限信息，是订单和风控的前置依赖。",
    region: "华北-北京",
    runtime: "K8s / 5 副本",
    version: "v3.2.0",
    sla: "99.90%",
    rto: "15 分钟",
    rpo: "1 分钟",
    lastChange: "2026-04-15 16:05",
    lastSync: "12 分钟前",
    contact: "oncall-identity@company.com",
    upstream: ["API 网关"],
    downstream: ["核心支付服务", "风控引擎"],
    changes: [
      { title: "登录 Token 刷新策略", actor: "Lina", time: "1 小时前", status: "审核中" },
    ],
    incidents: [
      { title: "单点登录抖动", severity: "低", time: "本周一 11:10", status: "已恢复" },
    ],
    configs: [
      { name: "user-center-prod", kind: "Deployment", owner: "身份组", state: "已同步", updatedAt: "12 分钟前" },
      { name: "identity-cache", kind: "Redis", owner: "基础架构组", state: "异常", updatedAt: "3 分钟前" },
      { name: "permission-rules", kind: "ConfigMap", owner: "身份组", state: "待核验", updatedAt: "1 小时前" },
    ],
  },
  "risk-engine": {
    ...SERVICE_SUMMARIES[3],
    description: "实时风控引擎，根据规则、画像和评分拦截高风险请求。",
    region: "华南-深圳",
    runtime: "K8s / 7 副本",
    version: "v5.4.1",
    sla: "99.99%",
    rto: "3 分钟",
    rpo: "15 秒",
    lastChange: "2026-04-16 13:05",
    lastSync: "1 分钟前",
    contact: "oncall-risk@company.com",
    upstream: ["用户中心", "API 网关"],
    downstream: ["核心支付服务"],
    changes: [
      { title: "规则集热更新", actor: "Risk Bot", time: "5 分钟前", status: "成功" },
    ],
    incidents: [
      { title: "规则加载延迟", severity: "中", time: "昨天 22:10", status: "已恢复" },
    ],
    configs: [
      { name: "risk-engine-prod", kind: "Deployment", owner: "风控组", state: "已同步", updatedAt: "1 分钟前" },
      { name: "risk-rule-pack", kind: "ConfigMap", owner: "风控组", state: "已同步", updatedAt: "5 分钟前" },
      { name: "risk-model-store", kind: "S3 Bucket", owner: "数据平台", state: "待核验", updatedAt: "16 分钟前" },
    ],
  },
  "message-delivery": {
    ...SERVICE_SUMMARIES[4],
    description: "负责异步消息、通知和 Webhook 投递，承接核心交易事件。",
    region: "华东-上海",
    runtime: "K8s / 3 副本",
    version: "v1.14.8",
    sla: "99.80%",
    rto: "20 分钟",
    rpo: "2 分钟",
    lastChange: "2026-04-14 10:30",
    lastSync: "9 分钟前",
    contact: "oncall-messaging@company.com",
    upstream: ["核心支付服务", "订单中心"],
    downstream: ["第三方 Webhook"],
    changes: [
      { title: "通知模板升级", actor: "Nora", time: "3 小时前", status: "成功" },
    ],
    incidents: [
      { title: "外部回调失败重试", severity: "低", time: "昨天 14:05", status: "已关闭" },
    ],
    configs: [
      { name: "message-delivery-prod", kind: "Deployment", owner: "基础架构组", state: "已同步", updatedAt: "9 分钟前" },
      { name: "notification-topic", kind: "Kafka Topic", owner: "消息平台", state: "已同步", updatedAt: "27 分钟前" },
      { name: "webhook-secret", kind: "Secret", owner: "安全组", state: "待核验", updatedAt: "45 分钟前" },
    ],
  },
}
