/**
 * FileTree Stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { FileTree, type FileTreeItem } from "@/components/ui/file-tree"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof FileTree> = {
  title: "Components/FileTree",
  component: FileTree,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof FileTree>

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_TREE: FileTreeItem[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          { id: "button", name: "button.tsx" },
          { id: "card", name: "card.tsx" },
          { id: "input", name: "input.tsx" },
        ],
      },
      {
        id: "pages",
        name: "pages",
        children: [
          { id: "index", name: "index.tsx" },
          { id: "about", name: "about.tsx" },
        ],
      },
      { id: "app", name: "App.tsx" },
      { id: "main", name: "main.tsx" },
    ],
  },
  {
    id: "public",
    name: "public",
    children: [
      { id: "favicon", name: "favicon.ico" },
      { id: "og-image", name: "og-image.png" },
    ],
  },
  { id: "package-json", name: "package.json" },
  { id: "tsconfig", name: "tsconfig.json" },
  { id: "readme", name: "README.md" },
]

/** 默认展示 */
export const Default: Story = {
  render: () => (
    <div className="w-64 border rounded-lg p-2">
      <FileTree items={SAMPLE_TREE} defaultOpen={["src", "components"]} />
    </div>
  ),
}

/** 带选中状态 */
export const WithSelection: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string>("button")
      return (
        <div className="w-64 border rounded-lg p-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">文件树</span>
            <Badge variant="secondary" className="text-xs">{selected}</Badge>
          </div>
          <FileTree
            items={SAMPLE_TREE}
            selected={selected}
            defaultOpen={["src", "components", "pages"]}
            onSelect={(item) => setSelected(item.id)}
          />
        </div>
      )
    }
    return <Demo />
  },
}

/** 空文件夹 */
export const EmptyFolders: Story = {
  render: () => {
    const tree: FileTreeItem[] = [
      { id: "dist", name: "dist", children: [] },
      { id: "node_modules", name: "node_modules", children: [] },
      { id: "src2", name: "src", children: [{ id: "index2", name: "index.ts" }] },
    ]
    return (
      <div className="w-56 border rounded-lg p-2">
        <FileTree items={tree} defaultOpen={["src2"]} />
      </div>
    )
  },
}

/** 深层嵌套 */
export const DeepNested: Story = {
  render: () => {
    const tree: FileTreeItem[] = [
      {
        id: "a",
        name: "level-1",
        children: [
          {
            id: "b",
            name: "level-2",
            children: [
              {
                id: "c",
                name: "level-3",
                children: [
                  { id: "d", name: "level-4", children: [{ id: "e", name: "deep-file.ts" }] },
                ],
              },
            ],
          },
        ],
      },
    ]
    return (
      <div className="w-72 border rounded-lg p-2">
        <FileTree items={tree} defaultOpen={["a", "b", "c", "d"]} />
      </div>
    )
  },
}
