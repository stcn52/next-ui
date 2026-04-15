import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const meta: Meta = {
  title: "Forms/Form",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Basic form schema
// ---------------------------------------------------------------------------

const basicSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type BasicFormValues = z.infer<typeof basicSchema>

export const Default: Story = {
  render: () => {
    const form = useForm<BasicFormValues>({
      resolver: zodResolver(basicSchema),
      defaultValues: { username: "", email: "" },
    })

    const [submitted, setSubmitted] = useState<BasicFormValues | null>(null)

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => setSubmitted(data))}
          className="flex flex-col gap-4 max-w-sm"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>Your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          {submitted && (
            <pre className="mt-2 rounded bg-muted p-2 text-xs">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          )}
        </form>
      </Form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Submit empty → should show errors
    await userEvent.click(canvas.getByText("Submit"))
    await expect(
      canvas.getByText("Username must be at least 2 characters")
    ).toBeInTheDocument()
    await expect(
      canvas.getByText("Invalid email address")
    ).toBeInTheDocument()
    // Fill in valid data
    await userEvent.type(
      canvas.getByPlaceholderText("johndoe"),
      "testuser"
    )
    await userEvent.type(
      canvas.getByPlaceholderText("john@example.com"),
      "test@test.com"
    )
    await userEvent.click(canvas.getByText("Submit"))
    // Errors should be gone
    await expect(
      canvas.queryByText("Username must be at least 2 characters")
    ).not.toBeInTheDocument()
  },
}

// ---------------------------------------------------------------------------
// Advanced form with all field types
// ---------------------------------------------------------------------------

const advancedSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
  terms: z.boolean().refine((v) => v, "You must accept the terms"),
})

type AdvancedFormValues = z.infer<typeof advancedSchema>

export const Advanced: Story = {
  render: () => {
    const form = useForm<AdvancedFormValues>({
      resolver: zodResolver(advancedSchema),
      defaultValues: { name: "", bio: "", terms: false },
    })

    const [result, setResult] = useState("")

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            setResult(JSON.stringify(data, null, 2))
          )}
          className="flex flex-col gap-4 max-w-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Max 200 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>I accept the terms and conditions</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          {result && (
            <pre className="mt-2 rounded bg-muted p-2 text-xs">{result}</pre>
          )}
        </form>
      </Form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Submit empty
    await userEvent.click(canvas.getByText("Submit"))
    await expect(
      canvas.getByText("Name is required")
    ).toBeInTheDocument()
    await expect(
      canvas.getByText("You must accept the terms")
    ).toBeInTheDocument()
    // Fill in
    await userEvent.type(canvas.getByPlaceholderText("Jane Doe"), "Alice")
    await userEvent.type(
      canvas.getByPlaceholderText("Tell us about yourself..."),
      "Hello world"
    )
    await userEvent.click(canvas.getByRole("checkbox"))
    await userEvent.click(canvas.getByText("Submit"))
    await expect(
      canvas.queryByText("Name is required")
    ).not.toBeInTheDocument()
  },
}
