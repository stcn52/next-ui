import type { LucideIcon } from "lucide-react"
import {
  Activity,
  KeyRound,
  Monitor,
  ServerCog,
  Video,
} from "lucide-react"

export type TerminalSessionStatus = "在线" | "录屏中" | "待审批" | "已断开"
export type TerminalAuditState = "已留痕" | "待复核" | "风险"

export interface TerminalSessionSummary {
  id: string
  name: string
  host: string
  ip: string
  user: string
  bastion: string
  protocol: "SSH" | "RDP" | "K8s Exec"
  env: "生产" | "预发" | "开发"
  status: TerminalSessionStatus
  health: number
  tags: string[]
}

export interface TerminalCommand {
  command: string
  target: string
  time: string
  result: "成功" | "失败" | "审计中"
}

export interface TerminalRecording {
  title: string
  operator: string
  time: string
  duration: string
  state: "已保存" | "录制中" | "待审批"
}

export interface TerminalAuditEntry {
  title: string
  detail: string
  time: string
  state: TerminalAuditState
}

export interface TerminalShortcut {
  combo: string
  meaning: string
}

export interface TerminalSessionDetail extends TerminalSessionSummary {
  description: string
  region: string
  xterm: string
  auth: string
  mfa: string
  lastSeen: string
  lastCommand: string
  recordingPolicy: string
  auditPolicy: string
  terminalLines: string[]
  shortcuts: TerminalShortcut[]
  commands: TerminalCommand[]
  recordings: TerminalRecording[]
  audits: TerminalAuditEntry[]
  channels: string[]
}

export const TERMINAL_ICON_MAP: Record<string, LucideIcon> = {
  "支付 API 终端": Monitor,
  "数据库运维终端": ServerCog,
  "K8s 节点终端": Activity,
  "Windows 终端": KeyRound,
  "堡垒机录屏": Video,
}

export const TERMINAL_SESSION_SUMMARIES: TerminalSessionSummary[] = [
  {
    id: "payment-api",
    name: "支付 API 终端",
    host: "payment-api-01",
    ip: "10.12.8.31",
    user: "chenyang",
    bastion: "jump-a01",
    protocol: "SSH",
    env: "生产",
    status: "在线",
    health: 98,
    tags: ["XTerm", "MFA", "P0"],
  },
  {
    id: "db-ops",
    name: "数据库运维终端",
    host: "mysql-prod-03",
    ip: "10.12.9.14",
    user: "dba",
    bastion: "jump-a02",
    protocol: "SSH",
    env: "生产",
    status: "录屏中",
    health: 92,
    tags: ["录屏", "审计", "DDL"],
  },
  {
    id: "k8s-shell",
    name: "K8s 节点终端",
    host: "worker-07",
    ip: "10.12.11.77",
    user: "sre",
    bastion: "jump-a01",
    protocol: "K8s Exec",
    env: "预发",
    status: "待审批",
    health: 89,
    tags: ["审批", "命令白名单", "临时授权"],
  },
  {
    id: "windows-shell",
    name: "Windows 终端",
    host: "win-batch-02",
    ip: "10.18.4.53",
    user: "ops",
    bastion: "jump-b03",
    protocol: "RDP",
    env: "开发",
    status: "已断开",
    health: 84,
    tags: ["RDP", "录屏", "跳板"],
  },
  {
    id: "recording-hub",
    name: "堡垒机录屏",
    host: "jump-a01",
    ip: "10.20.1.18",
    user: "audit",
    bastion: "jump-center",
    protocol: "SSH",
    env: "生产",
    status: "录屏中",
    health: 95,
    tags: ["录屏", "审计留痕", "回放"],
  },
]

