/**
 * MultiSelect stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { MultiSelect } from "@/components/ui/inputs/multi-select"

const TECHS = [
  { value: "react", label: "React", description: "UI 库" },
  { value: "vue", label: "Vue", description: "渐进式框架" },
  { value: "angular", label: "Angular", description: "企业级框架" },
  { value: "svelte", label: "Svelte", description: "编译时框架" },
  { value: "solid", label: "SolidJS", description: "响应式框架" },
  { value: "next", label: "Next.js", description: "React 全栈框架" },
  { value: "nuxt", label: "Nuxt.js", description: "Vue 全栈框架" },
  { value: "astro", label: "Astro", description: "内容驱动框架" },
]

const meta: Meta<typeof MultiSelect> = {
  title: "UI/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  args: { options: TECHS, placeholder: "选择技术栈" },
  decorators: [(S) => <div className="max-w-sm"><S /></div>],
}
export default meta
type Story = StoryObj<typeof MultiSelect>

export const Default: Story = {}
export const WithDefault: Story = { args: { defaultValue: ["react", "next"] } }
export const MaxSelected: Story = { args: { maxSelected: 3, placeholder: "最多选 3 项" } }
export const Disabled: Story = { args: { disabled: true, defaultValue: ["react"] } }
export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([])
    return (
      <div className="space-y-2">
        <MultiSelect options={TECHS} value={val} onChange={setVal} />
        <p className="text-sm text-muted-foreground">已选：{val.join(", ") || "无"}</p>
      </div>
    )
  },
}
