/**
 * File Manager Page — Tree-style file browser with grid/list views, breadcrumb nav, context actions.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  ConfigProvider,
  useTranslation,
} from "@/components/config-provider"
import {
  FileManagerPage,
} from "@/components/pages/file-manager-page"
import {
  FILE_COLORS,
  FILE_ICONS,
  FILES,
} from "@/components/pages/file-manager-page.data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FolderOpen,
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

export const Default: Story = {
  name: "File Manager",
  render: () => (
    <ConfigProvider locale="zh-CN">
      <FileManagerPage />
    </ConfigProvider>
  ),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("项目文档")).toBeInTheDocument()
  },
}

/* Storage overview */
function StorageOverview() {
  const t = useTranslation()
  const categories = [
    { label: t("storageDocuments"), size: "5.5 MB", color: "bg-orange-500", pct: 25 },
    { label: t("storageImages"), size: "1.8 MB", color: "bg-green-500", pct: 15 },
    { label: t("storageVideos"), size: "128 MB", color: "bg-purple-500", pct: 45 },
    { label: t("storageCode"), size: "57 KB", color: "bg-cyan-500", pct: 5 },
    { label: t("storageOther"), size: "12 KB", color: "bg-gray-400", pct: 10 },
  ]

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("storageTitle")}</CardTitle>
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
  render: () => (
    <ConfigProvider locale="zh-CN">
      <StorageOverview />
    </ConfigProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("存储空间")).toBeInTheDocument()
  },
}
