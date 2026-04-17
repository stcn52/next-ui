import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import {
  ConfigProvider,
  useConfig,
  builtinLocales,
  getAvailableLocales,
  registerLocale,
  useTranslation,
} from "@/components/config-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
import { Input } from "@/components/ui/inputs/input"
import { Textarea } from "@/components/ui/inputs/textarea"
import { DataTable } from "@/components/ui/data/data-table"
import { DatePicker } from "@/components/ui/date/date-picker"
import { Combobox } from "@/components/ui/inputs/combobox"
import type { ColumnDef } from "@tanstack/react-table"
import type { Size } from "@/components/config-provider"

const meta: Meta = {
  title: "Config/ConfigProvider",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

function ConfigDemo() {
  const { size, locale, classPrefix } = useConfig()
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Current Config</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Size</span>
          <Badge variant="secondary">{size}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Locale</span>
          <Badge variant="secondary">{locale.locale}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class prefix</span>
          <Badge variant="outline">{classPrefix || "(none)"}</Badge>
        </div>
        <div className="mt-2 flex gap-2">
          <Button size="sm">{locale.confirm}</Button>
          <Button size="sm" variant="outline">
            {locale.cancel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const Default: Story = {
  render: () => (
    <ConfigProvider>
      <ConfigDemo />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Current Config")).toBeInTheDocument()
    await expect(canvas.getByText("Confirm")).toBeInTheDocument()
    await expect(canvas.getByText("Cancel")).toBeInTheDocument()
  },
}

export const ChineseLocale: Story = {
  render: () => (
    <ConfigProvider locale="zh-CN" size="lg">
      <ConfigDemo />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("zh-CN")).toBeInTheDocument()
    await expect(canvas.getByText("确认")).toBeInTheDocument()
    await expect(canvas.getByText("取消")).toBeInTheDocument()
  },
}

export const Interactive: Story = {
  render: () => {
    const [size, setSize] = useState<Size>("md")
    const [locale, setLocale] = useState<string>("en")
    return (
      <ConfigProvider size={size} locale={locale}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Size:</span>
            {(["sm", "md", "lg"] as Size[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Locale:</span>
            {Object.keys(builtinLocales).map((l) => (
              <Button
                key={l}
                size="sm"
                variant={locale === l ? "default" : "outline"}
                onClick={() => setLocale(l)}
              >
                {l}
              </Button>
            ))}
          </div>
          <ConfigDemo />
        </div>
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to zh-CN
    await userEvent.click(canvas.getByText("zh-CN"))
    await expect(canvas.getByText("确认")).toBeInTheDocument()
    // Switch size to lg
    await userEvent.click(canvas.getByText("lg"))
    await expect(canvas.getByText("lg")).toBeInTheDocument()
  },
}

// Demo table data for locale integration story
type Product = { id: number; name: string; price: string }

const productData: Product[] = [
  { id: 1, name: "Widget A", price: "$10" },
  { id: 2, name: "Widget B", price: "$20" },
  { id: 3, name: "Widget C", price: "$30" },
]

const productColumns: ColumnDef<Product>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
]

const comboboxOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
]

export const LocaleIntegration: Story = {
  name: "Locale Integration (zh-CN)",
  render: () => {
    const [locale, setLocale] = useState("en")
    const [date, setDate] = useState<Date>()
    const [framework, setFramework] = useState("")
    return (
      <ConfigProvider locale={locale}>
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Locale:</span>
            {Object.keys(builtinLocales).map((l) => (
              <Button
                key={l}
                size="sm"
                variant={locale === l ? "default" : "outline"}
                onClick={() => setLocale(l)}
              >
                {l}
              </Button>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap">
            <DatePicker date={date} onDateChange={setDate} />
            <Combobox
              options={comboboxOptions}
              value={framework}
              onValueChange={setFramework}
            />
          </div>
          <DataTable
            columns={productColumns}
            data={productData}
            filterColumn="name"
          />
        </div>
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to zh-CN
    await userEvent.click(canvas.getByText("zh-CN"))
    // Verify DataTable pagination buttons are in Chinese
    await expect(canvas.getByText("上一页")).toBeInTheDocument()
    await expect(canvas.getByText("下一页")).toBeInTheDocument()
  },
}

export const SizeIntegration: Story = {
  name: "Size Integration",
  render: () => {
    const [size, setSize] = useState<Size>("md")
    return (
      <ConfigProvider size={size}>
        <div className="flex flex-col gap-6 max-w-md">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Size:</span>
            {(["sm", "md", "lg"] as Size[]).map((s) => (
              <Button
                key={s}
                size={s === "md" ? "default" : s}
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center flex-wrap">
              <Button>Default Button</Button>
              <Button variant="outline">Outline</Button>
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
            <Input placeholder="Input responds to size" />
            <Textarea placeholder="Textarea responds to size" />
          </div>
        </div>
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to sm
    await userEvent.click(canvas.getByText("sm"))
    await expect(canvas.getByPlaceholderText("Input responds to size")).toBeInTheDocument()
    // Switch to lg
    await userEvent.click(canvas.getByText("lg"))
    await expect(canvas.getByPlaceholderText("Textarea responds to size")).toBeInTheDocument()
  },
}

export const CustomLocale: Story = {
  name: "Custom Locale (registerLocale)",
  render: () => {
    // Flat style — same as before
    registerLocale("ko-KR", {
      noResults: "결과가 없습니다.",
      previous: "이전",
      next: "다음",
      confirm: "확인",
      cancel: "취소",
      filter: "필터...",
      pickADate: "날짜 선택",
      selectOption: "선택하세요...",
    })

    // Nested JSON style — same structure as locale JSON files
    registerLocale("fr-FR", {
      locale: "fr-FR",
      common: {
        noResults: "Aucun résultat.",
        confirm: "Confirmer",
        cancel: "Annuler",
        search: "Rechercher…",
      },
      pagination: {
        previous: "Précédent",
        next: "Suivant",
      },
      dataTable: {
        filter: "Filtrer…",
        rowsSelected: "{count} sur {total} ligne(s) sélectionnée(s).",
      },
    })

    const [locale, setLocale] = useState("en")
    const availableLocales = getAvailableLocales()

    return (
      <ConfigProvider locale={locale}>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex gap-2 flex-wrap">
            {availableLocales.map((l) => (
              <Button
                key={l}
                size="sm"
                variant={locale === l ? "default" : "outline"}
                onClick={() => setLocale(l)}
              >
                {l}
              </Button>
            ))}
          </div>
          <TranslationDemo />
        </div>
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to ko-KR
    await userEvent.click(canvas.getByText("ko-KR"))
    await expect(canvas.getByText("확인")).toBeInTheDocument()
    await expect(canvas.getByText("취소")).toBeInTheDocument()
  },
}

function TranslationDemo() {
  const t = useTranslation()
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">confirm:</span>
          <span>{t("confirm")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">cancel:</span>
          <span>{t("cancel")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">rowsSelected:</span>
          <span>{t("rowsSelected", { count: 3, total: 10 })}</span>
        </div>
        <div className="mt-2 flex gap-2">
          <Button>{t("confirm")}</Button>
          <Button variant="outline">{t("cancel")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
