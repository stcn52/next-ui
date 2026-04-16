/**
 * FileUpload — drag-and-drop file upload zone with preview list and progress.
 */
import { useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { FileUpload } from "@/components/ui/file-upload"
import type { FileUploadItem } from "@/components/ui/file-upload"

const meta: Meta<typeof FileUpload> = {
  title: "UI/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof FileUpload>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeItem(file: File, status: FileUploadItem["status"] = "pending"): FileUploadItem {
  return { id: `${file.name}-${Date.now()}`, file, status }
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState<FileUploadItem[]>([])

    const handleFiles = useCallback((files: File[]) => {
      setItems((prev) => [...prev, ...files.map((f) => makeItem(f))])
    }, [])

    const handleRemove = useCallback((id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, [])

    return (
      <div className="max-w-md">
        <FileUpload
          multiple
          items={items}
          onFilesChange={handleFiles}
          onRemove={handleRemove}
          description="支持 PNG、JPG、PDF，最大 10 MB"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button")).toBeInTheDocument()
  },
}

export const WithSizeLimit: Story = {
  render: () => {
    const [items, setItems] = useState<FileUploadItem[]>([])

    const handleFiles = useCallback((files: File[]) => {
      setItems((prev) => [...prev, ...files.map((f) => makeItem(f))])
    }, [])
    const handleRemove = useCallback((id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, [])

    return (
      <div className="max-w-md">
        <FileUpload
          multiple
          maxSize={5 * 1024 * 1024}
          maxFiles={3}
          accept="image/*"
          items={items}
          onFilesChange={handleFiles}
          onRemove={handleRemove}
          placeholder="上传图片（最多 3 张）"
          description="每张不超过 5 MB，仅支持图片格式"
        />
      </div>
    )
  },
}

export const WithProgress: Story = {
  render: () => {
    const [items, setItems] = useState<FileUploadItem[]>([
      {
        id: "a",
        file: new File([""], "report-2024.pdf", { type: "application/pdf" }),
        status: "done",
      },
      {
        id: "b",
        file: new File([""], "photo.jpg", { type: "image/jpeg" }),
        status: "uploading",
        progress: 60,
      },
      {
        id: "c",
        file: new File([""], "unknown.xyz"),
        status: "error",
        error: "不支持的文件类型",
      },
    ])

    const handleRemove = useCallback((id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, [])

    return (
      <div className="max-w-md">
        <FileUpload
          items={items}
          onRemove={handleRemove}
          description="拖拽或点击选择文件"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <FileUpload
        disabled
        items={[]}
        placeholder="当前不可上传"
        description="请稍后再试"
      />
    </div>
  ),
}
