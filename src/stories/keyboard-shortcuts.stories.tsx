import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { useGlobalShortcut } from "@/components/ui/shortcuts"
import { Badge } from "@/components/ui/display/badge"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/overlays/command"
import { Settings, User, Search, FileText, Home } from "lucide-react"

const meta: Meta = {
  title: "Patterns/Keyboard Shortcuts",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

function ShortcutDemo() {
  const [log, setLog] = useState<string[]>([])
  const [cmdOpen, setCmdOpen] = useState(false)

  const addLog = (msg: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 10))

  useGlobalShortcut("mod+k", () => {
    setCmdOpen((o) => !o)
    addLog("⌘K → Toggle Command Menu")
  })
  useGlobalShortcut("mod+shift+p", () => addLog("⌘⇧P → Command Palette"))
  useGlobalShortcut("g d", () => addLog("G → D → Navigate to Dashboard"))
  useGlobalShortcut("g s", () => addLog("G → S → Navigate to Settings"))
  useGlobalShortcut("mod+/", () => addLog("⌘/ → Toggle Help"))

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">Try these shortcuts:</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { keys: "⌘K", desc: "Toggle Command Menu" },
            { keys: "⌘⇧P", desc: "Command Palette" },
            { keys: "G then D", desc: "Go to Dashboard" },
            { keys: "G then S", desc: "Go to Settings" },
            { keys: "⌘/", desc: "Toggle Help" },
          ].map(({ keys, desc }) => (
            <div
              key={keys}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span className="text-sm">{desc}</span>
              <kbd className="inline-flex items-center rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">Event Log</h3>
        <div className="rounded-md border bg-muted/30 p-3">
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">Press a shortcut to see it logged here...</p>
          ) : (
            <div className="flex flex-col gap-1">
              {log.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <Badge variant="outline" className="text-[10px]">
                    {entry.split(" — ")[0]}
                  </Badge>
                  <span>{entry.split(" — ")[1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => { addLog("Navigate: Home"); setCmdOpen(false) }}>
                <Home />
                Home
                <CommandShortcut>G H</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { addLog("Navigate: Dashboard"); setCmdOpen(false) }}>
                <FileText />
                Dashboard
                <CommandShortcut>G D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { addLog("Navigate: Settings"); setCmdOpen(false) }}>
                <Settings />
                Settings
                <CommandShortcut>G S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => { addLog("Search triggered"); setCmdOpen(false) }}>
                <Search />
                Search
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { addLog("Profile opened"); setCmdOpen(false) }}>
                <User />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

export const Default: Story = {
  render: () => <ShortcutDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Try these shortcuts:")).toBeInTheDocument()
  },
}
