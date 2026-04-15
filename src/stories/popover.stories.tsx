import type { Meta, StoryObj } from "@storybook/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta: Meta = {
  title: "UI/Popover",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex justify-center gap-4 p-16">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm">Top</Button>} />
        <PopoverContent side="top">
          <p className="text-sm">Popover on top</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm">Bottom</Button>} />
        <PopoverContent side="bottom">
          <p className="text-sm">Popover on bottom</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm">Left</Button>} />
        <PopoverContent side="left">
          <p className="text-sm">Popover on left</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm">Right</Button>} />
        <PopoverContent side="right">
          <p className="text-sm">Popover on right</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
