import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { ChevronsUpDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="flex w-64 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repos</h4>
        <CollapsibleTrigger
          className="inline-flex items-center justify-center rounded-md p-1 text-sm hover:bg-muted"
          aria-label="Toggle"
        >
          <ChevronsUpDown />
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm font-mono">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 text-sm font-mono">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-2 text-sm font-mono">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: /toggle/i })
    // Content should not be visible initially
    expect(canvas.queryByText("@radix-ui/colors")).not.toBeVisible()
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvas.getByText("@radix-ui/colors")).toBeVisible()
    })
  },
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible open className="flex w-64 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Repositories</h4>
        <CollapsibleTrigger
          className="inline-flex items-center justify-center rounded-md p-1 text-sm hover:bg-muted"
          aria-label="Toggle"
        >
          <ChevronsUpDown />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 text-sm">Repo 1</div>
        <div className="rounded-md border px-4 py-2 text-sm">Repo 2</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
