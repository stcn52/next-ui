import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <p className="text-sm text-muted-foreground">Account settings content.</p>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <p className="text-sm text-muted-foreground">Password settings content.</p>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <p className="text-sm text-muted-foreground">General settings content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Analytics</TabsTrigger>
        <TabsTrigger value="tab3">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4">
        <p className="text-sm text-muted-foreground">Overview content.</p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4">
        <p className="text-sm text-muted-foreground">Analytics content.</p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4">
        <p className="text-sm text-muted-foreground">Reports content.</p>
      </TabsContent>
    </Tabs>
  ),
}
