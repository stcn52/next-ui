import type { FormSchema } from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

const inputTypes = ["text", "email", "password", "number", "url", "tel"] as const

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isSelectOption(value: unknown): boolean {
  return isRecord(value) && typeof value.label === "string" && typeof value.value === "string"
}

function isInputType(value: unknown): value is (typeof inputTypes)[number] {
  return typeof value === "string" && inputTypes.includes(value as (typeof inputTypes)[number])
}

function isValidationRule(value: unknown): boolean {
  if (!isRecord(value) || typeof value.op !== "string") return false

  switch (value.op) {
    case "required":
      return value.message === undefined || typeof value.message === "string"
    case "minLength":
    case "maxLength":
    case "min":
    case "max":
      return typeof value.value === "number" && (value.message === undefined || typeof value.message === "string")
    case "pattern":
      return typeof value.value === "string" && (value.flags === undefined || typeof value.flags === "string") && (value.message === undefined || typeof value.message === "string")
    default:
      return false
  }
}

function isRule(value: unknown): boolean {
  if (!isRecord(value) || typeof value.op !== "string") return false

  switch (value.op) {
    case "and":
    case "or":
      return Array.isArray(value.rules) && value.rules.every(isRule)
    case "not":
      return isRule(value.rule)
    case "eq":
    case "neq":
      return typeof value.path === "string" && "value" in value
    case "in":
    case "notIn":
      return typeof value.path === "string" && Array.isArray(value.value)
    case "exists":
    case "empty":
      return typeof value.path === "string"
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      return typeof value.path === "string" && typeof value.value === "number"
    case "derive":
      return typeof value.path === "string" && isStringArray(value.from) && typeof value.expr === "string"
    default:
      return false
  }
}

function isDerivedRule(value: unknown): boolean {
  return isRule(value) && isRecord(value) && value.op === "derive"
}

function isFieldLinkEffect(value: unknown): boolean {
  if (!isRecord(value) || typeof value.op !== "string") return false

  switch (value.op) {
    case "copy":
      return typeof value.from === "string"
    case "set":
      return "value" in value
    case "clear":
      return true
    default:
      return false
  }
}

function isFieldLinkRule(value: unknown): boolean {
  return (
    isRecord(value) &&
    Array.isArray(value.watch) &&
    value.watch.every((path) => typeof path === "string") &&
    typeof value.target === "string" &&
    (value.when === undefined || isRule(value.when)) &&
    isFieldLinkEffect(value.effect)
  )
}

