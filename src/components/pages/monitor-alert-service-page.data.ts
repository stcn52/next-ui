import type { LucideIcon } from "lucide-react"
import { AlertTriangle, Activity, Bell, MessagesSquare, Radar } from "lucide-react"

export type AlertServiceStatus = "正常" | "告警" | "静默"
export type AlertRuleState = "启用" | "待核验" | "静默"

export interface AlertServiceSummary {
  id: string
  name: string
  source: "Prometheus" | "Zabbix" | "混合"
  team: string
  owner: string
  status: AlertServiceStatus
  health: number
  tags: string[]
}

export interface AlertRule {
  name: string
  severity: "高" | "中" | "低"
  state: AlertRuleState
  threshold: string
}

export interface AlertRoute {
  channel: string
  target: string
  policy: string
  state: "已接入" | "灰度" | "待核验"
}

export interface AlertEvent {
  title: string
  source: string
  severity: "高" | "中" | "低"
  time: string
  status: "已收敛" | "处理中" | "已关闭"
}

export interface AlertDetail extends AlertServiceSummary {
  description: string
  region: string
  contact: string
  lastSync: string
  dedupWindow: string
  muteWindow: string
  mtta: string
  channels: string[]
  rules: AlertRule[]
  routes: AlertRoute[]
  events: AlertEvent[]
}

export const ALERT_SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "Prometheus 收敛总线": Activity,
  "Zabbix 主机监控": AlertTriangle,
  "告警路由中心": Bell,
  "值班通知编排": MessagesSquare,
  "静默窗口策略": Radar,
}

export const ALERT_SERVICE_SUMMARIES: AlertServiceSummary[] = [
  {
    id: "prometheus-bus",
    name: "Prometheus 收敛总线",
    source: "Prometheus",
    team: "监控平台",
    owner: "NOC",
    status: "告警",
    health: 92,
    tags: ["规则收敛", "实时告警", "P0"],
  },
  {
    id: "zabbix-host",
    name: "Zabbix 主机监控",
    source: "Zabbix",
    team: "基础架构",
    owner: "平台组",
    status: "正常",
    health: 95,
    tags: ["主机", "探针", "容量"],
  },
  {
    id: "alert-router",
    name: "告警路由中心",
    source: "混合",
    team: "监控平台",
    owner: "NOC",
    status: "正常",
    health: 97,
    tags: ["企微", "钉钉", "邮件"],
  },
  {
    id: "oncall-notify",
    name: "值班通知编排",
    source: "Prometheus",
    team: "SRE",
    owner: "值班组",
    status: "静默",
    health: 88,
    tags: ["值班", "升级", "静默窗口"],
  },
  {
    id: "mute-policy",
    name: "静默窗口策略",
    source: "混合",
    team: "监控平台",
    owner: "NOC",
    status: "正常",
    health: 90,
    tags: ["降噪", "分组", "收敛"],
  },
]

