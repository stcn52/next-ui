import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Combobox, type ComboboxOption } from "@/components/ui/inputs/combobox"

const frameworks: ComboboxOption[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("")
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("combobox")).toBeInTheDocument()
  },
}

export const WithPreselected: Story = {
  render: () => {
    const [value, setValue] = useState("astro")
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    )
  },
}

const languages: ComboboxOption[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
]

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState("")
    return (
      <Combobox
        options={languages}
        value={value}
        onValueChange={setValue}
        placeholder="Select language..."
        searchPlaceholder="Search language..."
        emptyMessage="No language found."
      />
    )
  },
}
