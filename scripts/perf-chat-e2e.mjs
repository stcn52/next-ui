#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { performance } from "node:perf_hooks"

const runs = Number(process.env.RUNS || 3)
const grep = process.env.GREP || "chat"
const baseline = process.env.BASELINE_SEC ? Number(process.env.BASELINE_SEC) : null
const failAbovePct = Number(process.env.FAIL_ABOVE_PCT || 20)

function runOnce(index) {
  const start = performance.now()
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "playwright",
      "test",
      "e2e/page-compositions.spec.ts",
      "-g",
      grep,
      "--reporter=line",
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  )
  const end = performance.now()
  return {
    ok: result.status === 0,
    seconds: (end - start) / 1000,
  }
}

const times = []
for (let i = 1; i <= runs; i += 1) {
  console.log(`\n[perf:chat] Run ${i}/${runs}`)
  const r = runOnce(i)
  times.push(r.seconds)
  if (!r.ok) {
    console.error("[perf:chat] Playwright run failed")
    process.exit(1)
  }
}

const total = times.reduce((a, b) => a + b, 0)
const avg = total / times.length
const sorted = [...times].sort((a, b) => a - b)
const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]

console.log("\n[perf:chat] Summary")
console.log(`runs=${runs}`)
console.log(`avg=${avg.toFixed(2)}s`)
console.log(`min=${sorted[0].toFixed(2)}s`)
console.log(`max=${sorted[sorted.length - 1].toFixed(2)}s`)
console.log(`p95=${p95.toFixed(2)}s`)

if (baseline && Number.isFinite(baseline)) {
  const deltaPct = ((avg - baseline) / baseline) * 100
  const sign = deltaPct >= 0 ? "+" : ""
  console.log(`baseline=${baseline.toFixed(2)}s delta=${sign}${deltaPct.toFixed(2)}%`)
  if (deltaPct > failAbovePct) {
    console.error(
      `[perf:chat] Regression detected: avg exceeds baseline by ${deltaPct.toFixed(2)}% (threshold ${failAbovePct}%)`,
    )
    process.exit(1)
  }
}
