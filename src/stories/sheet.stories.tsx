import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/overlays/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"

const meta: Meta = {
  title: "UI/Sheet",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-name">Name</Label>
            <Input id="sheet-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-username">Username</Label>
            <Input id="sheet-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: /open sheet/i })
    await expect(trigger).toBeInTheDocument()
    await userEvent.click(trigger)
    const body = within(document.body)
    await expect(body.getByText("Edit Profile")).toBeInTheDocument()
  },
}

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Left Sheet</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Quick access to navigation.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button variant="ghost" className="justify-start">Home</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
          <Button variant="ghost" className="justify-start">Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}
