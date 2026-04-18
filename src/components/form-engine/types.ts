export type LogicalRule =
  | { op: "and"; rules: Rule[] }
  | { op: "or"; rules: Rule[] }
  | { op: "not"; rule: Rule }

export type ComparisonRule =
  | { op: "eq"; path: string; value: unknown }
  | { op: "neq"; path: string; value: unknown }
  | { op: "in"; path: string; value: unknown[] }
  | { op: "notIn"; path: string; value: unknown[] }
  | { op: "exists"; path: string }
  | { op: "empty"; path: string }
  | { op: "gt"; path: string; value: number }
  | { op: "gte"; path: string; value: number }
  | { op: "lt"; path: string; value: number }
  | { op: "lte"; path: string; value: number }

export type DerivedRule = {
  op: "derive"
  path: string
  from: string[]
  expr: string
}

export type FieldLinkEffect =
  | { op: "copy"; from: string }
  | { op: "set"; value: unknown }
  | { op: "clear" }

export type FieldLinkRule = {
  watch: string[]
  target: string
  when?: Rule
  effect: FieldLinkEffect
}

export type Rule = LogicalRule | ComparisonRule | DerivedRule

export type ValidationRule =
  | { op: "required"; message?: string }
  | { op: "minLength"; value: number; message?: string }
  | { op: "maxLength"; value: number; message?: string }
  | { op: "min"; value: number; message?: string }
  | { op: "max"; value: number; message?: string }
  | { op: "pattern"; value: string; flags?: string; message?: string }

export type FieldType = "input" | "textarea" | "select" | "checkbox" | "switch" | "group"

export interface BaseFieldSchema {
  name: string
  label: string
  description?: string
  helpText?: string
  placeholder?: string
  widget?: string
  widgetProps?: Record<string, unknown>
  defaultValue?: unknown
  props?: Record<string, unknown>
  visibleWhen?: Rule
  disabledWhen?: Rule
  requiredWhen?: Rule
  validateWhen?: Rule
  validate?: ValidationRule[]
}

export interface InputFieldSchema extends BaseFieldSchema {
  type: "input"
  inputType?: "text" | "email" | "password" | "number" | "url" | "tel"
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: "textarea"
  rows?: number
}

export interface FormSelectOption {
  label: string
  value: string
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select"
  options: FormSelectOption[]
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: "checkbox"
}

export interface SwitchFieldSchema extends BaseFieldSchema {
  type: "switch"
}

export interface GroupFieldSchema {
  type: "group"
  name: string
  label?: string
  description?: string
  fields: FieldSchema[]
  repeatable?: boolean
  minItems?: number
  maxItems?: number
  visibleWhen?: Rule
  disabledWhen?: Rule
}

export type FieldSchema =
  | InputFieldSchema
  | TextareaFieldSchema
  | SelectFieldSchema
  | CheckboxFieldSchema
  | SwitchFieldSchema
  | GroupFieldSchema

export interface FormSectionSchema {
  title?: string
  description?: string
  fields: FieldSchema[]
}

export interface FormSchema {
  id: string
  title?: string
  description?: string
  submitLabel?: string
  derived?: DerivedRule[]
  links?: FieldLinkRule[]
  sections: FormSectionSchema[]
}

export interface RuleContext {
  values: Record<string, unknown>
}
