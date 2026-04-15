import { useState } from "react"
import { useTranslation } from "@/components/config-provider"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FolderPlus,
  FolderOpen,
  Grid3X3,
  LayoutList,
  MoreHorizontal,
  Search,
  Upload,
} from "lucide-react"
import {
  FILES,
  FILE_COLORS,
  FILE_ICONS,
} from "./file-manager-page.data"

export function FileManagerPage() {
  const t = useTranslation()
  const [view, setView] = useState<"list" | "grid">("list")
  const [search, setSearch] = useState("")

  const filtered = FILES.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("fileManagerTitle")}</h1>
          <Breadcrumb className="mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{t("rootDirectory")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{t("myFiles")}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="mr-1.5 size-4" />
            {t("newFolder")}
          </Button>
          <Button size="sm">
            <Upload className="mr-1.5 size-4" />
            {t("uploadFile")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={t("searchFilesPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("list")}
            aria-label={t("listView")}
          >
            <LayoutList className="size-4" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("grid")}
            aria-label={t("gridView")}
          >
            <Grid3X3 className="size-4" />
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("nameColumn")}</TableHead>
                  <TableHead className="w-24">{t("sizeColumn")}</TableHead>
                  <TableHead className="w-32">{t("modifiedColumn")}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((file) => {
                  const Icon = FILE_ICONS[file.type]
                  return (
                    <TableRow key={file.id} className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Icon className={`size-5 ${FILE_COLORS[file.type]}`} />
                          <span className="text-sm font-medium">{file.name}</span>
                          {file.shared && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                              {t("shared")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{file.size}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{file.modified}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>{t("open")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("rename")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("share")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("download")}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">{t("delete")}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      {t("noMatchingFiles")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((file) => {
            const Icon = file.type === "folder" ? FolderOpen : FILE_ICONS[file.type]
            return (
              <Card key={file.id} className="cursor-pointer transition-colors hover:border-primary/50">
                <CardContent className="flex flex-col items-center gap-2 px-3 py-4">
                  <Icon className={`size-10 ${FILE_COLORS[file.type]}`} />
                  <span className="w-full truncate text-center text-xs font-medium">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground">{file.size}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {t("itemsSummary", { count: filtered.length })}
        {" · "}
        {t("foldersSummary", { count: filtered.filter((f) => f.type === "folder").length })}
        {" · "}
        {t("filesSummary", { count: filtered.filter((f) => f.type !== "folder").length })}
      </div>
    </div>
  )
}
