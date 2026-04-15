import {
  File,
  FileCode,
  FileText,
  FileVideo,
  Folder,
  Image,
} from "lucide-react"

export interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "code" | "other"
  size: string
  modified: string
  shared?: boolean
}

export const FILES: FileItem[] = [
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

export const FILE_ICONS: Record<FileItem["type"], typeof File> = {
  folder: Folder,
  document: FileText,
  image: Image,
  video: FileVideo,
  code: FileCode,
  other: File,
}

export const FILE_COLORS: Record<FileItem["type"], string> = {
  folder: "text-blue-500",
  document: "text-orange-500",
  image: "text-green-500",
  video: "text-purple-500",
  code: "text-cyan-500",
  other: "text-muted-foreground",
}