export const TERMINAL_SESSION_DETAILS: Record<string, TerminalSessionDetail> = {
  "payment-api": {
    ...TERMINAL_SESSION_SUMMARIES[0],
    description: "浏览器内 SSH 终端，采用 XTerm.js 渲染，面向生产支付主机的日常操作。",
    region: "华东-杭州",
    xterm: "XTerm.js / 兼容 256 色",
    auth: "SSO + MFA",
    mfa: "100%",
    lastSeen: "30 秒前",
    lastCommand: "kubectl logs payment-api-01 --tail=50",
    recordingPolicy: "P0 会话自动录屏，保留 180 天",
    auditPolicy: "敏感命令双人复核",
    terminalLines: [
      "chenyang@jump-a01 ~ % ssh payment-api-01",
      "Last login: Fri Apr 17 09:18:12 2026 from 10.12.0.44",
      "[root@payment-api-01 ~]# kubectl get pod -n pay-prod",
      "payment-api-01-6f8d9c8f7f-1   1/1   Running   0   4d12h",
      "payment-api-01-6f8d9c8f7f-2   1/1   Running   0   4d12h",
      "payment-worker-01-7bb5c5d6d9-1 1/1 Running 0 4d12h",
    ],
    shortcuts: [
      { combo: "Ctrl+Alt+F", meaning: "全屏终端" },
      { combo: "Ctrl+Shift+P", meaning: "命令面板" },
      { combo: "Ctrl+Shift+R", meaning: "开始录屏" },
      { combo: "Ctrl+L", meaning: "清屏" },
    ],
    commands: [
      { command: "kubectl get pod -n pay-prod", target: "payment-api-01", time: "1 分钟前", result: "成功" },
      { command: "tail -f /var/log/payment/error.log", target: "payment-api-01", time: "4 分钟前", result: "审计中" },
      { command: "df -h", target: "payment-api-01", time: "11 分钟前", result: "成功" },
    ],
    recordings: [
      { title: "支付主机排障片段", operator: "Chen Yang", time: "刚刚", duration: "07:42", state: "录制中" },
      { title: "证书更新回放", operator: "Ops Bot", time: "昨天 21:30", duration: "12:18", state: "已保存" },
      { title: "P0 变更审计", operator: "SRE", time: "昨天 18:05", duration: "09:54", state: "待审批" },
    ],
    audits: [
      { title: "MFA 已验证", detail: "登录通过二次认证", time: "30 秒前", state: "已留痕" },
      { title: "提权命令审计", detail: "sudo -i 已记录", time: "1 分钟前", state: "待复核" },
      { title: "敏感文件读取", detail: "/etc/secret.conf 已脱敏", time: "4 分钟前", state: "风险" },
    ],
    channels: ["SSH", "XTerm.js", "录屏审计"],
  },
  "db-ops": {
    ...TERMINAL_SESSION_SUMMARIES[1],
    description: "数据库操作终端，录屏和命令审计默认开启，适合 DDL 变更和排障。",
    region: "华东-上海",
    xterm: "XTerm.js / 兼容 ANSI 颜色",
    auth: "SSO + MFA",
    mfa: "100%",
    lastSeen: "2 分钟前",
    lastCommand: "mysql -h 127.0.0.1 -P 3306 -u root -p",
    recordingPolicy: "所有 DDL 自动录屏",
    auditPolicy: "命令脱敏后保存 365 天",
    terminalLines: [
      "dba@jump-a02 ~ % ssh mysql-prod-03",
      "mysql> show processlist;",
      "Id  User  Host  db  Command  Time  State  Info",
      "811 dba   10.12.9.14 pay Running 0  query  select * from orders limit 10;",
    ],
    shortcuts: [
      { combo: "Ctrl+Shift+R", meaning: "录屏开始/暂停" },
      { combo: "Ctrl+Alt+P", meaning: "提权审批" },
    ],
    commands: [
      { command: "show processlist;", target: "mysql-prod-03", time: "2 分钟前", result: "成功" },
      { command: "alter table orders add column extra json;", target: "mysql-prod-03", time: "12 分钟前", result: "审计中" },
    ],
    recordings: [
      { title: "DDL 变更回放", operator: "dba", time: "2 分钟前", duration: "05:16", state: "录制中" },
      { title: "慢查询排障", operator: "dba", time: "昨天 23:10", duration: "08:04", state: "已保存" },
    ],
    audits: [
      { title: "DDL 审批通过", detail: "表结构变更单号 CHG-2041", time: "14 分钟前", state: "已留痕" },
      { title: "危险命令拦截", detail: "drop database 未执行", time: "20 分钟前", state: "风险" },
    ],
    channels: ["SSH", "录屏", "审计留痕"],
  },
  "k8s-shell": {
    ...TERMINAL_SESSION_SUMMARIES[2],
    description: "面向 K8s 节点的临时运维终端，严格依赖审批和命令白名单。",
    region: "华北-北京",
    xterm: "XTerm.js / 兼容 24-bit 色彩",
    auth: "SSO + MFA + 临时授权",
    mfa: "100%",
    lastSeen: "5 分钟前",
    lastCommand: "crictl ps | grep payment",
    recordingPolicy: "审批后才允许录屏",
    auditPolicy: "白名单命令自动放行",
    terminalLines: [
      "sre@jump-a01 ~ % ssh worker-07",
      "[root@worker-07 ~]# crictl ps | grep payment",
      "payment-api-01   Running   4d12h",
    ],
    shortcuts: [
      { combo: "Ctrl+Shift+A", meaning: "申请临时授权" },
      { combo: "Ctrl+Shift+R", meaning: "请求录屏" },
    ],
    commands: [
      { command: "crictl ps | grep payment", target: "worker-07", time: "5 分钟前", result: "成功" },
      { command: "journalctl -u kubelet -n 50", target: "worker-07", time: "16 分钟前", result: "审计中" },
    ],
    recordings: [
      { title: "节点排障片段", operator: "sre", time: "5 分钟前", duration: "03:40", state: "待审批" },
    ],
    audits: [
      { title: "临时授权", detail: "15 分钟授权窗口", time: "刚刚", state: "待复核" },
    ],
    channels: ["SSH", "审批", "白名单"],
  },
  "windows-shell": {
    ...TERMINAL_SESSION_SUMMARIES[3],
    description: "Windows 服务器 RDP 终端，适合脚本执行和桌面级运维操作。",
    region: "华东-杭州",
    xterm: "XTerm.js / 兼容 RDP 代理",
    auth: "SSO + MFA",
    mfa: "100%",
    lastSeen: "18 分钟前",
    lastCommand: "powershell Get-Service",
    recordingPolicy: "RDP 会话默认录屏",
    auditPolicy: "PowerShell 命令脱敏",
    terminalLines: [
      "ops@jump-b03 ~ % rdp win-batch-02",
      "PS C:\\> Get-Service | Where-Object {$_.Status -eq 'Running'}",
      "Name        Status",
      "W32Time     Running",
    ],
    shortcuts: [
      { combo: "Ctrl+Alt+Del", meaning: "发送安全序列" },
      { combo: "Ctrl+Shift+R", meaning: "录屏" },
    ],
    commands: [
      { command: "Get-Service", target: "win-batch-02", time: "18 分钟前", result: "成功" },
    ],
    recordings: [
      { title: "Windows 服务巡检", operator: "ops", time: "18 分钟前", duration: "04:25", state: "已保存" },
    ],
    audits: [
      { title: "桌面登录", detail: "RDP 登录已记录", time: "18 分钟前", state: "已留痕" },
    ],
    channels: ["RDP", "录屏", "审计"],
  },
  "recording-hub": {
    ...TERMINAL_SESSION_SUMMARIES[4],
    description: "堡垒机录屏中枢，汇聚所有高危操作的录制和回放记录。",
    region: "华东-杭州",
    xterm: "XTerm.js / 审计模式",
    auth: "双因子 + 值班放行",
    mfa: "100%",
    lastSeen: "实时",
    lastCommand: "record start --session 2048",
    recordingPolicy: "全程录屏，自动回放索引",
    auditPolicy: "录屏回放双人审批",
    terminalLines: [
      "audit@jump-center ~ % record start --session 2048",
      "[recording] session 2048 attached",
      "[recording] live stream 00:07:42",
    ],
    shortcuts: [
      { combo: "Ctrl+Shift+R", meaning: "开始录屏" },
      { combo: "Ctrl+Shift+E", meaning: "导出片段" },
    ],
    commands: [
      { command: "record start --session 2048", target: "jump-a01", time: "刚刚", result: "成功" },
      { command: "record bookmark 00:07:11", target: "jump-a01", time: "2 分钟前", result: "成功" },
    ],
    recordings: [
      { title: "P0 变更录屏", operator: "audit", time: "刚刚", duration: "持续中", state: "录制中" },
      { title: "夜间巡检回放", operator: "audit", time: "昨天 23:50", duration: "22:10", state: "已保存" },
    ],
    audits: [
      { title: "录屏索引更新", detail: "生成片段书签", time: "刚刚", state: "已留痕" },
    ],
    channels: ["录屏", "回放", "审计"],
  },
}
