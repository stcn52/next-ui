import type { Meta, StoryObj } from "@storybook/react"
import { AnimatedCard, FadeIn, SlideIn } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
