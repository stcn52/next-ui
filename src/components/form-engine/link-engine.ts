import { evaluateRule, getPathValue, isEmptyValue } from "./rule-engine"
import { collectLinkDependencyPaths } from "./dependency-analyzer"
import { pickValuesByPaths, uniquePaths } from "./subscription"
import type { FieldLinkRule, FormSchema } from "./types"

type LinkFormApi = {
  setFieldValue: (field: string, value: unknown) => void
}

const LINK_SKIP = Symbol("link-skip")

function isEqualValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function shouldMirrorCopiedValue(currentValue: unknown, nextValue: unknown): boolean {
  if (isEqualValue(currentValue, nextValue)) return false
  return isEmptyValue(currentValue) || (typeof currentValue === "string" && typeof nextValue === "string" && currentValue.startsWith(nextValue))
}

export function collectSchemaLinkDependencyPaths(schema: FormSchema): string[] {
  return uniquePaths((schema.links ?? []).flatMap(collectLinkDependencyPaths))
}

function resolveLinkValue(link: FieldLinkRule, values: Record<string, unknown>): unknown {
  if (!evaluateRule(link.when, { values })) {
    return LINK_SKIP
  }

  switch (link.effect.op) {
    case "copy":
      return getPathValue(values, link.effect.from)
    case "set":
      return link.effect.value
    case "clear":
      return undefined
    default:
      return undefined
  }
}

export function applySchemaLinks(
  form: LinkFormApi,
  schema: FormSchema,
  values: Record<string, unknown>,
  copyHistory?: Map<number, unknown>,
): void {
  for (const [index, link] of (schema.links ?? []).entries()) {
    const currentValue = getPathValue(values, link.target)
    const nextValue = resolveLinkValue(link, values)
    if (nextValue === LINK_SKIP) continue

    if (link.effect.op === "copy") {
      const previousCopiedValue = copyHistory?.get(index)
      const shouldMirror =
        shouldMirrorCopiedValue(currentValue, nextValue) ||
        (previousCopiedValue !== undefined && isEqualValue(currentValue, previousCopiedValue))

      if (!shouldMirror) continue
      form.setFieldValue(link.target, nextValue)
      copyHistory?.set(index, nextValue)
      continue
    }

    if (isEqualValue(currentValue, nextValue)) continue
    form.setFieldValue(link.target, nextValue)
  }
}

export function pickLinkValues(values: Record<string, unknown>, schema: FormSchema): Record<string, unknown> {
  return pickValuesByPaths(values, collectSchemaLinkDependencyPaths(schema))
}
