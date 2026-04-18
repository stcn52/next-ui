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
} from "@/components/ui/display/card"
import { Input } from "@/components/ui/inputs/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/inputs/textarea"

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

type PromptLibraryDensity = "default" | "compact"

interface PromptLibraryProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: PromptLibraryItem[]
  searchable?: boolean
  groupable?: boolean
  density?: PromptLibraryDensity
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
  density = "default",
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
  const densityStyles = density === "compact"
    ? {
        root: "gap-2.5",
        sidebarCard: "rounded-md",
        mainCard: "rounded-md",
        header: "border-b",
        title: "text-sm",
        description: "text-xs",
        sidebarContent: "space-y-2.5 pt-2.5",
        searchInput: "h-7 text-xs",
        empty: "px-2.5 py-3 text-xs",
        list: "h-72",
        groups: "space-y-2 pr-2.5",
        group: "space-y-1",
        groupLabel: "text-[9px]",
        item: "rounded-md px-2.5 py-1.5",
        itemTitle: "text-xs",
        itemDescription: "mt-0.5 text-[11px]",
        content: "grid gap-2.5 pt-2.5",
        section: "space-y-2.5",
        subSection: "space-y-1.5",
        sectionTitle: "text-xs",
        variableLabel: "space-y-1 text-[11px]",
        variableText: "text-[11px]",
        previewInput: "h-7 text-xs",
        previewArea: "min-h-24 text-xs",
        noVariables: "px-2.5 py-1.5 text-xs",
        footer: "justify-end gap-1.5",
        applyButton: "h-7 px-3 text-xs",
      }
    : {
        root: "gap-3 lg:grid-cols-[280px_1fr]",
        sidebarCard: "",
        mainCard: "",
        header: "border-b",
        title: "",
        description: "",
        sidebarContent: "space-y-3 pt-3",
        searchInput: "",
        empty: "px-3 py-4 text-sm",
        list: "h-80",
        groups: "space-y-3 pr-3",
        group: "space-y-1.5",
        groupLabel: "text-[10px]",
        item: "rounded-lg px-3 py-2",
        itemTitle: "text-sm",
        itemDescription: "mt-1 text-xs",
        content: "grid gap-3 pt-3 lg:grid-cols-[1fr_1fr]",
        section: "space-y-3",
        subSection: "space-y-2",
        sectionTitle: "text-sm",
        variableLabel: "space-y-1.5",
        variableText: "text-xs",
        previewInput: "",
        previewArea: "min-h-32",
        noVariables: "px-3 py-1.5 text-sm",
        footer: "justify-end gap-2",
        applyButton: "",
      }
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
      className={cn("grid", densityStyles.root, className)}
      {...props}
    >
      <Card size="sm" className={densityStyles.sidebarCard}>
        <CardHeader className={densityStyles.header}>
          <CardTitle className={densityStyles.title}>提示词模板</CardTitle>
          <CardDescription className={densityStyles.description}>
            选择模板并填入变量后应用到输入框
          </CardDescription>
        </CardHeader>
        <CardContent className={densityStyles.sidebarContent}>
          {searchable && (
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              size={density === "compact" ? "sm" : undefined}
              className={densityStyles.searchInput}
            />
          )}
          <ScrollArea className={densityStyles.list}>
            {filteredItems.length === 0 ? (
              <div
                className={cn(
                  "rounded-md border border-dashed text-center text-muted-foreground",
                  densityStyles.empty,
                )}
              >
                {renderEmpty ?? "暂无匹配模板"}
              </div>
            ) : (
              <div className={densityStyles.groups}>
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group} className={densityStyles.group}>
                    {group && (
                      <p className={cn("font-medium text-muted-foreground", densityStyles.groupLabel)}>
                        {group}
                      </p>
                    )}
                    {groupItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "w-full border text-left transition-colors",
                          densityStyles.item,
                          selectedItem?.key === item.key ? "border-primary bg-primary/5" : "hover:bg-muted/60",
                        )}
                      >
                        <div className={cn("font-medium", densityStyles.itemTitle)}>{item.title}</div>
                        {item.description && (
                          <p className={cn("text-muted-foreground", densityStyles.itemDescription)}>
                            {item.description}
                          </p>
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

      <Card className={densityStyles.mainCard}>
        <CardHeader className={densityStyles.header}>
          <CardTitle className={densityStyles.title}>{selectedItem?.title ?? "请选择模板"}</CardTitle>
          {selectedItem?.description && (
            <CardDescription className={densityStyles.description}>
              {selectedItem.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={densityStyles.content}>
          <div className={densityStyles.section}>
            <div className={densityStyles.subSection}>
              <div className={cn("font-medium", densityStyles.sectionTitle)}>变量</div>
              {selectedItem?.variables?.length ? (
                <div className={densityStyles.subSection}>
                  {selectedItem.variables.map((variable) => (
                    <label key={variable.key} className={cn("block", densityStyles.variableLabel)}>
                      <span className={cn("font-medium text-muted-foreground", densityStyles.variableText)}>
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
                        size={density === "compact" ? "sm" : undefined}
                        className={densityStyles.previewInput}
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-md border border-dashed text-muted-foreground",
                    densityStyles.noVariables,
                  )}
                >
                  这个模板没有变量，可直接应用。
                </div>
              )}
            </div>
          </div>

          <div className={densityStyles.section}>
            <div className={densityStyles.variableLabel}>
              <div className={cn("font-medium", densityStyles.sectionTitle)}>模板内容</div>
              <Textarea
                value={selectedItem?.content ?? ""}
                readOnly
                className={densityStyles.previewArea}
              />
            </div>
            <div className={densityStyles.variableLabel}>
              <div className={cn("font-medium", densityStyles.sectionTitle)}>渲染预览</div>
              <Textarea value={rendered} readOnly className={densityStyles.previewArea} />
            </div>
          </div>
        </CardContent>
        <CardFooter className={densityStyles.footer}>
          <Button
            type="button"
            disabled={!selectedItem}
            size={density === "compact" ? "sm" : undefined}
            className={densityStyles.applyButton}
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
  PromptLibraryDensity,
  PromptLibraryApplyResult,
  PromptLibraryItem,
  PromptLibraryProps,
  PromptVariable,
}
