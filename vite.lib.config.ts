import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import dts from "vite-plugin-dts"
import { visualizer } from "rollup-plugin-visualizer"

const analyze = process.env.ANALYZE === "true"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    libInjectCss(),
    dts({
      include: ["src/components", "src/lib", "src/locales", "src/index.ts"],
      outDir: "dist",
      rollupTypes: true,
    }),
    analyze && visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "NextUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "named",
      },
    },
    sourcemap: true,
    emptyOutDir: false,
  },
})
