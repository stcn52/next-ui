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
import { useTranslation } from "@/components/config-provider"

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
type PromptLibraryLayout = "default" | "embedded"

interface PromptLibraryProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: PromptLibraryItem[]
  searchable?: boolean
  groupable?: boolean
  density?: PromptLibraryDensity
  layout?: PromptLibraryLayout
  selectedKey?: string
  defaultSelectedKey?: string
  renderEmpty?: React.ReactNode
  searchPlaceholder?: string
  applyLabel?: string
  showItemDescription?: boolean
  showTemplateDescription?: boolean
  showTemplateContent?: boolean
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
  layout = "default",
  selectedKey: controlledSelectedKey,
  defaultSelectedKey,
  renderEmpty,
  searchPlaceholder,
  applyLabel,
  showItemDescription = true,
  showTemplateDescription = true,
  showTemplateContent = true,
  onSelect,
  onApply,
  className,
  ...props
}: PromptLibraryProps) {
  const t = useTranslation()
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
        searchInput: "h-6 text-xs",
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
        previewInput: "h-6 text-xs",
        previewArea: "min-h-24 text-xs",
        noVariables: "px-2.5 py-1.5 text-xs",
        footer: "justify-end gap-1.5",
        applyButton: "h-6 px-3 text-xs",
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
  const isEmbedded = layout === "embedded"
  const searchInputPlaceholder = searchPlaceholder ?? t("promptLibrarySearchPlaceholder")
  const applyButtonLabel = applyLabel ?? t("promptLibraryApplyLabel")
  const libraryTitle = t("promptLibraryTitle")
  const libraryDescription = t("promptLibraryDescription")
  const emptyLabel = renderEmpty ?? t("promptLibraryEmpty")
  const uncategorizedLabel = t("promptLibraryUncategorized")
  const selectTemplateLabel = t("promptLibrarySelectTemplate")
  const variableCountLabel = (count: number) => t("promptLibraryVariableCount", { count })
  const readyToApplyLabel = t("promptLibraryReadyToApply")
  const variablesTitle = t("promptLibraryVariablesTitle")
  const noVariablesLabel = t("promptLibraryNoVariables")
  const templateContentTitle = t("promptLibraryTemplateContentTitle")
  const previewTitle = t("promptLibraryPreviewTitle")
  const compactPreviewTitle = t("promptLibraryCompactPreviewTitle")
  const viewTemplateContentLabel = t("promptLibraryViewTemplateContent")

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
      const key = item.category ?? uncategorizedLabel
      ;(acc[key] ??= []).push(item)
      return acc
    }, {})
  }, [filteredItems, groupable, uncategorizedLabel])

  const selectedItem =
    filteredItems.find((item) => item.key === selectedKey) ??
    items.find((item) => item.key === selectedKey) ??
    filteredItems[0] ??
    items[0]
  const selectedVariables = selectedItem?.variables ?? []
  const hasVariables = selectedVariables.length > 0
  const groupEntries = Object.entries(groupedItems)
  const showGroupHeading = groupEntries.length > 1

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

  const handleApply = React.useCallback(() => {
    if (!selectedItem) return
    onApply?.(
      {
        raw: selectedItem.content,
        rendered,
        values,
      },
      selectedItem,
    )
  }, [onApply, rendered, selectedItem, values])

  if (isEmbedded) {
    const embeddedStyles = density === "compact"
      ? {
          pane: "overflow-hidden rounded-md border border-border/70 bg-card/55",
          header: "border-b px-2 py-1.5",
          body: "space-y-1.5 px-2 py-2",
          editor: "overflow-hidden rounded-md border border-border/70 bg-background/95",
          editorHeader: "flex items-start justify-between gap-2 border-b px-2 py-1.5",
          editorBody: "grid gap-2 px-2 py-2",
          list: "h-48",
          previewArea: "min-h-16 text-xs",
          badge: "inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground",
          disclosure: "rounded-md border border-dashed bg-muted/20 px-2 py-1.5",
          applyButton: "h-6 shrink-0 px-2.5 text-xs",
        }
      : {
          pane: "overflow-hidden rounded-lg border bg-card/70",
          header: "border-b px-3 py-3",
          body: "space-y-3 px-3 py-3",
          editor: "overflow-hidden rounded-lg border bg-background/95",
          editorHeader: "flex items-start justify-between gap-3 border-b px-3 py-3",
          editorBody: "grid gap-3 px-3 py-3 lg:grid-cols-[0.9fr_1.1fr]",
          list: "h-64",
          previewArea: "min-h-28",
          badge: "inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground",
          disclosure: "",
          applyButton: "",
        }

    return (
      <div
        data-slot="prompt-library"
        data-layout={layout}
        className={cn("grid", densityStyles.root, className)}
        {...props}
      >
        <section data-slot="prompt-library-list-pane" className={embeddedStyles.pane}>
          <div className={embeddedStyles.header}>
            <p className={cn("font-medium", densityStyles.title)}>{libraryTitle}</p>
            {density !== "compact" && (
              <p className={cn("text-muted-foreground", densityStyles.description)}>
                {libraryDescription}
              </p>
            )}
          </div>
          <div className={embeddedStyles.body}>
            {searchable && (
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchInputPlaceholder}
                size={density === "compact" ? "sm" : undefined}
                className={densityStyles.searchInput}
              />
            )}
            <ScrollArea className={embeddedStyles.list}>
              {filteredItems.length === 0 ? (
                <div
                  className={cn(
                    "rounded-md border border-dashed text-center text-muted-foreground",
                    densityStyles.empty,
                  )}
                >
                  {emptyLabel}
                </div>
              ) : (
                <div className={densityStyles.groups}>
                  {groupEntries.map(([group, groupItems]) => (
                    <div key={group} className={densityStyles.group}>
                      {group && showGroupHeading && (
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
                          {showItemDescription && item.description && (
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
          </div>
        </section>

        <section data-slot="prompt-library-editor-pane" className={embeddedStyles.editor}>
          <div className={embeddedStyles.editorHeader}>
            <div className="min-w-0">
              <p className={cn("truncate font-medium", densityStyles.title)}>
                {selectedItem?.title ?? selectTemplateLabel}
              </p>
              {showTemplateDescription && selectedItem?.description && (
                <p className={cn("truncate text-muted-foreground", densityStyles.description)}>
                  {selectedItem.description}
                </p>
              )}
              {selectedItem && (
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className={embeddedStyles.badge}>
                    {hasVariables ? variableCountLabel(selectedVariables.length) : readyToApplyLabel}
                  </span>
                  {selectedItem.category && (
                    <span className={embeddedStyles.badge}>{selectedItem.category}</span>
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              disabled={!selectedItem}
              size={density === "compact" ? "sm" : undefined}
              className={embeddedStyles.applyButton}
              onClick={handleApply}
            >
              {applyButtonLabel}
            </Button>
          </div>
          <div className={cn(embeddedStyles.editorBody, !hasVariables && density === "compact" && "gap-1.5")}>
            {hasVariables ? (
              <div className={densityStyles.section}>
                <div className={densityStyles.subSection}>
                  <div className={cn("font-medium", densityStyles.sectionTitle)}>{variablesTitle}</div>
                  <div className={densityStyles.subSection}>
                    {selectedVariables.map((variable) => (
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
                </div>
              </div>
            ) : (
              <div
                data-slot="prompt-library-no-variables"
                className={cn(
                  "rounded-md border border-dashed text-muted-foreground",
                  densityStyles.noVariables,
                )}
              >
                {noVariablesLabel}
              </div>
            )}

            <div className={densityStyles.section}>
              {showTemplateContent && density === "compact" ? (
                <details data-slot="prompt-library-template-disclosure" className={embeddedStyles.disclosure}>
                  <summary className="cursor-pointer list-none text-[11px] font-medium text-muted-foreground">
                    {viewTemplateContentLabel}
                  </summary>
                  <Textarea
                    value={selectedItem?.content ?? ""}
                    readOnly
                    className={cn("mt-1.5", embeddedStyles.previewArea)}
                  />
                </details>
              ) : showTemplateContent && (
                <div className={densityStyles.variableLabel}>
                  <div className={cn("font-medium", densityStyles.sectionTitle)}>{templateContentTitle}</div>
                  <Textarea
                    value={selectedItem?.content ?? ""}
                    readOnly
                    className={embeddedStyles.previewArea}
                  />
                </div>
              )}
              <div className={densityStyles.variableLabel}>
                <div className={cn("font-medium", densityStyles.sectionTitle)}>
                  {density === "compact" ? compactPreviewTitle : previewTitle}
                </div>
                <Textarea value={rendered} readOnly className={embeddedStyles.previewArea} />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div
      data-slot="prompt-library"
      data-layout={layout}
      className={cn("grid", densityStyles.root, className)}
      {...props}
    >
      <Card size="sm" className={densityStyles.sidebarCard}>
        <CardHeader className={densityStyles.header}>
          <CardTitle className={densityStyles.title}>{libraryTitle}</CardTitle>
          <CardDescription className={densityStyles.description}>
            {libraryDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className={densityStyles.sidebarContent}>
          {searchable && (
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchInputPlaceholder}
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
                {emptyLabel}
              </div>
            ) : (
              <div className={densityStyles.groups}>
                {groupEntries.map(([group, groupItems]) => (
                  <div key={group} className={densityStyles.group}>
                    {group && showGroupHeading && (
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
                        {showItemDescription && item.description && (
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
          <CardTitle className={densityStyles.title}>{selectedItem?.title ?? selectTemplateLabel}</CardTitle>
          {showTemplateDescription && selectedItem?.description && (
            <CardDescription className={densityStyles.description}>
              {selectedItem.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={densityStyles.content}>
          <div className={densityStyles.section}>
            <div className={densityStyles.subSection}>
              <div className={cn("font-medium", densityStyles.sectionTitle)}>{variablesTitle}</div>
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
                  {noVariablesLabel}
                </div>
              )}
            </div>
          </div>

          <div className={densityStyles.section}>
            {showTemplateContent && (
              <div className={densityStyles.variableLabel}>
                <div className={cn("font-medium", densityStyles.sectionTitle)}>{templateContentTitle}</div>
                <Textarea
                  value={selectedItem?.content ?? ""}
                  readOnly
                  className={densityStyles.previewArea}
                />
              </div>
            )}
            <div className={densityStyles.variableLabel}>
              <div className={cn("font-medium", densityStyles.sectionTitle)}>{previewTitle}</div>
              <Textarea value={rendered} readOnly className={densityStyles.previewArea} />
            </div>
          </div>
        </CardContent>
        <CardFooter data-slot="prompt-library-footer" className={densityStyles.footer}>
          <Button
            type="button"
            disabled={!selectedItem}
            size={density === "compact" ? "sm" : undefined}
            className={densityStyles.applyButton}
            onClick={handleApply}
          >
            {applyButtonLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { PromptLibrary, renderPromptTemplate }
export type {
  PromptLibraryDensity,
  PromptLibraryLayout,
  PromptLibraryApplyResult,
  PromptLibraryItem,
  PromptLibraryProps,
  PromptVariable,
}
