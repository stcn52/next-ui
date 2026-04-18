"use client"

import * as React from "react"
import { type AnyFieldApi } from "@tanstack/react-form"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/forms/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select"
import { Input } from "@/components/ui/inputs/input"
import { Textarea } from "@/components/ui/inputs/textarea"
import { Checkbox } from "@/components/ui/inputs/checkbox"
import { Switch } from "@/components/ui/inputs/switch"
import { cn } from "@/lib/utils"
import { createFieldDefaults } from "./defaults"
import { collectFieldDependencyPaths } from "./dependency-analyzer"
import { applySchemaLinks } from "./link-engine"
import { computeDerivedValue, evaluateRule, getPathValue, validateRule } from "./rule-engine"
import { isGroupField } from "./registry"
import type {
  FieldControlProps,
  FieldWidgetRegistry,
} from "./widget-adapter"
import { pickValuesByPaths, uniquePaths } from "./subscription"
import type { FieldSchema, FormSchema } from "./types"

type LeafFieldSchema = Exclude<FieldSchema, { type: "group" }>
type GroupFieldSchema = Extract<FieldSchema, { type: "group" }>

type FormApiLike = {
  Field: React.ComponentType<{
    name: string
    validators?: Record<string, unknown>
    children: (field: unknown) => React.ReactNode
  }>
  Subscribe: React.ComponentType<{
    selector?: (state: { values: Record<string, unknown> }) => unknown
    children: (state: unknown) => React.ReactNode
  }>
  setFieldValue: <TField extends string>(field: TField, updater: unknown) => void
  pushFieldValue: <TField extends string>(field: TField, value: unknown) => void
  removeFieldValue: <TField extends string>(field: TField, index: number) => void
  getFieldValue: <TField extends string>(field: TField) => unknown
}

interface RenderFieldProps {
  form: FormApiLike
  schema: LeafFieldSchema
  path: string
  values: Record<string, unknown>
  parentDisabled?: boolean
  className?: string
  widgets?: FieldWidgetRegistry
}

function fieldErrors(field: AnyFieldApi): Array<{ message: string }> {
  return (field.state.meta.errors ?? [])
    .flat()
    .map((error) => ({
      message:
        typeof error === "string"
          ? error
          : error && typeof error === "object" && "message" in error
            ? String((error as { message?: unknown }).message ?? "")
            : String(error),
    }))
    .filter((item) => item.message.trim().length > 0)
}

function getLeafSubscriptionPaths(path: string, schema: LeafFieldSchema): string[] {
  return uniquePaths([path, ...collectFieldDependencyPaths(schema)])
}

function getGroupSubscriptionPaths(path: string, schema: Extract<FieldSchema, { type: "group" }>): string[] {
  return uniquePaths([path, ...collectFieldDependencyPaths(schema)])
}

