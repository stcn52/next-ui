import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  AnimatedCard,
  FadeIn,
  SlideIn,
  StaggerList,
  StaggerItem,
  AnimatedListItem,
  ScaleTap,
} from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence } from "motion/react"

const meta: Meta<typeof AnimatedCard> = {
  title: "UI/AnimatedCard",
  component: AnimatedCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof AnimatedCard>

export const Default: Story = {
  args: {
    title: "Animated Card",
    description: "This card animates in on mount and scales on hover.",
    children: (
      <p className="text-sm text-muted-foreground">
        Hover over this card to see the scale animation effect.
      </p>
    ),
    footer: <Button size="sm">Learn More</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Animated Card")).toBeInTheDocument()
    await expect(canvas.getByText("Learn More")).toBeInTheDocument()
  },
}

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-lg">
      {[
        { title: "Card One", delay: 0, badge: "New" },
        { title: "Card Two", delay: 0.1, badge: "Popular" },
        { title: "Card Three", delay: 0.2, badge: "Beta" },
        { title: "Card Four", delay: 0.3, badge: "Stable" },
      ].map(({ title, badge }) => (
        <AnimatedCard
          key={title}
          title={title}
          description="Staggered animation"
          footer={<Badge variant="secondary">{badge}</Badge>}
        >
          <p className="text-xs text-muted-foreground">Content area</p>
        </AnimatedCard>
      ))}
    </div>
  ),
}

export const FadeInDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <FadeIn delay={0}>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">First element (no delay)</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Second element (150ms delay)</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Third element (300ms delay)</p>
        </div>
      </FadeIn>
    </div>
  ),
}

export const SlideInDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <SlideIn delay={0}>
        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm font-medium">Slides from left</p>
        </div>
      </SlideIn>
      <SlideIn delay={0.1}>
        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm font-medium">Slides in after 100ms</p>
        </div>
      </SlideIn>
    </div>
  ),
}

export const StaggeredList: Story = {
  render: () => (
    <StaggerList className="flex flex-col gap-3 max-w-sm">
      {["Dashboard", "Analytics", "Reports", "Settings", "Help"].map(
        (item) => (
          <StaggerItem key={item}>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <p className="text-sm font-medium">{item}</p>
            </div>
          </StaggerItem>
        )
      )}
    </StaggerList>
  ),
}

export const AnimatedTodoList: Story = {
  name: "Animated List (Add/Remove)",
  render: () => {
    const [items, setItems] = useState([
      { id: 1, text: "Buy groceries" },
      { id: 2, text: "Walk the dog" },
      { id: 3, text: "Write code" },
    ])
    let nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
    return (
      <div className="flex flex-col gap-3 max-w-sm">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setItems([...items, { id: nextId++, text: `Task ${nextId}` }])
          }}
        >
          + Add item
        </Button>
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <AnimatedListItem key={item.id} layoutId={String(item.id)}>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{item.text}</span>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() =>
                    setItems(items.filter((i) => i.id !== item.id))
                  }
                >
                  ×
                </Button>
              </div>
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  },
}

export const ScaleTapDemo: Story = {
  name: "Scale on Tap",
  render: () => (
    <div className="flex gap-3">
      {["Primary", "Secondary", "Outline"].map((label) => (
        <ScaleTap key={label}>
          <Button
            variant={
              label.toLowerCase() as "default" | "secondary" | "outline"
            }
          >
            {label}
          </Button>
        </ScaleTap>
      ))}
    </div>
  ),
}
