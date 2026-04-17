import type { LucideIcon } from "lucide-react"
import {
  Clock3,
  FileDown,
  GitBranch,
  PlayCircle,
  TimerReset,
} from "lucide-react"

export type JobType = "Cron" | "Batch" | "Adhoc" | "Distribution"
export type JobStatus = "运行中" | "等待" | "暂停" | "失败"

export interface JobSummary {
  id: string
  name: string
  type: JobType
  owner: string
  team: string
  schedule: string
  status: JobStatus
  successRate: number
  lastRun: string
  tags: string[]
}

export interface JobHistoryItem {
  task: string
  time: string
  status: "成功" | "失败" | "重试"
  duration: string
}

export interface JobDetail extends JobSummary {
  description: string
  queue: string
  timeout: string
  retryPolicy: string
  targetCount: number
  dryRun: boolean
  integration: string[]
  history: JobHistoryItem[]
  scheduleRules: Array<{ label: string; value: string }>
}

export const JOB_ICON_MAP: Record<string, LucideIcon> = {
  批量脚本执行: PlayCircle,
  文件分发: FileDown,
  夜间巡检: Clock3,
  定时巡检: Clock3,
  备份清理: TimerReset,
  数据同步: GitBranch,
}

export const JOB_SUMMARIES: JobSummary[] = [
  {
    id: "batch-script",
    name: "批量脚本执行",
    type: "Batch",
    owner: "SRE",
    team: "运维自动化",
    schedule: "手动 / API 触发",
    status: "运行中",
    successRate: 99,
    lastRun: "1 分钟前",
    tags: ["批量", "高危", "带审批"],
  },
  {
    id: "file-distribution",
    name: "文件分发",
    type: "Distribution",
    owner: "平台组",
    team: "基础架构",
    schedule: "*/15 * * * *",
    status: "等待",
    successRate: 97,
    lastRun: "14 分钟前",
    tags: ["分发", "多目标", "灰度"],
  },
  {
    id: "nightly-cron",
    name: "夜间巡检",
    type: "Cron",
    owner: "NOC",
    team: "监控平台",
    schedule: "0 2 * * *",
    status: "等待",
    successRate: 100,
    lastRun: "昨天 02:00",
    tags: ["巡检", "Cron", "报表"],
  },
  {
    id: "backup-cleanup",
    name: "备份清理",
    type: "Cron",
    owner: "DBA",
    team: "数据平台",
    schedule: "0 4 * * 0",
    status: "暂停",
    successRate: 96,
    lastRun: "上周日 04:00",
    tags: ["备份", "清理", "留存"],
  },
  {
    id: "data-sync",
    name: "数据同步",
    type: "Adhoc",
    owner: "业务中台",
    team: "数据集成",
    schedule: "事件触发",
    status: "失败",
    successRate: 91,
    lastRun: "6 分钟前",
    tags: ["同步", "重试", "跨系统"],
  },
]

export const JOB_DETAILS: Record<string, JobDetail> = {
  "batch-script": {
    ...JOB_SUMMARIES[0],
    description: "支撑批量脚本执行、主机巡检与发布前校验，支持审批和黑白名单。",
    queue: "ops-batch",
    timeout: "20 分钟",
    retryPolicy: "最多 2 次 / 指数退避",
    targetCount: 128,
    dryRun: false,
    integration: ["SSH", "Ansible", "Shell"],
    history: [
      { task: "补齐证书文件", time: "1 分钟前", status: "成功", duration: "52s" },
      { task: "主机批量巡检", time: "16 分钟前", status: "重试", duration: "2m 11s" },
      { task: "清理旧日志", time: "昨天 23:20", status: "成功", duration: "1m 08s" },
    ],
    scheduleRules: [
      { label: "执行入口", value: "API / 手动触发" },
      { label: "审批", value: "100 台以上需审批" },
      { label: "超时", value: "20 分钟" },
      { label: "重试", value: "2 次" },
    ],
  },
  "file-distribution": {
    ...JOB_SUMMARIES[1],
    description: "对接分发平台，向多组目标主机推送制品、配置和补丁文件。",
    queue: "ops-distribution",
    timeout: "15 分钟",
    retryPolicy: "最多 3 次 / 线性退避",
    targetCount: 44,
    dryRun: true,
    integration: ["SCP", "HTTP Download", "CDN"],
    history: [
      { task: "发布配置包", time: "14 分钟前", status: "成功", duration: "48s" },
      { task: "同步补丁包", time: "昨天 22:18", status: "成功", duration: "2m 30s" },
    ],
    scheduleRules: [
      { label: "同步频率", value: "15 分钟" },
      { label: "发布模式", value: "先预发再生产" },
      { label: "目标选择", value: "按标签 / 应用树" },
    ],
  },
  "nightly-cron": {
    ...JOB_SUMMARIES[2],
    description: "用于夜间巡检、配置漂移检查和结果报表生成的 Cron 任务。",
    queue: "ops-cron",
    timeout: "8 分钟",
    retryPolicy: "失败立即重试 1 次",
    targetCount: 12,
    dryRun: false,
    integration: ["Prometheus", "CMDB", "Mail"],
    history: [
      { task: "夜间巡检", time: "昨天 02:00", status: "成功", duration: "1m 02s" },
      { task: "报表生成", time: "前天 02:00", status: "成功", duration: "44s" },
    ],
    scheduleRules: [
      { label: "Cron", value: "0 2 * * *" },
      { label: "执行窗口", value: "02:00 - 02:15" },
      { label: "输出", value: "巡检报告 / 邮件" },
    ],
  },
  "backup-cleanup": {
    ...JOB_SUMMARIES[3],
    description: "定期清理过期备份，防止存储资源膨胀，并保留审计记录。",
    queue: "ops-maintenance",
    timeout: "30 分钟",
    retryPolicy: "失败人工确认后重跑",
    targetCount: 8,
    dryRun: false,
    integration: ["S3", "NAS", "DBA Tool"],
    history: [
      { task: "清理备份", time: "上周日 04:00", status: "成功", duration: "5m 10s" },
    ],
    scheduleRules: [
      { label: "Cron", value: "0 4 * * 0" },
      { label: "保留策略", value: "30 天" },
      { label: "审批", value: "DBA 审批" },
    ],
  },
  "data-sync": {
    ...JOB_SUMMARIES[4],
    description: "跨系统数据同步与修复作业，支持失败重试和问题复盘。",
    queue: "ops-sync",
    timeout: "12 分钟",
    retryPolicy: "最多 2 次 / 立即重试",
    targetCount: 62,
    dryRun: false,
    integration: ["API", "Webhook", "消息队列"],
    history: [
      { task: "主数据同步", time: "6 分钟前", status: "失败", duration: "3m 20s" },
      { task: "重试同步", time: "4 分钟前", status: "重试", duration: "1m 58s" },
    ],
    scheduleRules: [
      { label: "触发方式", value: "事件 + 手动" },
      { label: "重试", value: "2 次" },
      { label: "告警", value: "失败发群通知" },
    ],
  },
}
