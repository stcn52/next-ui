import type { Rule, RuleContext, ValidationRule } from "./types"

function normalizePath(path: string): string {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/^\./, "")
}

export function getPathValue(values: Record<string, unknown>, path: string): unknown {
  const segments = normalizePath(path).split(".").filter(Boolean)
  let current: unknown = values

  for (const segment of segments) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

export function isEmptyValue(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "number") return Number.isNaN(value)
  return false
}

export function evaluateRule(rule: Rule | undefined, context: RuleContext): boolean {
  if (!rule) return true

  switch (rule.op) {
    case "and":
      return rule.rules.every((child) => evaluateRule(child, context))
    case "or":
      return rule.rules.some((child) => evaluateRule(child, context))
    case "not":
      return !evaluateRule(rule.rule, context)
    case "eq":
      return getPathValue(context.values, rule.path) === rule.value
    case "neq":
      return getPathValue(context.values, rule.path) !== rule.value
    case "in":
      return rule.value.includes(getPathValue(context.values, rule.path))
    case "notIn":
      return !rule.value.includes(getPathValue(context.values, rule.path))
    case "exists":
      return !isEmptyValue(getPathValue(context.values, rule.path))
    case "empty":
      return isEmptyValue(getPathValue(context.values, rule.path))
    case "gt":
      return Number(getPathValue(context.values, rule.path)) > rule.value
    case "gte":
      return Number(getPathValue(context.values, rule.path)) >= rule.value
    case "lt":
      return Number(getPathValue(context.values, rule.path)) < rule.value
    case "lte":
      return Number(getPathValue(context.values, rule.path)) <= rule.value
    case "derive":
      return true
    default:
      return true
  }
}

export function validateRule(rule: ValidationRule, value: unknown): string | undefined {
  switch (rule.op) {
    case "required":
      return isEmptyValue(value) ? (rule.message ?? "Required") : undefined
    case "minLength":
      return String(value ?? "").length < rule.value ? (rule.message ?? `Must be at least ${rule.value} characters`) : undefined
    case "maxLength":
      return String(value ?? "").length > rule.value ? (rule.message ?? `Must be at most ${rule.value} characters`) : undefined
    case "min":
      return Number(value) < rule.value ? (rule.message ?? `Must be at least ${rule.value}`) : undefined
    case "max":
      return Number(value) > rule.value ? (rule.message ?? `Must be at most ${rule.value}`) : undefined
    case "pattern": {
      const re = new RegExp(rule.value, rule.flags)
      return re.test(String(value ?? "")) ? undefined : (rule.message ?? "Invalid format")
    }
    default:
      return undefined
  }
}

export function computeDerivedValue(
  rule: Extract<Rule, { op: "derive" }>,
  values: Record<string, unknown>,
): unknown {
  const args = rule.from.map((path) => getPathValue(values, path))
  try {
    const fn = new Function(...rule.from, `return (${rule.expr});`) as (
      ...inputs: unknown[]
    ) => unknown
    return fn(...args)
  } catch {
    return undefined
  }
}
