import type { Meta, StoryObj } from "@storybook/react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"

const meta: Meta = {
  title: "UI/Select",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="asia/shanghai">Asia/Shanghai</SelectItem>
          <SelectItem value="asia/tokyo">Asia/Tokyo</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="europe/london">Europe/London</SelectItem>
          <SelectItem value="europe/paris">Europe/Paris</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-40" size="sm">
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="opt1">Option 1</SelectItem>
        <SelectItem value="opt2">Option 2</SelectItem>
        <SelectItem value="opt3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}
