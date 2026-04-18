import type { FieldSchema, FieldType } from "./types"

export const fieldTypeOrder: FieldType[] = [
  "input",
  "textarea",
  "select",
  "checkbox",
  "switch",
  "group",
]

export function isGroupField(field: FieldSchema): field is Extract<FieldSchema, { type: "group" }> {
  return field.type === "group"
}

