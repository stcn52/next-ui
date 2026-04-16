import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface PromptVariable {
  key: string
  label: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
}

interface PromptLibraryItem {
  key: string
  title: string
  description?: string
  content: string
  category?: string
  variables?: PromptVariable[]
}

interface PromptLibraryApplyResult {
  raw: string
  rendered: string
  values: Record<string, string>
}

interface PromptLibraryProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: PromptLibraryItem[]
  searchable?: boolean
  groupable?: boolean
  selectedKey?: string
  defaultSelectedKey?: string
  renderEmpty?: React.ReactNode
  searchPlaceholder?: string
  applyLabel?: string
  onSelect?: (item: PromptLibraryItem) => void
  onApply?: (result: PromptLibraryApplyResult, item: PromptLibraryItem) => void
}

function renderPromptTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, key: string) => values[key] ?? "")
}

function PromptLibrary({
  items,
  searchable = true,
  groupable = true,
  selectedKey: controlledSelectedKey,
  defaultSelectedKey,
  renderEmpty,
  searchPlaceholder = "搜索提示词…",
  applyLabel = "应用模板",
  onSelect,
  onApply,
  className,
  ...props
}: PromptLibraryProps) {
  const [search, setSearch] = React.useState("")
  const [internalSelectedKey, setInternalSelectedKey] = React.useState(
    defaultSelectedKey ?? items[0]?.key ?? "",
  )
  const isControlled = controlledSelectedKey !== undefined
  const selectedKey = isControlled ? controlledSelectedKey : internalSelectedKey

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const normalized = search.toLowerCase()
    return items.filter((item) =>
      [item.title, item.description, item.category, item.content]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [items, search])

  const groupedItems = React.useMemo(() => {
    if (!groupable) return { "": filteredItems }
    return filteredItems.reduce<Record<string, PromptLibraryItem[]>>((acc, item) => {
      const key = item.category ?? "未分类"
      ;(acc[key] ??= []).push(item)
      return acc
    }, {})
  }, [filteredItems, groupable])

  const selectedItem =
    filteredItems.find((item) => item.key === selectedKey) ??
    items.find((item) => item.key === selectedKey) ??
    filteredItems[0] ??
    items[0]

  const [values, setValues] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (!selectedItem) return
    const nextValues = Object.fromEntries(
      (selectedItem.variables ?? []).map((variable) => [
        variable.key,
        variable.defaultValue ?? "",
      ]),
    )
    setValues(nextValues)
  }, [selectedItem])

  const rendered = React.useMemo(() => {
    if (!selectedItem) return ""
    return renderPromptTemplate(selectedItem.content, values)
  }, [selectedItem, values])

  const handleSelect = React.useCallback(
    (item: PromptLibraryItem) => {
      if (!isControlled) setInternalSelectedKey(item.key)
      onSelect?.(item)
    },
    [isControlled, onSelect],
  )

  return (
    <div
      data-slot="prompt-library"
      className={cn("grid gap-4 lg:grid-cols-[280px_1fr]", className)}
      {...props}
    >
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle>提示词模板</CardTitle>
          <CardDescription>选择模板并填入变量后应用到输入框</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-3">
          {searchable && (
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
            />
          )}
          <ScrollArea className="h-80">
            {filteredItems.length === 0 ? (
              <div className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                {renderEmpty ?? "暂无匹配模板"}
              </div>
            ) : (
              <div className="space-y-3 pr-3">
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group} className="space-y-1.5">
                    {group && <p className="text-[10px] font-medium text-muted-foreground">{group}</p>}
                    {groupItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                          selectedItem?.key === item.key ? "border-primary bg-primary/5" : "hover:bg-muted/60",
                        )}
                      >
                        <div className="text-sm font-medium">{item.title}</div>
                        {item.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{selectedItem?.title ?? "请选择模板"}</CardTitle>
          {selectedItem?.description && (
            <CardDescription>{selectedItem.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">变量</div>
              {selectedItem?.variables?.length ? (
                <div className="space-y-2">
                  {selectedItem.variables.map((variable) => (
                    <label key={variable.key} className="block space-y-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        {variable.label}
                        {variable.required && " *"}
                      </span>
                      <Input
                        value={values[variable.key] ?? ""}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [variable.key]: event.target.value,
                          }))
                        }
                        placeholder={variable.placeholder ?? variable.label}
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed px-3 py-6 text-sm text-muted-foreground">
                  这个模板没有变量，可直接应用。
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="text-sm font-medium">模板内容</div>
              <Textarea value={selectedItem?.content ?? ""} readOnly className="min-h-32" />
            </div>
            <Separator />
            <div className="space-y-1.5">
              <div className="text-sm font-medium">渲染预览</div>
              <Textarea value={rendered} readOnly className="min-h-32" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            disabled={!selectedItem}
            onClick={() => {
              if (!selectedItem) return
              onApply?.(
                {
                  raw: selectedItem.content,
                  rendered,
                  values,
                },
                selectedItem,
              )
            }}
          >
            {applyLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { PromptLibrary, renderPromptTemplate }
export type {
  PromptLibraryApplyResult,
  PromptLibraryItem,
  PromptLibraryProps,
  PromptVariable,
}
