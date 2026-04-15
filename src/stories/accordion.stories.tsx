import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within, waitFor } from "storybook/test"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: /is it accessible/i })
    await expect(trigger).toBeInTheDocument()
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(canvas.getByText(/WAI-ARIA design pattern/i)).toBeVisible()
    })
  },
}

export const Multiple: Story = {
  render: () => (
    <Accordion openMultiple className="w-96">
      <AccordionItem value="faq-1">
        <AccordionTrigger>What is shadcn/ui?</AccordionTrigger>
        <AccordionContent>
          A collection of reusable components built with Radix UI and Tailwind CSS.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger>Do I need to install it as a dependency?</AccordionTrigger>
        <AccordionContent>
          No. It's not a component library, you pick and choose components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger>Can I use it with TypeScript?</AccordionTrigger>
        <AccordionContent>
          Yes. It's already written in TypeScript.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
