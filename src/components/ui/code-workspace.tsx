"use client"

import * as React from "react"
import Editor, { loader } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import {
  ArrowLeft,
  Code2,
  Copy,
  FileText,
  FolderTree,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/display/badge"
import { FileTree, type FileTreeItem } from "@/components/ui/file-tree"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"

const monacoGlobal = globalThis as typeof globalThis & {
  MonacoEnvironment?: {
    getWorker?: (workerId: string, label: string) => Worker
  }
}

if (typeof window !== "undefined" && !monacoGlobal.MonacoEnvironment) {
  monacoGlobal.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === "json") return new jsonWorker()
      if (label === "css" || label === "scss" || label === "less") return new cssWorker()
      if (label === "html" || label === "handlebars" || label === "razor") return new htmlWorker()
      if (label === "typescript" || label === "javascript") return new tsWorker()
      return new editorWorker()
    },
  }
}

loader.config({ monaco })

interface CodeWorkspaceItem extends FileTreeItem {
  language?: string
  content?: string
  path?: string
}

interface CodeWorkspaceProps extends React.ComponentProps<"div"> {
  files: CodeWorkspaceItem[]
  defaultActiveFileId?: string
  activeFileId?: string
  onActiveFileChange?: (item: CodeWorkspaceItem) => void
  onCodeChange?: (value: string, item: CodeWorkspaceItem) => void
  onBack?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  sandbox?: React.ReactNode
  title?: string
  subtitle?: string
  explorerLabel?: string
}

type WorkspaceIndex = {
  itemsById: Map<string, CodeWorkspaceItem>
  firstLeafId?: string
  openFolderIds: string[]
}

function buildWorkspaceIndex(items: CodeWorkspaceItem[]): WorkspaceIndex {
  const itemsById = new Map<string, CodeWorkspaceItem>()
  let firstLeafId: string | undefined
  const openFolderIds: string[] = []

  const visit = (item: CodeWorkspaceItem, parentPath = "") => {
    const nextPath = parentPath ? `${parentPath}/${item.name}` : item.name
    const nextItem = { ...item, path: item.path ?? nextPath }
    itemsById.set(nextItem.id, nextItem)

    if (item.children?.length) {
      openFolderIds.push(nextItem.id)
      item.children.forEach((child) => visit(child as CodeWorkspaceItem, nextPath))
      return
    }

    if (!firstLeafId) firstLeafId = nextItem.id
  }

  items.forEach((item) => visit(item))
  return { itemsById, firstLeafId, openFolderIds }
}

function inferLanguage(item?: CodeWorkspaceItem): string {
  if (!item) return "typescript"
  if (item.language) return item.language

  const lower = item.name.toLowerCase()
  if (lower.endsWith(".tsx")) return "typescript"
  if (lower.endsWith(".ts")) return "typescript"
  if (lower.endsWith(".jsx")) return "javascript"
  if (lower.endsWith(".js")) return "javascript"
  if (lower.endsWith(".json")) return "json"
  if (lower.endsWith(".css")) return "css"
  if (lower.endsWith(".md")) return "markdown"
  if (lower.endsWith(".html")) return "html"
  return "typescript"
}

function countLines(value: string): number {
  return value ? value.split("\n").length : 0
}

