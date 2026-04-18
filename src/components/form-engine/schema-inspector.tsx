"use client"

import { JsonViewer } from "@/components/ui/json-viewer"
import { FieldGroup } from "@/components/ui/forms/field"
import { analyzeSchemaDependencies } from "./dependency-analyzer"
import type { FormSchema } from "./types"

export interface SchemaInspectorProps {
  schema: FormSchema
  values: Record<string, unknown>
  className?: string
}

export function SchemaInspector({ schema, values, className }: SchemaInspectorProps) {
  const dependencies = analyzeSchemaDependencies(schema)

  return (
    <div className={className}>
      <FieldGroup className="rounded-lg border p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Schema JSON</div>
          <JsonViewer data={schema} maxDepth={2} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Dependency graph</div>
          <JsonViewer data={dependencies} maxDepth={4} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Field links</div>
          <JsonViewer data={schema.links ?? []} maxDepth={4} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Live values</div>
          <JsonViewer data={values} maxDepth={3} />
        </div>
      </FieldGroup>
    </div>
  )
}
