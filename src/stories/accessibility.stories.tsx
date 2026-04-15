import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

const meta: Meta = {
  title: "Theme/Accessibility",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
}

export default meta
type Story = StoryObj

/**
 * Demonstrates proper accessible labeling patterns for all form controls.
 * The `a11y: { test: 'error' }` parameter ensures axe-core violations fail the test.
 */
export const FormControls: Story = {
  name: "Form Controls (Labeled)",
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Accessible Form Controls</CardTitle>
          <CardDescription>
            Every control has a proper label via Field + FieldLabel or aria-label.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Input with Field label */}
          <Field>
            <FieldLabel>Email address</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
            <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          </Field>

          {/* Checkbox with label */}
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
            </div>
          </Field>

          {/* Switch with label */}
          <Field>
            <div className="flex items-center gap-3">
              <Switch id="notifications" aria-label="Enable notifications" />
              <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
            </div>
          </Field>

          {/* Select with label */}
          <Field>
            <FieldLabel>Country</FieldLabel>
            <Select aria-label="Select a country">
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="cn">China</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Slider with label */}
          <div>
            <label className="text-sm font-medium" id="volume-label">
              Volume
            </label>
            <Slider
              defaultValue={[50]}
              min={0}
              max={100}
              aria-labelledby="volume-label"
            />
          </div>

          {/* Progress with label */}
          <Progress value={72} aria-label="Upload progress">
            <ProgressLabel>Uploading...</ProgressLabel>
            <ProgressValue />
          </Progress>

          <Button type="submit">Submit</Button>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Accessible Form Controls")).toBeInTheDocument()
    await expect(canvas.getByLabelText("Email address")).toBeInTheDocument()
    await expect(canvas.getByText("Accept terms and conditions")).toBeInTheDocument()
    await expect(canvas.getByText("Enable notifications")).toBeInTheDocument()
  },
}

/**
 * Demonstrates keyboard navigation for interactive components.
 */
export const KeyboardNavigation: Story = {
  name: "Keyboard Navigation",
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation Demo</CardTitle>
          <CardDescription>
            Tab through controls. Focus rings confirm keyboard accessibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            <Button>Tab to me</Button>
            <Button variant="secondary">And me</Button>
            <Button variant="outline">Then me</Button>
          </div>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="Tab here too" />
          </Field>
          <div className="flex items-center gap-2">
            <Checkbox id="kb-check" />
            <label htmlFor="kb-check" className="text-sm">
              Space to toggle
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="kb-switch" aria-label="Toggle feature" />
            <label htmlFor="kb-switch" className="text-sm">
              Space to toggle
            </label>
          </div>
          <div className="flex gap-2">
            <Badge>Badge 1</Badge>
            <Badge variant="secondary">Badge 2</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Tab through elements to verify focus works
    const firstButton = canvas.getByText("Tab to me")
    await userEvent.click(firstButton)
    await userEvent.tab()
    await userEvent.tab()

    // Verify checkbox can be toggled with keyboard
    const checkbox = canvas.getByRole("checkbox")
    checkbox.focus()
    await userEvent.keyboard(" ")
  },
}

/**
 * Demonstrates dialog accessibility with proper title and description associations.
 */
export const DialogAccessibility: Story = {
  name: "Dialog A11y",
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Dialog Accessibility</CardTitle>
          <CardDescription>
            Dialog has proper title, description and focus trapping.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger>
              <Button>Open Accessible Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  This dialog demonstrates proper semantic structure with
                  title and description connected via ARIA attributes.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose>
                  <Button>Confirm</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Dialog Accessibility")).toBeInTheDocument()
    await expect(canvas.getByText("Open Accessible Dialog")).toBeInTheDocument()
  },
}
