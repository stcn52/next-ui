import type { Meta, StoryObj } from "@storybook/react"
import { ChatPresence } from "@/components/ui/chat/chat-presence"

const meta: Meta<typeof ChatPresence> = {
  title: "Chat/Presence",
  component: ChatPresence,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ChatPresence>

export const Inline: Story = {
  args: {
    status: "online",
    typing: true,
    readState: "delivered",
  },
}

export const DenseMinimal: Story = {
  args: {
    status: "online",
    readState: "read",
    density: "dense",
    showStatusLabel: false,
    showReadLabel: false,
  },
}

export const BadgeGroup: Story = {
  args: {
    variant: "badge",
    status: "away",
    density: "compact",
    participantLimit: 2,
    participants: [
      { key: "a", label: "Alice" },
      { key: "b", label: "Bob" },
      { key: "c", label: "Chen" },
      { key: "d", label: "Dana" },
    ],
    readState: "read",
  },
}

export const StackedOffline: Story = {
  args: {
    variant: "stacked",
    status: "offline",
    lastSeen: "5 分钟前",
    readState: "sent",
  },
}
