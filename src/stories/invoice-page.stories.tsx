/**
 * Invoice Page — 发票/账单详情页，适合 SaaS 计费场景。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { PrinterIcon, DownloadIcon, CheckCircle2Icon } from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/display/card"
import { Separator } from "@/components/ui/display/separator"

const meta: Meta = {
  title: "Pages/InvoicePage",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const INVOICE = {
  id: "INV-2024-0047",
  status: "已付款",
  date: "2024-12-01",
  due: "2024-12-15",
  paid: "2024-12-10",
  from: { name: "Nexus Technologies Inc.", address: "上海市浦东新区张江高科技园区", tax: "91310000XXXXXXXX" },
  to: { name: "某科技有限公司", address: "北京市海淀区中关村软件园", contact: "finance@example.com" },
  items: [
    { desc: "专业版 · 12 月订阅", qty: 1, unit: "¥99.00", total: "¥99.00" },
    { desc: "API 超量调用 · 500K+ 次", qty: 523000, unit: "¥0.0001", total: "¥52.30" },
    { desc: "专属客服支持 · 月度", qty: 1, unit: "¥0.00", total: "¥0.00" },
  ],
  subtotal: "¥151.30",
  tax: "¥19.67",
  discount: "-¥10.00",
  total: "¥161.00",
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
      <CheckCircle2Icon className="size-3.5" />
      {status}
    </Badge>
  )
}

function InvoicePage() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-start justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Actions toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">发票详情</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PrinterIcon className="size-3.5" />
              打印
            </Button>
            <Button size="sm">
              <DownloadIcon className="size-3.5" />
              下载 PDF
            </Button>
          </div>
        </div>

        {/* Invoice card */}
        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="size-8 rounded-lg bg-primary" />
                  <span className="text-xl font-bold">Nexus</span>
                </div>
                <p className="text-sm text-muted-foreground">{INVOICE.from.address}</p>
                <p className="text-xs text-muted-foreground mt-0.5">税号：{INVOICE.from.tax}</p>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-extrabold text-muted-foreground">发票</h1>
                <p className="font-mono text-base font-semibold text-foreground mt-1">{INVOICE.id}</p>
                <div className="mt-2"><StatusBadge status={INVOICE.status} /></div>
              </div>
            </div>

            <Separator />

            {/* Meta row */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { label: "开票日期", value: INVOICE.date },
                { label: "付款截止", value: INVOICE.due },
                { label: "实际付款", value: INVOICE.paid },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Parties */}
            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-2">发票方</p>
                <p className="font-semibold">{INVOICE.from.name}</p>
                <p className="text-muted-foreground mt-0.5">{INVOICE.from.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-2">账单方</p>
                <p className="font-semibold">{INVOICE.to.name}</p>
                <p className="text-muted-foreground mt-0.5">{INVOICE.to.address}</p>
                <p className="text-muted-foreground">{INVOICE.to.contact}</p>
              </div>
            </div>

            <Separator />

            {/* Line items */}
            <div>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                <span>描述</span>
                <span className="text-right">数量</span>
                <span className="text-right">单价</span>
                <span className="text-right">金额</span>
              </div>
              <div className="space-y-3">
                {INVOICE.items.map((item) => (
                  <div key={item.desc} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-sm">
                    <span>{item.desc}</span>
                    <span className="text-right text-muted-foreground">
                      {typeof item.qty === "number" && item.qty > 999
                        ? item.qty.toLocaleString()
                        : item.qty}
                    </span>
                    <span className="text-right text-muted-foreground">{item.unit}</span>
                    <span className="text-right font-medium">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="ml-auto w-56 space-y-2 text-sm">
              {[
                { label: "小计", value: INVOICE.subtotal },
                { label: "税额 (13%)", value: INVOICE.tax },
                { label: "优惠", value: INVOICE.discount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-muted-foreground">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>合计</span>
                <span>{INVOICE.total}</span>
              </div>
            </div>

            <Separator />

            {/* Footer note */}
            <p className="text-xs text-muted-foreground text-center">
              感谢您的信任与支持！如有疑问请联系 billing@nexus.dev
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <InvoicePage />,
}