function isFieldSchema(value: unknown): boolean {
  if (!isRecord(value) || typeof value.type !== "string" || typeof value.name !== "string") return false

  switch (value.type) {
    case "input":
      return (
        typeof value.label === "string" &&
        (value.inputType === undefined || isInputType(value.inputType)) &&
        (value.widget === undefined || typeof value.widget === "string") &&
        (value.widgetProps === undefined || isRecord(value.widgetProps)) &&
        (value.description === undefined || typeof value.description === "string") &&
        (value.helpText === undefined || typeof value.helpText === "string") &&
        (value.placeholder === undefined || typeof value.placeholder === "string") &&
        (value.props === undefined || isRecord(value.props)) &&
        (value.visibleWhen === undefined || isRule(value.visibleWhen)) &&
        (value.disabledWhen === undefined || isRule(value.disabledWhen)) &&
        (value.requiredWhen === undefined || isRule(value.requiredWhen)) &&
        (value.validateWhen === undefined || isRule(value.validateWhen)) &&
        (value.validate === undefined || (Array.isArray(value.validate) && value.validate.every(isValidationRule)))
      )
    case "textarea":
      return (
        typeof value.label === "string" &&
        (value.rows === undefined || typeof value.rows === "number") &&
        (value.widget === undefined || typeof value.widget === "string") &&
        (value.widgetProps === undefined || isRecord(value.widgetProps)) &&
        (value.description === undefined || typeof value.description === "string") &&
        (value.helpText === undefined || typeof value.helpText === "string") &&
        (value.placeholder === undefined || typeof value.placeholder === "string") &&
        (value.props === undefined || isRecord(value.props)) &&
        (value.visibleWhen === undefined || isRule(value.visibleWhen)) &&
        (value.disabledWhen === undefined || isRule(value.disabledWhen)) &&
        (value.requiredWhen === undefined || isRule(value.requiredWhen)) &&
        (value.validateWhen === undefined || isRule(value.validateWhen)) &&
        (value.validate === undefined || (Array.isArray(value.validate) && value.validate.every(isValidationRule)))
      )
    case "select":
      return (
        typeof value.label === "string" &&
        Array.isArray(value.options) &&
        value.options.every(isSelectOption) &&
        (value.widget === undefined || typeof value.widget === "string") &&
        (value.widgetProps === undefined || isRecord(value.widgetProps)) &&
        (value.description === undefined || typeof value.description === "string") &&
        (value.helpText === undefined || typeof value.helpText === "string") &&
        (value.placeholder === undefined || typeof value.placeholder === "string") &&
        (value.props === undefined || isRecord(value.props)) &&
        (value.visibleWhen === undefined || isRule(value.visibleWhen)) &&
        (value.disabledWhen === undefined || isRule(value.disabledWhen)) &&
        (value.requiredWhen === undefined || isRule(value.requiredWhen)) &&
        (value.validateWhen === undefined || isRule(value.validateWhen)) &&
        (value.validate === undefined || (Array.isArray(value.validate) && value.validate.every(isValidationRule)))
      )
    case "checkbox":
    case "switch":
      return (
        typeof value.label === "string" &&
        (value.widget === undefined || typeof value.widget === "string") &&
        (value.widgetProps === undefined || isRecord(value.widgetProps)) &&
        (value.description === undefined || typeof value.description === "string") &&
        (value.helpText === undefined || typeof value.helpText === "string") &&
        (value.placeholder === undefined || typeof value.placeholder === "string") &&
        (value.props === undefined || isRecord(value.props)) &&
        (value.visibleWhen === undefined || isRule(value.visibleWhen)) &&
        (value.disabledWhen === undefined || isRule(value.disabledWhen)) &&
        (value.requiredWhen === undefined || isRule(value.requiredWhen)) &&
        (value.validateWhen === undefined || isRule(value.validateWhen)) &&
        (value.validate === undefined || (Array.isArray(value.validate) && value.validate.every(isValidationRule)))
      )
    case "group":
      return (
        (value.label === undefined || typeof value.label === "string") &&
        (value.description === undefined || typeof value.description === "string") &&
        (value.widget === undefined || typeof value.widget === "string") &&
        (value.widgetProps === undefined || isRecord(value.widgetProps)) &&
        Array.isArray(value.fields) &&
        value.fields.every(isFieldSchema) &&
        (value.repeatable === undefined || typeof value.repeatable === "boolean") &&
        (value.minItems === undefined || typeof value.minItems === "number") &&
        (value.maxItems === undefined || typeof value.maxItems === "number") &&
        (value.visibleWhen === undefined || isRule(value.visibleWhen)) &&
        (value.disabledWhen === undefined || isRule(value.disabledWhen))
      )
    default:
      return false
  }
}

function isSchemaSection(value: unknown): value is { fields: unknown[] } {
  return isRecord(value) && Array.isArray(value.fields) && value.fields.every(isFieldSchema)
}

export function isFormSchema(value: unknown): value is FormSchema {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    (value.title === undefined || typeof value.title === "string") &&
    (value.description === undefined || typeof value.description === "string") &&
    (value.submitLabel === undefined || typeof value.submitLabel === "string") &&
    (value.derived === undefined || (Array.isArray(value.derived) && value.derived.every(isDerivedRule))) &&
    (value.links === undefined || (Array.isArray(value.links) && value.links.every(isFieldLinkRule))) &&
    Array.isArray(value.sections) &&
    value.sections.every(isSchemaSection)
  )
}

export function parseFormSchemaJson(source: string): { schema?: FormSchema; error?: string } {
  try {
    const parsed: unknown = JSON.parse(source)
    if (!isFormSchema(parsed)) {
      return { error: "JSON is not a valid FormSchema object." }
    }
    return { schema: parsed }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid JSON." }
  }
}

export function stringifyFormSchemaJson(schema: FormSchema): string {
  return JSON.stringify(schema, null, 2)
}
