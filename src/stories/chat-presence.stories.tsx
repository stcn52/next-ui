import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { ConfigProvider, useTranslation } from "@/components/config-provider"
import { buildChatPresenceLabels } from "@/components/ui/chat/chat-i18n"
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
    layout: "header",
    status: "online",
    readState: "read",
    density: "dense",
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

export const HeaderAdaptive: Story = {
  args: {
    layout: "header",
    status: "offline",
    lastSeen: "5 分钟前",
    readState: "read",
    density: "compact",
    participants: [
      { key: "a", label: "Alice" },
      { key: "b", label: "Bob" },
      { key: "c", label: "Chen" },
    ],
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

export const LocalizedWithProvider: Story = {
  render: function Render() {
    function LocalizedPresence() {
      const t = useTranslation()
      return (
        <ChatPresence
          variant="badge"
          status="away"
          density="compact"
          participantLimit={2}
          participants={[
            { key: "a", label: "Alice" },
            { key: "b", label: "Bob" },
            { key: "c", label: "Chen" },
          ]}
          readState="read"
          labels={buildChatPresenceLabels(t)}
        />
      )
    }

    return (
      <ConfigProvider locale="en">
        <LocalizedPresence />
      </ConfigProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Away")).toBeInTheDocument()
    await expect(canvas.getByText("Read")).toBeInTheDocument()
  },
}