export const ALERT_SERVICE_DETAILS: Record<string, AlertDetail> = {
  "prometheus-bus": {
    ...ALERT_SERVICE_SUMMARIES[0],
    description: "聚合 Prometheus 告警并做去重、抑制和升级分发，减少同源噪音。",
    region: "华东-杭州",
    contact: "oncall-monitor@company.com",
    lastSync: "1 分钟前",
    dedupWindow: "5 分钟",
    muteWindow: "22:00 - 08:00",
    mtta: "3 分钟",
    channels: ["企微", "钉钉", "邮件"],
    rules: [
      { name: "CPU 饱和度", severity: "高", state: "启用", threshold: "> 90%" },
      { name: "接口错误率", severity: "高", state: "启用", threshold: "> 2%" },
      { name: "延迟抖动", severity: "中", state: "待核验", threshold: "> 300ms" },
      { name: "磁盘水位", severity: "中", state: "静默", threshold: "> 80%" },
    ],
    routes: [
      { channel: "企微", target: "支付中台值班群", policy: "P0 立即通知", state: "已接入" },
      { channel: "钉钉", target: "SRE 值班群", policy: "P1 分组通知", state: "已接入" },
      { channel: "邮件", target: "oncall-monitor@company.com", policy: "每日摘要", state: "灰度" },
    ],
    events: [
      { title: "支付接口错误率升高", source: "Prometheus", severity: "高", time: "1 分钟前", status: "处理中" },
      { title: "节点磁盘水位告警", source: "Prometheus", severity: "中", time: "18 分钟前", status: "已收敛" },
      { title: "CPU 饱和度短时峰值", source: "Prometheus", severity: "低", time: "昨天 23:20", status: "已关闭" },
    ],
  },
  "zabbix-host": {
    ...ALERT_SERVICE_SUMMARIES[1],
    description: "接入主机与网络设备监控，负责探针、阈值和离线告警的统一收口。",
    region: "华东-上海",
    contact: "infra-alert@company.com",
    lastSync: "4 分钟前",
    dedupWindow: "10 分钟",
    muteWindow: "23:00 - 07:00",
    mtta: "5 分钟",
    channels: ["企微", "邮件"],
    rules: [
      { name: "主机离线", severity: "高", state: "启用", threshold: "> 1 分钟" },
      { name: "磁盘剩余", severity: "中", state: "启用", threshold: "< 15%" },
      { name: "内存压力", severity: "中", state: "待核验", threshold: "> 85%" },
    ],
    routes: [
      { channel: "企微", target: "基础架构值班群", policy: "主机离线直达", state: "已接入" },
      { channel: "邮件", target: "infra-alert@company.com", policy: "日报摘要", state: "已接入" },
    ],
    events: [
      { title: "边界网关主机离线", source: "Zabbix", severity: "高", time: "14 分钟前", status: "已收敛" },
      { title: "存储节点磁盘告警", source: "Zabbix", severity: "中", time: "昨天 21:40", status: "已关闭" },
    ],
  },
  "alert-router": {
    ...ALERT_SERVICE_SUMMARIES[2],
    description: "将来自 Prometheus 和 Zabbix 的告警统一路由到企微、钉钉和邮件通道。",
    region: "华东-杭州",
    contact: "routing-noc@company.com",
    lastSync: "2 分钟前",
    dedupWindow: "3 分钟",
    muteWindow: "按值班表",
    mtta: "2 分钟",
    channels: ["企微", "钉钉", "邮件"],
    rules: [
      { name: "P0 收敛", severity: "高", state: "启用", threshold: "单实例只保留 1 条" },
      { name: "重复抑制", severity: "中", state: "启用", threshold: "5 分钟内去重" },
      { name: "升级通知", severity: "中", state: "待核验", threshold: "30 分钟未恢复" },
    ],
    routes: [
      { channel: "企微", target: "一线值班群", policy: "P0 / P1", state: "已接入" },
      { channel: "钉钉", target: "二线支持群", policy: "升级通知", state: "已接入" },
      { channel: "邮件", target: "ops-dispatch@company.com", policy: "汇总周报", state: "已接入" },
    ],
    events: [
      { title: "支付服务重复告警已收敛", source: "Prometheus", severity: "高", time: "2 分钟前", status: "已收敛" },
      { title: "Zabbix 离线告警转发", source: "Zabbix", severity: "中", time: "21 分钟前", status: "已关闭" },
    ],
  },
  "oncall-notify": {
    ...ALERT_SERVICE_SUMMARIES[3],
    description: "值班通知编排中心，负责告警升级、静默、轮值和摘要推送。",
    region: "华北-北京",
    contact: "oncall-sre@company.com",
    lastSync: "7 分钟前",
    dedupWindow: "8 分钟",
    muteWindow: "23:30 - 06:30",
    mtta: "6 分钟",
    channels: ["企微", "钉钉"],
    rules: [
      { name: "夜间升级", severity: "高", state: "启用", threshold: "10 分钟未确认" },
      { name: "静默窗口", severity: "中", state: "启用", threshold: "按值班表" },
    ],
    routes: [
      { channel: "企微", target: "值班升级群", policy: "夜间 P0", state: "已接入" },
      { channel: "钉钉", target: "值班经理", policy: "二次升级", state: "灰度" },
    ],
    events: [
      { title: "夜间告警升级通知", source: "Prometheus", severity: "高", time: "7 分钟前", status: "已收敛" },
    ],
  },
  "mute-policy": {
    ...ALERT_SERVICE_SUMMARIES[4],
    description: "管理静默窗口、节假日屏蔽和批量抑制规则，减少非工作时间噪音。",
    region: "华东-杭州",
    contact: "noc-policy@company.com",
    lastSync: "3 分钟前",
    dedupWindow: "15 分钟",
    muteWindow: "全天候可配置",
    mtta: "4 分钟",
    channels: ["企微", "邮件"],
    rules: [
      { name: "节假日静默", severity: "中", state: "启用", threshold: "按日历" },
      { name: "批量抑制", severity: "低", state: "启用", threshold: "同源合并" },
    ],
    routes: [
      { channel: "企微", target: "监控平台群", policy: "策略变更通知", state: "已接入" },
      { channel: "邮件", target: "noc-policy@company.com", policy: "每日摘要", state: "已接入" },
    ],
    events: [
      { title: "静默窗口策略更新", source: "Prometheus", severity: "低", time: "3 分钟前", status: "已关闭" },
    ],
  },
}
