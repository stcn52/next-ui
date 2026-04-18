"use client"

import * as React from "react"
import { UploadIcon, XIcon, FileIcon, ImageIcon, FileTextIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/display/progress"
import type { FieldControlProps } from "@/components/form-engine/widget-adapter"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileUploadItem {
  id: string
  file: Pick<File, "name" | "size" | "type">
  progress?: number
  status?: "pending" | "uploading" | "done" | "error"
  error?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// ---------------------------------------------------------------------------
// FileUploadItem component
// ---------------------------------------------------------------------------

/**
 * FileUploadItemRow — 单个已选文件的行视图。
 *
 * 显示文件图标、名称、大小，以及上传进度条、完成标记或错误消息。
 * 需要提供 `onRemove` 时会渲染移除按钮。
 */
function FileUploadItemRow({
  item,
  onRemove,
}: {
  item: FileUploadItem
  onRemove?: (id: string) => void
}) {
  const isError = item.status === "error"
  const isDone = item.status === "done"
  const fileType = item.file.type
  const iconType = fileType.startsWith("image/")
    ? "image"
    : fileType.startsWith("text/") || fileType.includes("pdf")
      ? "text"
      : "file"

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        isError && "border-destructive/50 bg-destructive/5",
        isDone && "border-green-500/30 bg-green-500/5"
      )}
    >
      {iconType === "image" ? (
        <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
      ) : iconType === "text" ? (
        <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
      ) : (
        <FileIcon className="size-4 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.file.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatBytes(item.file.size)}
          </span>
          {isError && (
            <span className="text-xs text-destructive">{item.error ?? "上传失败"}</span>
          )}
          {isDone && (
            <span className="text-xs text-green-600 dark:text-green-400">完成</span>
          )}
        </div>
        {item.status === "uploading" && item.progress !== undefined && (
          <Progress value={item.progress} className="mt-1.5 h-1" />
        )}
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => onRemove(item.id)}
          aria-label={`移除 ${item.file.name}`}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FileUpload root component
// ---------------------------------------------------------------------------

interface FileUploadProps {
  /** Accepted file types — same as <input accept> */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Max file size in bytes */
  maxSize?: number
  /** Max number of files */
  maxFiles?: number
  /** Controlled list of upload items */
  items?: FileUploadItem[]
  /** Called when new files are selected (validation pass) */
  onFilesChange?: (files: File[]) => void
  /** Called when an item should be removed */
  onRemove?: (id: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Sub-description text */
  description?: string
  /** Disabled state */
  disabled?: boolean
  className?: string
  fieldProps?: Pick<FieldControlProps, "id" | "name" | "aria-describedby" | "aria-invalid" | "aria-labelledby" | "aria-required" | "onBlur">
}

/**
 * FileUpload — 拖拽 & 点击式文件上传区。
 *
 * - 支持拖拽放置（drag-and-drop）和点击选择两种方式。
 * - 可配置 `maxSize`（字节）与 `maxFiles` 数量限制（超限文件自动过滤）。
 * - 通过 `items` + `onRemove` 支持受控文件列表；每个条目使用 `FileUploadItemRow` 渲染。
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState<FileUploadItem[]>([])
 * <FileUpload
 *   multiple
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024}
 *   items={items}
 *   onFilesChange={(files) => {
 *     const newItems = files.map((f) => ({ id: crypto.randomUUID(), file: f }))
 *     setItems((prev) => [...prev, ...newItems])
 *   }}
 *   onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
 * />
 * ```
 */
function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  items = [],
  onFilesChange,
  onRemove,
  placeholder = "拖拽文件到此处，或点击选择",
  description,
  disabled = false,
  className,
  fieldProps,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)

  const processFiles = React.useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      let valid = fileArray

      if (maxSize) {
        valid = valid.filter((f) => f.size <= maxSize)
      }
      if (maxFiles && items.length + valid.length > maxFiles) {
        valid = valid.slice(0, maxFiles - items.length)
      }
      if (valid.length > 0) {
        onFilesChange?.(valid)
      }
    },
    [maxSize, maxFiles, items.length, onFilesChange]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled) return
    processFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
      e.target.value = ""
    }
  }

  const reachedMax = maxFiles !== undefined && items.length >= maxFiles

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled || reachedMax ? -1 : 0}
        aria-disabled={disabled || reachedMax}
        aria-label={fieldProps ? undefined : placeholder}
        aria-labelledby={fieldProps?.["aria-labelledby"]}
        aria-describedby={fieldProps?.["aria-describedby"]}
        aria-invalid={fieldProps?.["aria-invalid"]}
        aria-required={fieldProps?.["aria-required"]}
        onClick={() => !disabled && !reachedMax && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && !reachedMax) {
            inputRef.current?.click()
          }
        }}
        onBlur={fieldProps?.onBlur}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-4 text-center transition-colors",
          dragActive && "border-primary bg-primary/5",
          !dragActive && !disabled && !reachedMax && "border-border hover:border-primary/50 hover:bg-muted/30",
          (disabled || reachedMax) && "cursor-not-allowed opacity-50 border-border"
        )}
      >
        <UploadIcon className="size-7 text-muted-foreground" />
        <p className="text-sm font-medium">{placeholder}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        id={fieldProps?.id}
        name={fieldProps?.name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        aria-hidden
      />

      {/* File list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <FileUploadItemRow
              key={item.id}
              item={item}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { FileUpload, FileUploadItemRow, formatBytes }
