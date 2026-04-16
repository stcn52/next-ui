import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export interface JsonViewerProps {
  /** The value to display. Must be JSON-serialisable. */
  data: unknown
  /** Whether to start expanded. Defaults to true. */
  expanded?: boolean
  /** Maximum auto-expand depth. Nodes deeper than this start collapsed. */
  maxDepth?: number
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeOf(v: unknown): string {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  return typeof v
}

// ─── Leaf token ───────────────────────────────────────────────────────────────

function JsonToken({ value }: { value: JsonValue }) {
  const t = typeOf(value)
  if (t === "string")
    return (
      <span className="text-green-600 dark:text-green-400">
        {'"'}
        {String(value)}
        {'"'}
      </span>
    )
  if (t === "number")
    return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
  if (t === "boolean")
    return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>
  if (t === "null")
    return <span className="text-red-500 dark:text-red-400">null</span>
  return null
}

// ─── Node ─────────────────────────────────────────────────────────────────────

interface NodeProps {
  keyName?: string | number
  value: JsonValue
  depth: number
  maxDepth: number
  /** comma delimiter to show after closing bracket */
  comma?: boolean
  /** Override initial open state (used for root node by the expanded prop) */
  initialOpen?: boolean
}

function JsonNode({ keyName, value, depth, maxDepth, comma, initialOpen }: NodeProps) {
  const t = typeOf(value)
  const isExpandable = t === "object" || t === "array"
  const [open, setOpen] = React.useState(
    initialOpen !== undefined ? initialOpen : depth < maxDepth,
  )

  if (!isExpandable) {
    return (
      <div className="flex items-start gap-0.5 h-5">
        {keyName !== undefined && (
          <span className="text-muted-foreground">
            {typeof keyName === "string" ? `"${keyName}"` : keyName}
            {": "}
          </span>
        )}
        <JsonToken value={value as JsonValue} />
        {comma && <span className="text-muted-foreground">,</span>}
      </div>
    )
  }

  const isArray = t === "array"
  const entries = isArray
    ? (value as JsonArray).map((v, i) => [i, v] as [number, JsonValue])
    : Object.entries(value as JsonObject)
  const [open_br, close_br] = isArray ? ["[", "]"] : ["{", "}"]

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        className="flex items-center gap-0.5 cursor-pointer hover:bg-accent/50 rounded-sm h-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((p) => !p) }
        }}
      >
        <ChevronRightIcon
          className={cn(
            "size-3 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-90",
          )}
          aria-hidden
        />
        {keyName !== undefined && (
          <span className="text-muted-foreground">
            {typeof keyName === "string" ? `"${keyName}"` : keyName}
            {": "}
          </span>
        )}
        <span className="text-foreground">{open_br}</span>
        {!open && (
          <>
            <span className="text-muted-foreground text-xs">
              {isArray
                ? `${(value as JsonArray).length} items`
                : `${Object.keys(value as JsonObject).length} keys`}
            </span>
            <span className="text-foreground">{close_br}</span>
          </>
        )}
        {comma && !open && <span className="text-muted-foreground">,</span>}
      </div>

      {open && (
        <div className="ml-4 border-l border-border/50 pl-2">
          {entries.map(([k, v], i) => (
            <JsonNode
              key={String(k)}
              keyName={k}
              value={v as JsonValue}
              depth={depth + 1}
              maxDepth={maxDepth}
              comma={i < entries.length - 1}
            />
          ))}
        </div>
      )}

      {open && (
        <div className="flex items-center h-5">
          <span className="text-foreground">{close_br}</span>
          {comma && <span className="text-muted-foreground">,</span>}
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function JsonViewer({ data, expanded = true, maxDepth = 2, className }: JsonViewerProps) {
  // Override root open state via expanded prop
  const [rootKey, setRootKey] = React.useState(0)

  // When expanded/data changes, reset the tree by bumping key
  React.useEffect(() => { setRootKey((k) => k + 1) }, [expanded, data])

  return (
    <div
      className={cn(
        "rounded-md border bg-muted/30 p-3 font-mono text-[13px] leading-5 overflow-auto",
        className,
      )}
    >
      <JsonNode
        key={rootKey}
        value={data as JsonValue}
        depth={0}
        maxDepth={maxDepth}
        initialOpen={expanded}
      />
    </div>
  )
}
