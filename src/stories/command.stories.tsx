import type { Meta, StoryObj } from "@storybook/react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Calculator, Calendar, Settings, Smile, User } from "lucide-react"

const meta: Meta = {
  title: "UI/Command",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-80 max-h-72">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 size-4" />
            Calendar
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 size-4" />
            Search Emoji
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 size-4" />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 size-4" />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 size-4" />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const WithDialog: Story = {
  render: () => {
    // CommandDialog story is demonstrated in the Default story above.
    // For full dialog behavior, see the live Storybook preview.
    return (
      <div className="text-sm text-muted-foreground p-4">
        See the Default story for the inline Command palette.
        CommandDialog wraps the same palette in a modal Dialog.
      </div>
    )
  },
}
