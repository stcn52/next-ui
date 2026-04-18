function normalizePath(path: string): string {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/^\./, "")
}

function isIndex(segment: string): boolean {
  return /^\d+$/.test(segment)
}

function setByPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = normalizePath(path).split(".").filter(Boolean)
  if (!segments.length) return

  let current: Record<string, unknown> | unknown[] = target
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]!
    const last = index === segments.length - 1

    if (Array.isArray(current)) {
      const arrayIndex = Number(segment)
      if (last) {
        current[arrayIndex] = value
        return
      }

      if (current[arrayIndex] == null || typeof current[arrayIndex] !== "object") {
        current[arrayIndex] = isIndex(segments[index + 1] ?? "") ? [] : {}
      }
      current = current[arrayIndex] as Record<string, unknown> | unknown[]
      continue
    }

    if (last) {
      current[segment] = value
      return
    }

    if (current[segment] == null || typeof current[segment] !== "object") {
      current[segment] = isIndex(segments[index + 1] ?? "") ? [] : {}
    }

    current = current[segment] as Record<string, unknown> | unknown[]
  }
}

export function pickValuesByPaths(values: Record<string, unknown>, paths: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const path of paths) {
    const normalized = normalizePath(path)
    const segments = normalized.split(".").filter(Boolean)
    if (!segments.length) continue

    let currentValue: unknown = values
    for (const segment of segments) {
      if (currentValue == null || typeof currentValue !== "object") {
        currentValue = undefined
        break
      }

      currentValue = (currentValue as Record<string, unknown>)[segment]
    }

    if (currentValue !== undefined) {
      setByPath(result, path, currentValue)
    }
  }

  return result
}

export function uniquePaths(paths: Array<string | undefined | null>): string[] {
  return [...new Set(paths.filter((path): path is string => Boolean(path)))]
}
