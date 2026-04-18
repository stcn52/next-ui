"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/display/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/inputs/textarea"
import { cn } from "@/lib/utils"
import { SchemaForm } from "./form-renderer"
import type { FieldWidgetRegistry } from "./widget-adapter"
import { parseFormSchemaJson, stringifyFormSchemaJson } from "./schema-json"
import type { FormSchema } from "./types"

export interface SchemaPlaygroundProps {
  schema: FormSchema
  className?: string
  showInspector?: boolean
  widgets?: FieldWidgetRegistry
}

export function SchemaPlayground({ schema, className, showInspector = false, widgets }: SchemaPlaygroundProps) {
  const [schemaText, setSchemaText] = React.useState(() => stringifyFormSchemaJson(schema))
  const [submitCount, setSubmitCount] = React.useState(0)

  const parsed = React.useMemo(() => parseFormSchemaJson(schemaText), [schemaText])
  const previewSchema = parsed.schema ?? schema

  React.useEffect(() => {
    setSchemaText(stringifyFormSchemaJson(schema))
  }, [schema])

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]", className)}>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Schema JSON</div>
          <p className="text-xs text-muted-foreground">Edit the JSON and watch the preview update in place.</p>
        </div>
        <Textarea
          aria-label="Schema JSON editor"
          className="min-h-[520px] font-mono text-xs"
          value={schemaText}
          onChange={(e) => setSchemaText(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setSchemaText(stringifyFormSchemaJson(schema))}>
            Reset JSON
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setSchemaText(stringifyFormSchemaJson(previewSchema))} disabled={!parsed.schema}>
            Format JSON
          </Button>
        </div>
        {parsed.error ? (
          <Alert variant="destructive">
            <AlertTitle>Schema parse error</AlertTitle>
            <AlertDescription>{parsed.error}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Live preview</div>
          <p className="text-xs text-muted-foreground">The preview uses the parsed schema when valid, otherwise the last known good schema.</p>
        </div>
        <SchemaForm
          key={schemaText}
          schema={previewSchema}
          showInspector={showInspector}
          widgets={widgets}
          onSubmit={() => setSubmitCount((count) => count + 1)}
        />
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <div className="font-medium">Submit count</div>
          <div className="text-muted-foreground">{submitCount}</div>
        </div>
      </div>
    </div>
  )
}
