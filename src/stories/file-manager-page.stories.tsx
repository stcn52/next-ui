/**
 * File Manager Page — Tree-style file browser with grid/list views, breadcrumb nav, context actions.
 * Demonstrates Card, Table, Breadcrumb, Button, Badge, DropdownMenu composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  File,
  FileText,
  Folder,
  FolderOpen,
  Grid3X3,
  Image,
  LayoutList,
  MoreHorizontal,
  Search,
  Upload,
  FolderPlus,
  FileCode,
  FileVideo,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/FileManager",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "File manager page with breadcrumb navigation, grid/list view toggle, file type icons, and context menu actions.",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "code" | "other"
  size: string
  modified: string
  shared?: boolean
}

const FILES: FileItem[] = [
  { id: "1", name: "项目文档", type: "folder", size: "—", modified: "2025-01-15" },
  { id: "2", name: "设计稿", type: "folder", size: "—", modified: "2025-01-14" },
  { id: "3", name: "需求规格说明书.docx", type: "document", size: "2.4 MB", modified: "2025-01-15", shared: true },
  { id: "4", name: "架构图.png", type: "image", size: "1.8 MB", modified: "2025-01-13" },
  { id: "5", name: "接口文档.md", type: "code", size: "45 KB", modified: "2025-01-14", shared: true },
  { id: "6", name: "演示视频.mp4", type: "video", size: "128 MB", modified: "2025-01-12" },
  { id: "7", name: "测试报告.pdf", type: "document", size: "3.1 MB", modified: "2025-01-11" },
  { id: "8", name: "数据库设计.sql", type: "code", size: "12 KB", modified: "2025-01-10" },
  { id: "9", name: "会议纪要", type: "folder", size: "—", modified: "2025-01-09" },
  { id: "10", name: "logo.svg", type: "image", size: "8 KB", modified: "2025-01-08" },
]

const FILE_ICONS: Record<FileItem["type"], typeof File> = {
  folder: Folder,
  document: FileText,
  image: Image,
  video: FileVideo,
  code: FileCode,
  other: File,
}

const FILE_COLORS: Record<FileItem["type"], string> = {
  folder: "text-blue-500",
  document: "text-orange-500",
  image: "text-green-500",
  video: "text-purple-500",
  code: "text-cyan-500",
  other: "text-muted-foreground",
}

function FileManagerPage() {
  const [view, setView] = useState<"list" | "grid">("list")
  const [search, setSearch] = useState("")

  const filtered = FILES.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">文件管理</h1>
          <Breadcrumb className="mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">根目录</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">我的文件</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="size-4 mr-1.5" />
            新建文件夹
          </Button>
          <Button size="sm">
            <Upload className="size-4 mr-1.5" />
            上传文件
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索文件…"
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
            aria-label="列表视图"
          >
            <LayoutList className="size-4" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("grid")}
            aria-label="网格视图"
          >
            <Grid3X3 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead className="w-24">大小</TableHead>
                  <TableHead className="w-32">修改日期</TableHead>
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
                          <span className="font-medium text-sm">{file.name}</span>
                          {file.shared && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              已共享
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
                            <DropdownMenuItem>打开</DropdownMenuItem>
                            <DropdownMenuItem>重命名</DropdownMenuItem>
                            <DropdownMenuItem>共享</DropdownMenuItem>
                            <DropdownMenuItem>下载</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      无匹配文件
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((file) => {
            const Icon = file.type === "folder" ? FolderOpen : FILE_ICONS[file.type]
            return (
              <Card key={file.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center gap-2 px-3 py-4">
                  <Icon className={`size-10 ${FILE_COLORS[file.type]}`} />
                  <span className="text-xs font-medium text-center truncate w-full">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground">{file.size}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Footer info */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} 个项目 · {filtered.filter((f) => f.type === "folder").length} 个文件夹 ·{" "}
        {filtered.filter((f) => f.type !== "folder").length} 个文件
      </div>
    </div>
  )
}

export const Default: Story = {
  name: "File Manager",
  render: () => <FileManagerPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("文件管理")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索文件…")).toBeInTheDocument()
    await expect(canvas.getByText("项目文档")).toBeInTheDocument()
  },
}

/* Grid view preview */
function GridViewPreview() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-6 max-w-5xl mx-auto">
      {FILES.slice(0, 8).map((file) => {
        const Icon = file.type === "folder" ? FolderOpen : FILE_ICONS[file.type]
        return (
          <Card key={file.id} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center gap-2 px-3 py-4">
              <Icon className={`size-10 ${FILE_COLORS[file.type]}`} />
              <span className="text-xs font-medium text-center truncate w-full">{file.name}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export const GridView: Story = {
  name: "Grid View",
  render: () => <GridViewPreview />,
}

/* Storage overview */
function StorageOverview() {
  const categories = [
    { label: "文档", size: "5.5 MB", color: "bg-orange-500", pct: 25 },
    { label: "图片", size: "1.8 MB", color: "bg-green-500", pct: 15 },
    { label: "视频", size: "128 MB", color: "bg-purple-500", pct: 45 },
    { label: "代码", size: "57 KB", color: "bg-cyan-500", pct: 5 },
    { label: "其他", size: "12 KB", color: "bg-gray-400", pct: 10 },
  ]

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">存储空间</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            {categories.map((c) => (
              <div key={c.label} className={`${c.color}`} style={{ width: `${c.pct}%` }} />
            ))}
          </div>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${c.color}`} />
                  <span>{c.label}</span>
                </div>
                <span className="text-muted-foreground">{c.size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Storage: Story = {
  name: "Storage Overview",
  render: () => <StorageOverview />,
}
