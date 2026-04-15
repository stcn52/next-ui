import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta: Meta = {
  title: "UI/Drawer",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="drawer-name">Name</Label>
            <Input id="drawer-name" defaultValue="John Doe" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="drawer-username">Username</Label>
            <Input id="drawer-username" defaultValue="@johndoe" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: /open drawer/i })
    await expect(trigger).toBeInTheDocument()
    await userEvent.click(trigger)
    const body = within(document.body)
    await expect(body.getByText("Edit Profile")).toBeInTheDocument()
  },
}

export const RightDirection: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Right Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Side navigation panel.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Button variant="ghost" className="justify-start">Home</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
          <Button variant="ghost" className="justify-start">Settings</Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
