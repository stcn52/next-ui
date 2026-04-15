import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

const meta: Meta = {
  title: "UI/Field",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldTitle>Email</FieldTitle>
        <FieldContent>
          <Input type="email" placeholder="you@example.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByPlaceholderText("you@example.com")).toBeInTheDocument()
  },
}

export const WithValidation: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field data-invalid="true">
        <FieldTitle>Username</FieldTitle>
        <FieldContent>
          <Input aria-invalid defaultValue="ab" />
          <FieldError>Username must be at least 3 characters.</FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

export const HorizontalLayout: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field orientation="horizontal">
        <FieldLabel>
          <Checkbox />
        </FieldLabel>
        <FieldContent>
          <FieldTitle>Accept terms</FieldTitle>
          <FieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>
          <Switch />
        </FieldLabel>
        <FieldContent>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>
            Receive emails about new products and features.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

export const FieldSetExample: Story = {
  name: "FieldSet with Legend",
  render: () => (
    <FieldSet className="max-w-sm rounded-lg border p-4">
      <FieldLegend>Personal Info</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldTitle>First Name</FieldTitle>
          <Input placeholder="John" />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldTitle>Last Name</FieldTitle>
          <Input placeholder="Doe" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
