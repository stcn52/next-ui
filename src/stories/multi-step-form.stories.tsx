import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field"

const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

const step2Schema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
})

const step3Schema = z.object({
  terms: z.boolean().refine((v) => v, "You must accept the terms"),
})

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>
type Step3 = z.infer<typeof step3Schema>

const STEPS = ["Personal Info", "Work Info", "Review & Submit"]

function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3>>({})
  const [submitted, setSubmitted] = useState(false)

  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: formData.name ?? "", email: formData.email ?? "" },
  })

  const form2 = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      company: formData.company ?? "",
      role: formData.role ?? "",
      bio: formData.bio ?? "",
    },
  })

  const form3 = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues: { terms: formData.terms ?? false },
  })
  const acceptedTerms = useWatch({
    control: form3.control,
    name: "terms",
  })

  const progress = ((step + 1) / STEPS.length) * 100

  const handleNext = async () => {
    if (step === 0) {
      const valid = await form1.trigger()
      if (!valid) return
      setFormData((prev) => ({ ...prev, ...form1.getValues() }))
    } else if (step === 1) {
      const valid = await form2.trigger()
      if (!valid) return
      setFormData((prev) => ({ ...prev, ...form2.getValues() }))
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))

  const handleSubmit = async () => {
    const valid = await form3.trigger()
    if (!valid) return
    setFormData((prev) => ({ ...prev, ...form3.getValues() }))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Submitted!</CardTitle>
          <CardDescription>Your form has been submitted.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setStep(0)
              setFormData({})
              form1.reset()
              form2.reset()
              form3.reset()
            }}
          >
            Start Over
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{STEPS[step]}</CardTitle>
        <CardDescription>
          Step {step + 1} of {STEPS.length}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <FieldGroup>
            <Field data-invalid={form1.formState.errors.name ? "true" : undefined}>
              <FieldTitle>Full Name</FieldTitle>
              <FieldContent>
                <Input {...form1.register("name")} placeholder="John Doe" />
                <FieldError errors={[form1.formState.errors.name]} />
              </FieldContent>
            </Field>
            <Field data-invalid={form1.formState.errors.email ? "true" : undefined}>
              <FieldTitle>Email</FieldTitle>
              <FieldContent>
                <Input
                  {...form1.register("email")}
                  type="email"
                  placeholder="john@example.com"
                />
                <FieldError errors={[form1.formState.errors.email]} />
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
        {step === 1 && (
          <FieldGroup>
            <Field data-invalid={form2.formState.errors.company ? "true" : undefined}>
              <FieldTitle>Company</FieldTitle>
              <FieldContent>
                <Input {...form2.register("company")} placeholder="Acme Inc." />
                <FieldError errors={[form2.formState.errors.company]} />
              </FieldContent>
            </Field>
            <Field data-invalid={form2.formState.errors.role ? "true" : undefined}>
              <FieldTitle>Role</FieldTitle>
              <FieldContent>
                <Input
                  {...form2.register("role")}
                  placeholder="Frontend Engineer"
                />
                <FieldError errors={[form2.formState.errors.role]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldTitle>Bio (optional)</FieldTitle>
              <FieldContent>
                <Textarea
                  {...form2.register("bio")}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                <FieldDescription>Max 200 characters.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
        {step === 2 && (
          <FieldGroup>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Company:</strong> {formData.company}
              </p>
              <p>
                <strong>Role:</strong> {formData.role}
              </p>
              {formData.bio && (
                <p>
                  <strong>Bio:</strong> {formData.bio}
                </p>
              )}
            </div>
            <Field
              orientation="horizontal"
              data-invalid={form3.formState.errors.terms ? "true" : undefined}
            >
              <Checkbox
                checked={acceptedTerms}
                onCheckedChange={(v) => form3.setValue("terms", !!v, { shouldValidate: true })}
              />
              <FieldContent>
                <FieldTitle>Accept Terms & Conditions</FieldTitle>
                <FieldDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FieldDescription>
                <FieldError errors={[form3.formState.errors.terms]} />
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </CardFooter>
    </Card>
  )
}

const meta: Meta = {
  title: "Patterns/Multi-step Form",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <MultiStepForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Personal Info")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("John Doe")).toBeInTheDocument()
  },
}
