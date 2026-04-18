import type { FieldLinkRule, FieldSchema, FormSchema, Rule } from "./types"

export interface SchemaDependencyNode {
  path: string
  kind: "field" | "group" | "derived" | "link"
  dependsOn: string[]
  children?: SchemaDependencyNode[]
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

export function collectRuleDependencyPaths(rule: Rule | undefined): string[] {
  if (!rule) return []

  switch (rule.op) {
    case "and":
      return unique(rule.rules.flatMap(collectRuleDependencyPaths))
    case "or":
      return unique(rule.rules.flatMap(collectRuleDependencyPaths))
    case "not":
      return collectRuleDependencyPaths(rule.rule)
    case "eq":
    case "neq":
    case "in":
    case "notIn":
    case "exists":
    case "empty":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      return [rule.path]
    case "derive":
      return unique([rule.path, ...rule.from])
    default:
      return []
  }
}

export function collectFieldDependencyPaths(field: FieldSchema): string[] {
  return unique([
    ...collectRuleDependencyPaths(field.visibleWhen),
    ...collectRuleDependencyPaths(field.disabledWhen),
    ...collectRuleDependencyPaths(field.type === "group" ? undefined : field.requiredWhen),
    ...collectRuleDependencyPaths(field.type === "group" ? undefined : field.validateWhen),
  ])
}

export function collectDerivedDependencyPaths(derived: NonNullable<FormSchema["derived"]>[number]): string[] {
  return unique([derived.path, ...derived.from])
}

export function collectSchemaDerivedDependencyPaths(schema: FormSchema): string[] {
  return unique((schema.derived ?? []).flatMap(collectDerivedDependencyPaths))
}

export function collectLinkDependencyPaths(link: FieldLinkRule): string[] {
  return unique([
    ...link.watch,
    link.target,
    ...(link.effect.op === "copy" ? [link.effect.from] : []),
    ...collectRuleDependencyPaths(link.when),
  ])
}

function joinSchemaPath(prefix: string, name: string): string {
  return prefix ? `${prefix}.${name}` : name
}

function collectFieldNode(
  field: FieldSchema,
  inheritedDependsOn: string[] = [],
  prefix = "",
): SchemaDependencyNode {
  const path = joinSchemaPath(prefix, field.name)
  const ownDependsOn = unique([...inheritedDependsOn, ...collectFieldDependencyPaths(field)])

  if (field.type === "group") {
    const childPrefix = field.repeatable ? `${path}[]` : path
    return {
      path,
      kind: "group",
      dependsOn: ownDependsOn,
      children: field.fields.map((child) => collectFieldNode(child, ownDependsOn, childPrefix)),
    }
  }

  return {
    path,
    kind: "field",
    dependsOn: ownDependsOn,
  }
}

export function analyzeSchemaDependencies(schema: FormSchema): SchemaDependencyNode[] {
  const nodes = schema.sections.flatMap((section) =>
    section.fields.map((field) => collectFieldNode(field)),
  )

  for (const derived of schema.derived ?? []) {
    nodes.push({
      path: derived.path,
      kind: "derived",
      dependsOn: collectDerivedDependencyPaths(derived),
    })
  }

  for (const link of schema.links ?? []) {
    nodes.push({
      path: link.target,
      kind: "link",
      dependsOn: collectLinkDependencyPaths(link),
    })
  }

  return nodes
}
