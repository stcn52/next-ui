import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const distDir = resolve(root, "dist")
const srcLocalesDir = resolve(root, "src/locales")
const distLocalesDir = resolve(distDir, "locales")

const localeFiles = ["en.json", "zh-CN.json", "ja-JP.json"]

mkdirSync(distLocalesDir, { recursive: true })
for (const file of localeFiles) {
  copyFileSync(resolve(srcLocalesDir, file), resolve(distLocalesDir, file))
}

const cssEntry = resolve(distDir, "index.css")
const cssExport = resolve(distDir, "style.css")
if (!existsSync(cssExport) && existsSync(cssEntry)) {
  copyFileSync(cssEntry, cssExport)
}

const requiredFiles = [
  resolve(distDir, "index.mjs"),
  resolve(distDir, "index.cjs"),
  resolve(distDir, "index.d.ts"),
  resolve(distDir, "style.css"),
  ...localeFiles.map((file) => resolve(distLocalesDir, file)),
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error("[postbuild-lib] Missing expected files:")
  for (const file of missing) {
    console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log("[postbuild-lib] dist output verified")
