"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/display/badge"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TagInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Controlled list of tags */
  value?: string[]
  /** Default tags for uncontrolled mode */
  defaultValue?: string[]
  /** Called when the tag list changes */
  onChange?: (tags: string[]) => void
  /** Placeholder shown when input is empty */
  placeholder?: string
  /** Max number of tags allowed (no limit if unset) */
  maxTags?: number
  /** Allow duplicate tags */
  allowDuplicates?: boolean
  /**
   * Whether to show the remove (×) button on each tag chip.
   * Set to `false` to render tags in display-only mode.
   * @default true
   */
  allowRemove?: boolean
  /** Characters that trigger tag creation (default: Enter and comma) */
  delimiters?: string[]
  /** Disabled state */
  disabled?: boolean
  className?: string
}

/**
 * TagInput — 标签/芯片输入框。
 *
 * 用户输入文字后按 `Enter`（或其他分隔符）生成标签；点击标签上的 × 移除。
 * 支持受控与非受控模式、最大数量限制和去重。
 *
 * @example
 * ```tsx
 * const [tags, setTags] = useState<string[]>([])
 * <TagInput value={tags} onChange={setTags} placeholder="输入后回车添加" />
 * ```
 */
function TagInput({
  value: controlledTags,
  defaultValue = [],
  onChange,
  placeholder = "输入后回车添加标签…",
  maxTags,
  allowDuplicates = false,
  allowRemove = true,
  delimiters = ["Enter", ","],
  disabled = false,
  className,
  ...props
}: TagInputProps) {
  const isControlled = controlledTags !== undefined
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const tags = isControlled ? controlledTags : internalTags

  const applyTags = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalTags(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const addTag = React.useCallback(
    (raw: string) => {
      const tag = raw.trim()
      if (!tag) return
      if (!allowDuplicates && tags.includes(tag)) return
      if (maxTags !== undefined && tags.length >= maxTags) return
      applyTags([...tags, tag])
      setInputValue("")
    },
    [allowDuplicates, applyTags, maxTags, tags],
  )

  const removeTag = React.useCallback(
    (index: number) => {
      applyTags(tags.filter((_, i) => i !== index))
    },
    [applyTags, tags],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (delimiters.includes(e.key)) {
      e.preventDefault()
      addTag(inputValue)
      return
    }

    // Backspace on empty input removes the last tag
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  const reachedMax = maxTags !== undefined && tags.length >= maxTags

  return (
    <div
      data-slot="tag-input"
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        (disabled || reachedMax) && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={() => !disabled && inputRef.current?.focus()}
      {...props}
    >
      {tags.map((tag, i) => (
        <Badge
          key={i}
          variant="secondary"
          className="gap-1 pr-1 text-xs"
        >
          {tag}
          {allowRemove && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(i)
              }}
              aria-label={`移除标签 ${tag}`}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20"
            >
              <XIcon className="size-3" />
            </button>
          )}
        </Badge>
      ))}

      {!reachedMax && (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      )}
    </div>
  )
}

export { TagInput }
export type { TagInputProps }
