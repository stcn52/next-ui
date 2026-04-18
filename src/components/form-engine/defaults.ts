import type { FieldSchema, FormSchema } from "./types"

function defaultForLeafField(field: Exclude<FieldSchema, { type: "group" }>): unknown {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }

  switch (field.type) {
    case "checkbox":
    case "switch":
      return false
    case "input":
      return field.inputType === "number" ? 0 : ""
    case "textarea":
    case "select":
      return ""
  }
}

export function createFieldDefaults(fields: FieldSchema[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const field of fields) {
    if (field.type === "group") {
      const item = createFieldDefaults(field.fields)
      const count = field.repeatable ? Math.max(field.minItems ?? 0, 0) : 1
      result[field.name] = field.repeatable ? Array.from({ length: count }, () => createFieldDefaults(field.fields)) : item
      continue
    }

    result[field.name] = defaultForLeafField(field)
  }

  return result
}

export function createFormDefaults(schema: FormSchema): Record<string, unknown> {
  return schema.sections.reduce<Record<string, unknown>>((acc, section) => {
    return { ...acc, ...createFieldDefaults(section.fields) }
  }, {})
}
