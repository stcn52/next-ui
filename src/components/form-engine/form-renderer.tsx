"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import type { ComponentType, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DerivedValueSync,
  LinkValueSync,
  SectionRenderer,
} from "./field-renderer"
import { createFormDefaults } from "./defaults"
import { collectSchemaDerivedDependencyPaths } from "./dependency-analyzer"
import { pickLinkValues } from "./link-engine"
import { pickValuesByPaths } from "./subscription"
import { SchemaInspector } from "./schema-inspector"
import type { FieldWidgetRegistry } from "./widget-adapter"
import type { FormSchema } from "./types"

type SchemaFormApi = {
  Field: ComponentType<{
    name: string
    validators?: Record<string, unknown>
    children: (field: unknown) => ReactNode
  }>
  Subscribe: ComponentType<{
    selector?: (state: { values: Record<string, unknown> }) => unknown
    children: (state: unknown) => ReactNode
  }>
  setFieldValue: (...args: unknown[]) => void
  pushFieldValue: (...args: unknown[]) => void
  removeFieldValue: (...args: unknown[]) => void
  getFieldValue: (...args: unknown[]) => unknown
  handleSubmit: () => Promise<void> | void
}

export interface SchemaFormProps<TValues extends Record<string, unknown>> {
  schema: FormSchema
  defaultValues?: TValues
  onSubmit: (values: TValues) => void | Promise<void>
  submitLabel?: string
  className?: string
  showInspector?: boolean
  widgets?: FieldWidgetRegistry
}

export function SchemaForm<TValues extends Record<string, unknown>>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel,
  className,
  showInspector = false,
  widgets,
}: SchemaFormProps<TValues>) {
  const initialValues = React.useMemo(
    () => (defaultValues ?? (createFormDefaults(schema) as TValues)),
    [defaultValues, schema],
  )

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as TValues)
    },
  }) as unknown as SchemaFormApi

  const derivedDependencyPaths = React.useMemo(
    () => collectSchemaDerivedDependencyPaths(schema),
    [schema],
  )

  return (
    <div className={cn("space-y-4", className)}>
      {schema.title ? <div className="text-lg font-semibold">{schema.title}</div> : null}
      {schema.description ? <p className="text-sm text-muted-foreground">{schema.description}</p> : null}
      <div className={cn("grid gap-4", showInspector && "lg:grid-cols-[minmax(0,1fr)_360px]")}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.Subscribe selector={(state) => pickValuesByPaths(state.values, derivedDependencyPaths)}>
            {(values) => <DerivedValueSync form={form} schema={schema} values={values as Record<string, unknown>} />}
          </form.Subscribe>

          <form.Subscribe selector={(state) => pickLinkValues(state.values, schema)}>
            {(values) => <LinkValueSync form={form} schema={schema} values={values as Record<string, unknown>} />}
          </form.Subscribe>

          <SectionRenderer form={form} schema={schema} widgets={widgets} />

          <div className="flex items-center justify-end gap-2">
            <Button type="submit">{schema.submitLabel ?? submitLabel ?? "Submit"}</Button>
          </div>
        </form>

        {showInspector ? (
          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <SchemaInspector
                schema={schema}
                values={values as Record<string, unknown>}
              />
            )}
          </form.Subscribe>
        ) : null}
      </div>
    </div>
  )
}
