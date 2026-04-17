import type { LucideIcon } from "lucide-react"
import {
  Cloud,
  Network,
  ServerCog,
  TreePine,
} from "lucide-react"

export type AssetType = "主机" | "云资源" | "网络设备" | "应用树"
export type AssetStatus = "正常" | "告警" | "变更中"

export interface AssetSummary {
  id: string
  name: string
  type: AssetType
  owner: string
  team: string
  env: "生产" | "预发" | "开发"
  status: AssetStatus
  coverage: number
  tags: string[]
}

export interface AssetDynamicField {
  key: string
  value: string
  source: string
  editable: boolean
}

export interface AssetChange {
  title: string
  actor: string
  time: string
  status: "成功" | "审核中" | "回滚"
}

export interface AssetNode {
  name: string
  kind: string
  health: string
  owner: string
}

export interface AssetDetail extends AssetSummary {
  region: string
  provider: string
  version: string
  lastSync: string
  lastChange: string
  contact: string
  description: string
  baseFields: Array<{ label: string; value: string }>
  dynamicFields: AssetDynamicField[]
  tree: {
    application: string
    cluster: string
    instances: AssetNode[]
  }
  related: string[]
  changes: AssetChange[]
}

export const ASSET_ICON_MAP: Record<string, LucideIcon> = {
  主机: ServerCog,
  云资源: Cloud,
  网络设备: Network,
  应用树: TreePine,
}

export const ASSET_SUMMARIES: AssetSummary[] = [
  {
    id: "k8s-prod",
    name: "K8s 生产集群",
    type: "云资源",
    owner: "平台组",
    team: "基础架构",
    env: "生产",
    status: "正常",
    coverage: 98,
    tags: ["Kubernetes", "核心承载", "纳管完成"],
  },
  {
    id: "payment-host",
    name: "payment-app-01",
    type: "主机",
    owner: "平台组",
    team: "支付中台",
    env: "生产",
    status: "正常",
    coverage: 92,
    tags: ["Linux", "x86", "业务主机"],
  },
  {
    id: "gateway-device",
    name: "边界网关设备",
    type: "网络设备",
    owner: "网络组",
    team: "网络平台",
    env: "生产",
    status: "告警",
    coverage: 88,
    tags: ["防火墙", "路由", "出口"],
  },
  {
    id: "payment-app-tree",
    name: "支付应用树",
    type: "应用树",
    owner: "交易组",
    team: "交易平台",
    env: "生产",
    status: "变更中",
    coverage: 95,
    tags: ["应用-集群-实例", "依赖树", "动态扩展字段"],
  },
  {
    id: "data-lake",
    name: "云数据库资源",
    type: "云资源",
    owner: "数据组",
    team: "数据平台",
    env: "预发",
    status: "正常",
    coverage: 90,
    tags: ["RDS", "备份", "成本中心"],
  },
]