function DefaultSandbox({
  item,
  value,
  language,
}: {
  item?: CodeWorkspaceItem
  value: string
  language: string
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border bg-background px-3 py-2">
          <div className="text-[10px] text-muted-foreground">Active File</div>
          <div className="mt-1 truncate text-sm font-medium">{item?.name ?? "No file selected"}</div>
        </div>
        <div className="rounded-md border bg-background px-3 py-2">
          <div className="text-[10px] text-muted-foreground">Language</div>
          <div className="mt-1 text-sm font-medium">{language}</div>
        </div>
        <div className="rounded-md border bg-background px-3 py-2">
          <div className="text-[10px] text-muted-foreground">Lines</div>
          <div className="mt-1 text-sm font-medium">{countLines(value)}</div>
        </div>
      </div>

      <div className="grid min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-h-0 rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Live Preview</div>
              <p className="text-xs text-muted-foreground">A compact sandbox surface for runtime output.</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">Sandbox</Badge>
          </div>
          <div className="mt-3 rounded-md border bg-muted/30 p-3">
            <pre className="max-h-[280px] overflow-auto text-[11px] leading-5 text-muted-foreground">
              {value || "Select a file to preview its contents here."}
            </pre>
          </div>
        </div>

        <div className="min-h-0 rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Console</div>
            <Sparkles className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <div className="rounded-md border bg-background px-2.5 py-2">Runtime ready.</div>
            <div className="rounded-md border bg-background px-2.5 py-2">
              Preview updates when the selected file changes.
            </div>
            <div className="rounded-md border bg-background px-2.5 py-2">
              Monaco worker integration is wired through the shared workspace component.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeWorkspace({
  files,
  defaultActiveFileId,
  activeFileId,
  onActiveFileChange,
  onCodeChange,
  onBack,
  onToggleFullscreen,
  isFullscreen = false,
  sandbox,
  title = "Code Explorer",
  subtitle = "Interactive Sandbox",
  explorerLabel = "Files",
  className,
  ...props
}: CodeWorkspaceProps) {
  const { itemsById, firstLeafId, openFolderIds } = React.useMemo(() => buildWorkspaceIndex(files), [files])
  const [internalActiveFileId, setInternalActiveFileId] = React.useState(
    defaultActiveFileId ?? firstLeafId ?? files[0]?.id ?? "",
  )
  const isControlled = activeFileId !== undefined
  const selectedFileId = isControlled ? activeFileId : internalActiveFileId

  React.useEffect(() => {
    if (isControlled) return
    if (selectedFileId && itemsById.has(selectedFileId)) return
    setInternalActiveFileId(defaultActiveFileId ?? firstLeafId ?? files[0]?.id ?? "")
  }, [defaultActiveFileId, firstLeafId, files, isControlled, itemsById, selectedFileId])

  const selectedItem = selectedFileId ? itemsById.get(selectedFileId) : undefined
  const language = inferLanguage(selectedItem)
  const [documents, setDocuments] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const nextDocuments: Record<string, string> = {}
    itemsById.forEach((item) => {
      if (!item.children?.length) nextDocuments[item.id] = item.content ?? ""
    })
    setDocuments(nextDocuments)
  }, [itemsById])

  const value = selectedItem && !selectedItem.children?.length ? documents[selectedItem.id] ?? selectedItem.content ?? "" : ""

  const updateActiveFile = React.useCallback(
    (item: CodeWorkspaceItem) => {
      if (item.children?.length) return
      if (!isControlled) setInternalActiveFileId(item.id)
      onActiveFileChange?.(item)
    },
    [isControlled, onActiveFileChange],
  )

  const updateCode = React.useCallback(
    (nextValue: string | undefined) => {
      if (!selectedItem || selectedItem.children?.length) return
      const value = nextValue ?? ""
      setDocuments((current) => ({
        ...current,
        [selectedItem.id]: value,
      }))
      onCodeChange?.(value, selectedItem)
    },
    [onCodeChange, selectedItem],
  )

  const editorValue = value

  return (
    <div
      data-slot="code-workspace"
      className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}
      {...props}
    >
      <Tabs defaultValue="explorer" className="gap-0">
        <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="返回"
              onClick={onBack}
              disabled={!onBack}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <TabsList variant="line" className="w-fit justify-start p-0">
              <TabsTrigger value="explorer" className="px-2.5 py-1.5">
                <Code2 className="size-4" />
                {title}
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="px-2.5 py-1.5">
                {subtitle}
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              Monaco
            </Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="复制当前文件"
              onClick={() => {
                void navigator.clipboard?.writeText(editorValue)
              }}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={isFullscreen ? "退出全屏" : "进入全屏"}
              onClick={onToggleFullscreen}
              disabled={!onToggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>
          </div>
        </div>

        <TabsContent value="explorer" className="mt-0">
          <ResizablePanelGroup orientation="horizontal" className="h-[720px]">
            <ResizablePanel
              defaultSize={24}
              minSize={18}
              className="min-w-0 border-r bg-muted/20"
            >
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{explorerLabel}</div>
                  <p className="text-[10px] text-muted-foreground">
                    {files.length} roots, compact tree navigation
                  </p>
                </div>
                <FolderTree className="size-4 text-muted-foreground" />
              </div>
              <ScrollArea className="h-[calc(100%-2.75rem)]">
                <FileTree
                  items={files}
                  selected={selectedItem?.id}
                  defaultOpen={openFolderIds}
                  onSelect={(item) => updateActiveFile(item as CodeWorkspaceItem)}
                  className="px-2 py-2"
                />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={76} className="min-w-0">
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">
                      {selectedItem?.name ?? "Select a file"}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {language}
                    </Badge>
                  </div>
                </div>
                <div className="min-h-0 flex-1">
                  {selectedItem ? (
                    <Editor
                      height="100%"
                      defaultLanguage={language}
                      language={language}
                      value={editorValue}
                      onChange={updateCode}
                      theme="light"
                      loading={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading editor…</div>}
                      options={{
                        automaticLayout: true,
                        fontSize: 13,
                        lineHeight: 20,
                        minimap: { enabled: false },
                        glyphMargin: false,
                        scrollBeyondLastLine: false,
                        padding: { top: 12, bottom: 12 },
                        roundedSelection: false,
                        renderLineHighlight: "all",
                        scrollbar: {
                          horizontalScrollbarSize: 6,
                          verticalScrollbarSize: 6,
                        },
                        wordWrap: "on",
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Select a file from the explorer.
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t px-3 py-1.5 text-[10px] text-muted-foreground">
                  <span>{selectedItem?.path ?? "No file selected"}</span>
                  <span>
                    {editorValue.length} chars · {countLines(editorValue)} lines
                  </span>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="sandbox" className="mt-0">
          <div className="min-h-[720px] p-3">
            {sandbox ?? <DefaultSandbox item={selectedItem} value={editorValue} language={language} />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { CodeWorkspace }
export type { CodeWorkspaceItem, CodeWorkspaceProps }
