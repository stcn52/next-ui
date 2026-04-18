import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "@/components/config-provider"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/display/card"
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/overlays/dropdown-menu"
import { Input } from "@/components/ui/inputs/input"
import { Separator } from "@/components/ui/display/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/display/table"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FolderClosed,
  FolderPlus,
  Grid3X3,
  LayoutList,
  RefreshCw,
  Search,
  ShieldCheck,
  TerminalSquare,
  Trash2,
  Download,
  FileSearch,
  Star,
  ListChecks,
  Plus,
  Shield,
  Files,
} from "lucide-react"
import {
  FILES,
  FILE_COLORS,
  FILE_ICONS,
} from "./file-manager-page.data"

interface FileManagerPageProps {
  defaultOpenMenuId?: string | null
}

export function FileManagerPage({ defaultOpenMenuId = null }: FileManagerPageProps) {
  const t = useTranslation()
  const [view, setView] = useState<"list" | "grid">("list")
  const [search, setSearch] = useState("")
  const [includeChildren, setIncludeChildren] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(defaultOpenMenuId)

  const filtered = useMemo(
    () => FILES.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  const folderCount = filtered.filter((f) => f.type === "folder").length
  const fileCount = filtered.length - folderCount
  const selectedFile = filtered.find((item) => item.selected)
  const topActions = [
    { key: "transfer", icon: Download, label: t("fileManagerUploadDownload") },
    { key: "create", icon: FolderPlus, label: t("fileManagerCreate"), caret: true },
    { key: "content", icon: FileSearch, label: t("fileManagerContentSearch") },
    { key: "favorites", icon: Star, label: t("fileManagerFavorites"), caret: true },
    { key: "share", icon: ListChecks, label: t("fileManagerShareList") },
    { key: "terminal", icon: TerminalSquare, label: t("terminal") },
    {
      key: "log",
      icon: Files,
      label: t("fileManagerOperationLog"),
    },
    { key: "protection", icon: Shield, label: t("fileManagerProtection") },
    { key: "sync", icon: RefreshCw, label: t("fileManagerSync") },
  ]
  const breadcrumbItems = [
    t("rootDirectory"),
    "www",
    "wwwroot",
    "gadmin.btkaixin.net",
    "install",
  ]
  const tabs = ["install", "install", "install"]
  const selectedCount = filtered.filter((item) => item.selected).length

  useEffect(() => {
    setOpenMenuId(defaultOpenMenuId)
  }, [defaultOpenMenuId])

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9] px-4 py-3 dark:bg-[#0f1724]">
      <section className="w-full overflow-hidden rounded-[12px] border border-[#d9dce3] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-[#243244] dark:bg-[#111a27] dark:shadow-[0_12px_32px_rgba(2,6,23,0.45)]">
        <div className="border-b border-[#e4e7ec] bg-[#f7f8fa] px-4 py-2.5 dark:border-[#243244] dark:bg-[#162131]">
          <div className="flex items-end gap-1.5">
            {tabs.map((tab, index) => (
              <button
                key={`${tab}-${index}`}
                className="inline-flex min-w-[170px] items-center gap-2 rounded-t-[10px] border border-[#d7dbe2] border-b-white bg-[#fdfdfd] px-3 py-2 text-sm font-medium text-slate-700 dark:border-[#314257] dark:border-b-[#111a27] dark:bg-[#192536] dark:text-slate-100"
                type="button"
              >
                <FolderClosed className="size-4 text-amber-500" />
                <span>{tab}</span>
                {index === tabs.length - 1 && <span className="ml-auto text-muted-foreground dark:text-slate-400">×</span>}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-t-[10px] border border-[#d7dbe2] border-b-white bg-[#fdfdfd] text-muted-foreground dark:border-[#314257] dark:border-b-[#111a27] dark:bg-[#192536] dark:text-slate-400"
              aria-label={t("fileManagerNewTab")}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-white px-4 py-3 dark:bg-[#111a27]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[680px] flex-1 items-center overflow-hidden rounded-[6px] border border-[#d9dce3] bg-white dark:border-[#314257] dark:bg-[#111a27]">
              <Button variant="ghost" size="icon" className="size-8 rounded-none border-r border-[#e4e7ec] text-muted-foreground dark:border-[#243244] dark:text-slate-400">
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3 text-sm text-foreground dark:text-slate-100">
                {breadcrumbItems.map((item, index) => (
                  <div key={item} className="flex min-w-0 items-center gap-2">
                    {index > 0 && <ChevronRight className="size-4 text-muted-foreground dark:text-slate-500" />}
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="size-8 rounded-none border-l border-[#e4e7ec] text-muted-foreground dark:border-[#243244] dark:text-slate-400">
                <RefreshCw className="size-4" />
              </Button>
            </div>

            <div className="flex min-w-[360px] items-center justify-end gap-2">
              <div className="relative w-full max-w-[320px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
                <Input
                  placeholder={t("fileManagerPathSearchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-[6px] border-[#d9dce3] bg-white pl-9 pr-3 dark:border-[#314257] dark:bg-[#111a27]"
                />
              </div>
              <label className="inline-flex items-center gap-2 rounded-[6px] border border-[#d9dce3] bg-white px-3 py-2 text-sm text-muted-foreground dark:border-[#314257] dark:bg-[#111a27] dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={includeChildren}
                  onChange={(e) => setIncludeChildren(e.target.checked)}
                  className="size-4 rounded border-border"
                />
                <span>{t("fileManagerIncludeChildren")}</span>
              </label>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {topActions.map(({ key, icon: Icon, label, caret }) => (
                <Button
                  key={key}
                  variant="outline"
                  className="rounded-[6px] border-[#d9dce3] bg-white px-3 text-foreground shadow-none dark:border-[#314257] dark:bg-[#111a27] dark:text-slate-100"
                >
                  <Icon className="size-4 text-muted-foreground dark:text-slate-500" />
                  <span>{label}</span>
                  {caret && <ChevronDown className="size-4 text-muted-foreground dark:text-slate-500" />}
                </Button>
              ))}
              <Badge variant="outline" className="h-8 rounded-[6px] border-[#d9dce3] px-3 text-sm font-normal text-muted-foreground dark:border-[#314257] dark:text-slate-400">
                {t("fileManagerRootCapacity")}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-[6px] border-[#d9dce3] text-muted-foreground dark:border-[#314257] dark:text-slate-400">
                <Trash2 className="size-4" />
                <span>{t("fileManagerRecycleBin")}</span>
              </Button>
              <div className="inline-flex rounded-[6px] border border-[#d9dce3] bg-white p-0.5 dark:border-[#314257] dark:bg-[#111a27]">
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-8 rounded-[4px]"
                  onClick={() => setView("list")}
                  aria-label={t("listView")}
                >
                  <LayoutList className="size-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-8 rounded-[4px]"
                  onClick={() => setView("grid")}
                  aria-label={t("gridView")}
                >
                  <Grid3X3 className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {view === "list" ? (
            <Card className="rounded-[8px] border border-[#dfe3e8] bg-white ring-0 shadow-none dark:border-[#243244] dark:bg-[#111a27]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#f3f5f7] dark:bg-[#162131]">
                    <TableRow className="hover:bg-[#f3f5f7] dark:hover:bg-[#162131]">
                      <TableHead className="w-10 px-4">
                        <div className="flex items-center justify-center">
                          <span className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#28a745] text-sm font-medium text-white">
                            -
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="px-4">{t("fileManagerNameColumn")}</TableHead>
                      <TableHead className="w-44">{t("fileManagerProtectionColumn")}</TableHead>
                      <TableHead className="w-36">{t("fileManagerOwnerColumn")}</TableHead>
                      <TableHead className="w-36">{t("sizeColumn")}</TableHead>
                      <TableHead className="w-48">{t("modifiedColumn")}</TableHead>
                      <TableHead className="w-28">{t("fileManagerNoteColumn")}</TableHead>
                      <TableHead className="w-28 text-right">{t("fileManagerActionColumn")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((file) => {
                      const Icon = FILE_ICONS[file.type]
                      return (
                        <TableRow
                          key={file.id}
                          className={file.selected ? "bg-[#f3fbf7] hover:bg-[#edf8f2] dark:bg-[#10261d] dark:hover:bg-[#143025]" : "bg-white hover:bg-[#fafbfc] dark:bg-[#111a27] dark:hover:bg-[#15202f]"}
                        >
                          <TableCell className="px-4">
                            <div className="flex items-center justify-center">
                              <span
                                className={`inline-flex size-6 items-center justify-center rounded-[4px] border ${
                                  file.selected
                                    ? "border-[#28a745] bg-[#28a745] text-white"
                                    : "border-[#d9dce3] bg-white text-transparent dark:border-[#314257] dark:bg-[#111a27]"
                                }`}
                              >
                                ✓
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4">
                            <div className="flex items-center gap-3">
                              <Icon className={`size-5 ${FILE_COLORS[file.type]}`} />
                              <span className="text-sm font-medium text-foreground">{file.name}</span>
                              {file.shared && (
                                <Badge variant="secondary" className="rounded-[4px] px-2 text-xs dark:bg-[#1f2d40] dark:text-slate-200">
                                  {t("shared")}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-1 text-sm text-muted-foreground dark:text-slate-400">
                              <span>{file.protection}</span>
                              <ShieldCheck className="size-4 text-[#9198a1]" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground dark:text-slate-400">{file.owner}</TableCell>
                          <TableCell className="text-sm text-[#16a34a]">{file.size}</TableCell>
                          <TableCell className="text-sm text-muted-foreground dark:text-slate-400">{file.modified}</TableCell>
                          <TableCell className="text-sm text-muted-foreground dark:text-slate-500">{file.note || " "}</TableCell>
                          <TableCell className="px-4 text-right">
                            <DropdownMenu
                              open={openMenuId === file.id}
                              onOpenChange={(open) => setOpenMenuId(open ? file.id : null)}
                            >
                              <DropdownMenuTrigger
                                render={
                                  <Button variant="ghost" className="gap-1 rounded-[6px] text-[#16a34a] hover:text-[#15803d] dark:text-[#34d399] dark:hover:text-[#6ee7b7]">
                                    <span>{t("fileManagerMore")}</span>
                                    <ChevronDown className="size-4" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="w-[276px] rounded-[8px] border border-[#dde2e8] bg-white p-0 shadow-[0_10px_28px_rgba(15,23,42,0.12)] dark:border-[#314257] dark:bg-[#111a27] dark:text-slate-100 dark:shadow-[0_16px_32px_rgba(2,6,23,0.55)]">
                                <DropdownMenuItem>{t("open")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerOpenNewWindow")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t("fileManagerAddToFavorites")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerExternalShare")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerPin")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerSync")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerScan")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerPermissionAction")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t("fileManagerCopy")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerCut")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("rename")}</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">{t("delete")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t("fileManagerCompress")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("fileManagerDuplicate")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>{t("fileManagerAttributes")}</DropdownMenuCheckboxItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          {t("noMatchingFiles")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {filtered.map((file) => {
                const Icon = FILE_ICONS[file.type]
                return (
                  <Card
                    key={file.id}
                    className={`cursor-pointer rounded-[8px] border border-[#dde2e8] bg-white shadow-none transition-[border-color,box-shadow] duration-100 hover:border-primary/50 dark:border-[#243244] dark:bg-[#111a27] ${
                      file.selected ? "border-emerald-500/70 bg-[#f3fbf7] dark:bg-[#10261d]" : ""
                    }`}
                  >
                    <CardContent className="flex flex-col items-center gap-2 px-3 py-4">
                      <Icon className={`size-10 ${FILE_COLORS[file.type]}`} />
                      <span className="w-full truncate text-center text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground dark:text-slate-400">{file.size}</span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground dark:text-slate-400">
            <div>
              {t("fileManagerSummary", { folders: folderCount, files: fileCount })}
              {selectedCount > 0 && (
                <>
                  {" · "}
                  {t("fileManagerSelectedSummary", { count: selectedCount })}
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="size-8 rounded-[6px] dark:text-slate-500" disabled aria-label={t("fileManagerPreviousPage")}>
                <ChevronRight className="size-4 rotate-180" />
              </Button>
              <Badge className="h-8 rounded-[6px] px-3 text-sm dark:bg-slate-100 dark:text-slate-900">{1}</Badge>
              <Button variant="ghost" size="icon" className="size-8 rounded-[6px] dark:text-slate-500" disabled aria-label={t("fileManagerNextPage")}>
                <ChevronRight className="size-4" />
              </Button>
              <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#d9dce3] bg-white px-3 py-2 text-sm dark:border-[#314257] dark:bg-[#111a27]">
                <span>500</span>
                <span>{t("fileManagerPerPage")}</span>
                <ChevronDown className="size-4 text-muted-foreground dark:text-slate-500" />
              </div>
              <span>{t("fileManagerTotalCount", { count: filtered.length })}</span>
            </div>
          </div>

          {selectedFile && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              {t("fileManagerSelectionHint", { name: selectedFile.name })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