export const ASSET_DETAILS: Record<string, AssetDetail> = {
  "k8s-prod": {
    ...ASSET_SUMMARIES[0],
    region: "华东-杭州",
    provider: "阿里云 / ACK",
    version: "1.28.4",
    lastSync: "2 分钟前",
    lastChange: "2026-04-17 09:20",
    contact: "infra@company.com",
    description: "承载核心交易和支付服务的生产云资源，统一纳管节点、命名空间和扩展字段。",
    baseFields: [
      { label: "资源编号", value: "CMDB-ACK-001" },
      { label: "责任人", value: "Chen Yang" },
      { label: "成本中心", value: "CC-OPS-203" },
      { label: "合规等级", value: "A" },
    ],
    dynamicFields: [
      { key: "Pod 上限", value: "1,200", source: "平台规则", editable: true },
      { key: "节点池", value: "general / compute", source: "云账号", editable: false },
      { key: "业务标签", value: "支付, 订单", source: "应用同步", editable: true },
      { key: "自动扩容", value: "启用", source: "HPA", editable: true },
    ],
    tree: {
      application: "支付应用树",
      cluster: "payment-prod-cluster",
      instances: [
        { name: "payment-api-01", kind: "Pod", health: "正常", owner: "支付中台" },
        { name: "payment-api-02", kind: "Pod", health: "正常", owner: "支付中台" },
        { name: "payment-worker-01", kind: "Pod", health: "正常", owner: "支付中台" },
      ],
    },
    related: ["支付应用树", "边界网关设备", "云数据库资源"],
    changes: [
      { title: "新增 compute 节点池", actor: "Ops Bot", time: "18 分钟前", status: "成功" },
      { title: "更新告警阈值", actor: "Infra Bot", time: "2 小时前", status: "审核中" },
    ],
  },
  "payment-host": {
    ...ASSET_SUMMARIES[1],
    region: "华东-杭州",
    provider: "裸机 / VMware",
    version: "Ubuntu 22.04",
    lastSync: "8 分钟前",
    lastChange: "2026-04-16 18:30",
    contact: "payments-sre@company.com",
    description: "支付业务专属应用主机，挂载运行时、日志和审计代理。",
    baseFields: [
      { label: "主机名", value: "payment-app-01" },
      { label: "资产标签", value: "payment-app" },
      { label: "IP 地址", value: "10.12.8.31" },
      { label: "所属集群", value: "payment-prod-cluster" },
    ],
    dynamicFields: [
      { key: "CPU 配额", value: "8 vCPU", source: "容量审批", editable: false },
      { key: "内存配额", value: "32 GB", source: "容量审批", editable: false },
      { key: "磁盘告警", value: "开启", source: "监控策略", editable: true },
      { key: "审计代理", value: "v2.7.1", source: "安全基线", editable: false },
    ],
    tree: {
      application: "支付应用树",
      cluster: "payment-prod-cluster",
      instances: [
        { name: "payment-app-01", kind: "Host", health: "正常", owner: "支付中台" },
        { name: "payment-app-02", kind: "Host", health: "正常", owner: "支付中台" },
      ],
    },
    related: ["K8s 生产集群", "边界网关设备"],
    changes: [
      { title: "安装日志采集代理", actor: "Ops Bot", time: "1 小时前", status: "成功" },
    ],
  },
  "gateway-device": {
    ...ASSET_SUMMARIES[2],
    region: "华东-上海",
    provider: "华为 / 防火墙",
    version: "USG6680",
    lastSync: "4 分钟前",
    lastChange: "2026-04-17 07:40",
    contact: "network-ops@company.com",
    description: "承接外部访问与安全隔离的核心网络设备，支持扩展字段记录策略、链路和出口。",
    baseFields: [
      { label: "设备编号", value: "NET-FW-018" },
      { label: "责任人", value: "Network Team" },
      { label: "公网出口", value: "EIP-01" },
      { label: "风险等级", value: "中" },
    ],
    dynamicFields: [
      { key: "策略版本", value: "2026.04.17-01", source: "策略中心", editable: false },
      { key: "旁路监控", value: "启用", source: "监控联动", editable: true },
      { key: "链路冗余", value: "双活", source: "拓扑图", editable: false },
    ],
    tree: {
      application: "入口流量树",
      cluster: "edge-zone-a",
      instances: [
        { name: "EIP-01", kind: "Link", health: "正常", owner: "网络组" },
        { name: "Firewall-01", kind: "Device", health: "告警", owner: "网络组" },
      ],
    },
    related: ["K8s 生产集群", "支付应用树"],
    changes: [
      { title: "更新出口策略", actor: "Network Bot", time: "27 分钟前", status: "成功" },
      { title: "验证回传链路", actor: "NOC", time: "昨天 21:05", status: "成功" },
    ],
  },
  "payment-app-tree": {
    ...ASSET_SUMMARIES[3],
    region: "华东-杭州",
    provider: "多集群应用树",
    version: "v3 / 2 cluster / 18 instance",
    lastSync: "1 分钟前",
    lastChange: "2026-04-17 08:50",
    contact: "payments-platform@company.com",
    description: "应用-集群-实例层级树，支持在节点上挂接任意扩展属性。",
    baseFields: [
      { label: "应用 ID", value: "app-payment" },
      { label: "集群数", value: "2" },
      { label: "实例数", value: "18" },
      { label: "SLO", value: "99.95%" },
    ],
    dynamicFields: [
      { key: "服务级别", value: "P0", source: "应用目录", editable: true },
      { key: "审批单号", value: "CHG-20260417-081", source: "变更系统", editable: false },
      { key: "接入域", value: "core-pay", source: "网关配置", editable: true },
      { key: "依赖标签", value: "风控 / 账户 / 消息", source: "依赖扫描", editable: true },
    ],
    tree: {
      application: "支付应用",
      cluster: "payment-prod-cluster",
      instances: [
        { name: "payment-api-01", kind: "Cluster", health: "正常", owner: "支付中台" },
        { name: "payment-cluster-b", kind: "Cluster", health: "正常", owner: "支付中台" },
        { name: "payment-api-01 / 02", kind: "Instance", health: "正常", owner: "支付中台" },
      ],
    },
    related: ["K8s 生产集群", "payment-app-01", "云数据库资源"],
    changes: [
      { title: "同步新增实例标签", actor: "App Bot", time: "6 分钟前", status: "成功" },
      { title: "应用树重算依赖", actor: "CMDB Sync", time: "44 分钟前", status: "成功" },
    ],
  },
  "data-lake": {
    ...ASSET_SUMMARIES[4],
    region: "华北-北京",
    provider: "阿里云 / RDS",
    version: "MySQL 8.0",
    lastSync: "12 分钟前",
    lastChange: "2026-04-15 13:15",
    contact: "data-platform@company.com",
    description: "承载应用侧核心配置和报表查询的云数据库资源。",
    baseFields: [
      { label: "实例 ID", value: "rds-pprd-02" },
      { label: "连接地址", value: "rds.internal" },
      { label: "备份策略", value: "每天 03:00" },
      { label: "KMS", value: "启用" },
    ],
    dynamicFields: [
      { key: "只读副本", value: "2", source: "数据库控制台", editable: false },
      { key: "容量告警", value: "阈值 80%", source: "监控策略", editable: true },
      { key: "保留周期", value: "14 天", source: "备份策略", editable: true },
    ],
    tree: {
      application: "数据服务树",
      cluster: "warehouse-cluster",
      instances: [
        { name: "rds-pprd-02-primary", kind: "Primary", health: "正常", owner: "数据组" },
        { name: "rds-pprd-02-replica", kind: "Replica", health: "正常", owner: "数据组" },
      ],
    },
    related: ["支付应用树", "K8s 生产集群"],
    changes: [
      { title: "调整备份保留期", actor: "DBA Bot", time: "2 小时前", status: "成功" },
    ],
  },
}
