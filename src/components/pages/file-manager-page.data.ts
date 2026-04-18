import { File, FileCode, FileText, FileVideo, Folder, Image } from "lucide-react"

export interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "code" | "other"
  size: string
  modified: string
  owner: string
  protection: string
  note?: string
  selected?: boolean
  shared?: boolean
}

export const FILES: FileItem[] = [
  {
    id: "1",
    name: "301",
    type: "folder",
    size: "计算",
    modified: "2026-04-19 02:06:05",
    owner: "755/www",
    protection: "未保护",
    note: "",
    selected: true,
  },
  {
    id: "2",
    name: "old",
    type: "folder",
    size: "计算",
    modified: "2026-04-19 02:05:13",
    owner: "755/www",
    protection: "未保护",
    note: "",
  },
  {
    id: "3",
    name: "gfw301.bak.zip",
    type: "document",
    size: "26.03 MB",
    modified: "2026-04-19 01:38:30",
    owner: "755/root",
    protection: "未保护",
    note: "",
  },
  {
    id: "4",
    name: "gfw301.zip",
    type: "document",
    size: "26.04 MB",
    modified: "2026-04-19 02:06:18",
    owner: "755/www",
    protection: "未保护",
    note: "",
    shared: true,
  },
  {
    id: "5",
    name: "gfw_install.sh",
    type: "code",
    size: "3.75 KB",
    modified: "2026-04-19 01:40:27",
    owner: "644/root",
    protection: "未保护",
    note: "",
  },
  {
    id: "6",
    name: "gfwcli.zip",
    type: "document",
    size: "12.62 MB",
    modified: "2026-04-19 02:03:28",
    owner: "755/root",
    protection: "未保护",
    note: "",
  },
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