function renderGroupField({
  form,
  schema,
  path,
  values,
  parentDisabled = false,
  widgets,
}: {
  form: FormApiLike
  schema: GroupFieldSchema
  path: string
  values: Record<string, unknown>
  parentDisabled?: boolean
  widgets?: FieldWidgetRegistry
}) {
  const isVisible = schema.visibleWhen ? evaluateRule(schema.visibleWhen, { values }) : true
  const isDisabled = parentDisabled || (schema.disabledWhen ? evaluateRule(schema.disabledWhen, { values }) : false)
  if (!isVisible) return null

  const groupValue = getPathValue(values, path)
  const items = Array.isArray(groupValue) ? groupValue : []
  const minItems = schema.repeatable ? (schema.minItems ?? 0) : 0
  const maxItems = schema.repeatable ? schema.maxItems : undefined
  const canAdd = !isDisabled && (!schema.repeatable || maxItems == null || items.length < maxItems)
  const canRemove = schema.repeatable && items.length > minItems && !isDisabled

  return (
    <FieldGroup
      className="rounded-md border bg-muted/20 p-3"
      data-disabled={isDisabled ? "true" : undefined}
    >
      <div className="space-y-1">
        <div className="text-sm font-medium">{schema.label ?? schema.name}</div>
        {schema.description ? <p className="text-sm text-muted-foreground">{schema.description}</p> : null}
      </div>
      {schema.repeatable ? (
        <div className="space-y-3">
          {items.map((_, index) => (
            <div key={`${schema.name}-${index}`} className="space-y-3 rounded-md border bg-background p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  {(schema.label ?? schema.name) + ` #${index + 1}`}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  disabled={!canRemove}
                  onClick={() => form.removeFieldValue(path, index)}
                >
                  <Trash2Icon className="size-3.5" />
                  Remove
                </Button>
              </div>
              <div className="space-y-3">
                {schema.fields.map((child) => (
                  <SchemaNodeRenderer
                    key={`${schema.name}.${index}.${child.name}`}
                    form={form}
                    schema={child}
                    path={`${path}[${index}].${child.name}`}
                    parentDisabled={isDisabled}
                    widgets={widgets}
                  />
                ))}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            disabled={!canAdd}
            onClick={() => form.pushFieldValue(path, createFieldDefaults(schema.fields))}
          >
            <PlusIcon className="size-3.5" />
            Add item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {schema.fields.map((child) => (
            <SchemaNodeRenderer
              key={`${schema.name}.${child.name}`}
              form={form}
              schema={child}
              path={`${path}.${child.name}`}
              parentDisabled={isDisabled}
              widgets={widgets}
            />
          ))}
        </div>
      )}
    </FieldGroup>
  )
}

function buildFieldValidator(schema: LeafFieldSchema, values: Record<string, unknown>) {
  const required = schema.requiredWhen ? evaluateRule(schema.requiredWhen, { values }) : false
  const validateWhen = schema.validateWhen ? evaluateRule(schema.validateWhen, { values }) : false
  const hasRuleSet = Boolean(schema.validate?.length)
  const shouldValidate = required || (validateWhen && hasRuleSet)
  if (!shouldValidate) return undefined

  const rules = [
    ...(required ? [{ op: "required" as const }] : []),
    ...((validateWhen || required) ? (schema.validate ?? []) : []),
  ]

  return {
    onChange: ({ value }: { value: unknown }) => {
      for (const rule of rules) {
        const message = validateRule(rule, value)
        if (message) return message
      }
      return undefined
    },
    onBlur: ({ value }: { value: unknown }) => {
      for (const rule of rules) {
        const message = validateRule(rule, value)
        if (message) return message
      }
      return undefined
    },
  }
}

function renderBuiltInControl(
  fieldApi: AnyFieldApi,
  schema: LeafFieldSchema,
  isDisabled: boolean,
  fieldProps: FieldControlProps,
) {
  const value = fieldApi.state.value as unknown

  switch (schema.type) {
    case "input":
      return (
        <Input
          {...schema.props}
          id={fieldProps.id}
          name={fieldProps.name}
          type={schema.inputType ?? "text"}
          aria-labelledby={fieldProps["aria-labelledby"]}
          aria-describedby={fieldProps["aria-describedby"]}
          aria-invalid={fieldProps["aria-invalid"]}
          aria-required={fieldProps["aria-required"]}
          placeholder={schema.placeholder}
          disabled={isDisabled}
          value={value == null ? "" : String(value)}
          onChange={(e) => {
            if (schema.inputType === "number") {
              const next = e.target.value === "" ? "" : Number(e.target.value)
              fieldApi.handleChange(Number.isNaN(next) ? "" : next)
              return
            }
            fieldApi.handleChange(e.target.value)
          }}
          onBlur={fieldProps.onBlur}
        />
      )
    case "textarea":
      return (
        <Textarea
          {...schema.props}
          id={fieldProps.id}
          name={fieldProps.name}
          aria-labelledby={fieldProps["aria-labelledby"]}
          aria-describedby={fieldProps["aria-describedby"]}
          aria-invalid={fieldProps["aria-invalid"]}
          aria-required={fieldProps["aria-required"]}
          placeholder={schema.placeholder}
          rows={schema.rows ?? 4}
          disabled={isDisabled}
          value={value == null ? "" : String(value)}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldProps.onBlur}
        />
      )
    case "select":
      return (
        <Select
          value={value == null ? "" : String(value)}
          onValueChange={(next) => fieldApi.handleChange(next)}
        >
          <SelectTrigger
            {...schema.props}
            id={fieldProps.id}
            aria-labelledby={fieldProps["aria-labelledby"]}
            aria-describedby={fieldProps["aria-describedby"]}
            aria-invalid={fieldProps["aria-invalid"]}
            aria-required={fieldProps["aria-required"]}
            disabled={isDisabled}
            className={cn("w-full", schema.props?.className as string | undefined)}
          >
            <SelectValue placeholder={schema.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {schema.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "checkbox":
      return (
        <Checkbox
          id={fieldProps.id}
          name={fieldProps.name}
          aria-labelledby={fieldProps["aria-labelledby"]}
          aria-describedby={fieldProps["aria-describedby"]}
          aria-invalid={fieldProps["aria-invalid"]}
          aria-required={fieldProps["aria-required"]}
          checked={Boolean(value)}
          disabled={isDisabled}
          onCheckedChange={(next) => fieldApi.handleChange(!!next)}
          onBlur={fieldProps.onBlur}
        />
      )
    case "switch":
      return (
        <Switch
          id={fieldProps.id}
          name={fieldProps.name}
          aria-labelledby={fieldProps["aria-labelledby"]}
          aria-describedby={fieldProps["aria-describedby"]}
          aria-invalid={fieldProps["aria-invalid"]}
          aria-required={fieldProps["aria-required"]}
          checked={Boolean(value)}
          disabled={isDisabled}
          onCheckedChange={(next) => fieldApi.handleChange(!!next)}
          onBlur={fieldProps.onBlur}
        />
      )
    default:
      return null
  }
}

function renderControl(
  fieldApi: AnyFieldApi,
  schema: LeafFieldSchema,
  isDisabled: boolean,
  values: Record<string, unknown>,
  fieldProps: FieldControlProps,
  widgets?: FieldWidgetRegistry,
) {
  const widgetKey = schema.widget ?? schema.type
  const customRenderer = widgetKey && widgets?.[widgetKey]
  if (customRenderer) {
    return customRenderer({
      fieldApi,
      schema,
      disabled: isDisabled,
      values,
      fieldProps,
    })
  }

  return renderBuiltInControl(fieldApi, schema, isDisabled, fieldProps)
}

export function RenderField({ form, schema, path, values, parentDisabled = false, className, widgets }: RenderFieldProps) {
  const titleId = React.useId()
  const descriptionId = React.useId()
  const helpTextId = React.useId()
  const errorId = React.useId()
  const controlId = React.useId()
  const isVisible = schema.visibleWhen ? evaluateRule(schema.visibleWhen, { values }) : true
  const isDisabled = parentDisabled || (schema.disabledWhen ? evaluateRule(schema.disabledWhen, { values }) : false)
  if (!isVisible) return null
  const isRequired = schema.requiredWhen ? evaluateRule(schema.requiredWhen, { values }) : false

  const validators = buildFieldValidator(schema, values)

  return (
    <form.Field name={path} validators={validators}>
      {(field) => {
        const fieldApi = field as AnyFieldApi
        const errors = fieldErrors(fieldApi)
        const describedBy = [
          schema.description ? descriptionId : undefined,
          schema.helpText ? helpTextId : undefined,
          errors.length > 0 ? errorId : undefined,
        ]
          .filter(Boolean)
          .join(" ")
        const fieldProps: FieldControlProps = {
          id: controlId,
          name: path,
          "aria-labelledby": titleId,
          "aria-describedby": describedBy || undefined,
          "aria-invalid": errors.length > 0,
          "aria-required": isRequired,
          onBlur: fieldApi.handleBlur,
        }

        return (
        <Field
          className={cn("gap-2", className)}
          data-invalid={errors.length > 0 ? "true" : undefined}
        >
          <FieldTitle id={titleId}>
            {schema.label}
            {isRequired ? <span className="text-destructive">*</span> : null}
          </FieldTitle>
          <FieldContent>
            <div className={cn("flex items-center gap-2", schema.type === "switch" && "justify-between")}>
            {renderControl(fieldApi, schema as LeafFieldSchema, isDisabled, values, fieldProps, widgets)}
            {schema.type === "checkbox" && schema.description ? (
              <span id={descriptionId} className="text-sm text-muted-foreground">{schema.description}</span>
            ) : null}
            </div>
            {schema.helpText ? <FieldDescription id={helpTextId}>{schema.helpText}</FieldDescription> : null}
            <FieldError id={errorId} errors={errors} />
          </FieldContent>
        </Field>
        )
      }}
    </form.Field>
  )
}

export function SchemaNodeRenderer({
  form,
  schema,
  path,
  parentDisabled = false,
  widgets,
}: {
  form: FormApiLike
  schema: FieldSchema
  path: string
  parentDisabled?: boolean
  widgets?: FieldWidgetRegistry
}) {
  const watchPaths = isGroupField(schema)
    ? getGroupSubscriptionPaths(path, schema)
    : getLeafSubscriptionPaths(path, schema)

  return (
    <form.Subscribe selector={(state) => pickValuesByPaths(state.values, watchPaths)}>
      {(values) => {
        const selectedValues = values as Record<string, unknown>
        if (isGroupField(schema)) {
          return renderGroupField({
            form,
            schema,
            path,
            values: selectedValues,
            parentDisabled,
            widgets,
          })
        }

        return (
          <RenderField
            form={form}
            schema={schema}
            path={path}
            values={selectedValues}
            parentDisabled={parentDisabled}
            widgets={widgets}
          />
        )
      }}
    </form.Subscribe>
  )
}

export function DerivedValueSync({
  form,
  schema,
  values,
}: {
  form: FormApiLike
  schema: FormSchema
  values: Record<string, unknown>
}) {
  React.useEffect(() => {
    for (const rule of schema.derived ?? []) {
      const next = computeDerivedValue(rule, values)
      const current = getPathValue(values, rule.path)
      const nextJson = JSON.stringify(next)
      const currentJson = JSON.stringify(current)
      if (nextJson !== currentJson) {
        form.setFieldValue(rule.path, next)
      }
    }
  }, [form, schema.derived, values])

  return null
}

export function LinkValueSync({
  form,
  schema,
  values,
}: {
  form: FormApiLike
  schema: FormSchema
  values: Record<string, unknown>
}) {
  const copyHistoryRef = React.useRef<Map<number, unknown>>(new Map())

  React.useEffect(() => {
    applySchemaLinks(form, schema, values, copyHistoryRef.current)
  }, [form, schema, values])

  return null
}

interface SectionRendererProps {
  form: FormApiLike
  schema: FormSchema
  widgets?: FieldWidgetRegistry
}

export function SectionRenderer({ form, schema, widgets }: SectionRendererProps) {
  return (
    <div className="space-y-4">
      {schema.sections.map((section, sectionIndex) => (
        <FieldGroup key={`${schema.id}-section-${sectionIndex}`} className="rounded-lg border p-4">
          {section.title ? <div className="text-sm font-medium">{section.title}</div> : null}
          {section.description ? <p className="text-sm text-muted-foreground">{section.description}</p> : null}
          <div className="space-y-3">
            {section.fields.map((field) => {
              return (
                <SchemaNodeRenderer
                  key={field.name}
                  form={form}
                  schema={field}
                  path={field.name}
                  widgets={widgets}
                />
              )
            })}
          </div>
        </FieldGroup>
      ))}
    </div>
  )
}

interface RepeatableGroupProps {
  children: React.ReactNode
  onAdd?: () => void
  onRemove?: () => void
  canRemove?: boolean
}

export function RepeatableGroupActions({ children, onAdd, onRemove, canRemove }: RepeatableGroupProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>{children}</div>
      <div className="flex items-center gap-2">
        {onAdd ? (
          <Button type="button" variant="outline" size="sm" onClick={onAdd} className="h-8 gap-1.5">
            <PlusIcon className="size-3.5" />
            Add
          </Button>
        ) : null}
        {canRemove && onRemove ? (
          <Button type="button" variant="outline" size="sm" onClick={onRemove} className="h-8 gap-1.5">
            <Trash2Icon className="size-3.5" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  )
}
