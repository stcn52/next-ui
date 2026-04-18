import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { format } from "date-fns"
import { SchemaForm } from "@/components/form-engine"
import { createFormDefaults } from "@/components/form-engine"
import { ColorPicker } from "@/components/ui/color-picker"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/inputs/input-otp"
import { NumberInput } from "@/components/ui/inputs/number-input"
import { MultiSelect } from "@/components/ui/inputs/multi-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/inputs/radio-group"
import { RangeSlider } from "@/components/ui/inputs/range-slider"
import { TagInput } from "@/components/ui/inputs/tag-input"
import { Label } from "@/components/ui/inputs/label"
import { TimePicker } from "@/components/ui/date/time-picker"
import { DateTimePicker } from "@/components/ui/date/date-time-picker"
import { DatePicker } from "@/components/ui/date/date-picker"
import { DateRangePicker } from "@/components/ui/date/date-range-picker"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { CommentEditor } from "@/components/ui/comment-editor"
import { FileUpload } from "@/components/ui/file-upload"
import type { FileUploadItem } from "@/components/ui/file-upload"
import { Combobox } from "@/components/ui/inputs/combobox"
import { ChatSender } from "@/components/ui/chat/chat-sender"
import type { FormSchema } from "@/components/form-engine"

const schema: FormSchema = {
  id: "poc-form",
  title: "PoC Form",
  submitLabel: "Save",
  derived: [
    {
      op: "derive",
      path: "workspaceSlug",
      from: ["workspaceName"],
      expr:
        'workspaceName ? workspaceName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : ""',
    },
  ],
  links: [
    {
      watch: ["workspaceName"],
      target: "companyName",
      when: { op: "empty", path: "companyName" },
      effect: { op: "copy", from: "workspaceName" },
    },
    {
      watch: ["useBilling"],
      target: "billingEmail",
      when: { op: "eq", path: "useBilling", value: false },
      effect: { op: "clear" },
    },
  ],
  sections: [
    {
      title: "Basics",
      fields: [
        {
          type: "input",
          name: "workspaceName",
          label: "Workspace name",
          validate: [{ op: "required" }],
        },
        {
          type: "input",
          name: "workspaceSlug",
          label: "Workspace slug",
          props: { readOnly: true },
        },
        {
          type: "select",
          name: "workspaceType",
          label: "Workspace type",
          options: [
            { label: "Personal", value: "personal" },
            { label: "Team", value: "team" },
          ],
        },
        {
          type: "input",
          name: "companyName",
          label: "Company name",
        },
        {
          type: "switch",
          name: "useBilling",
          label: "Use billing contact",
        },
        {
          type: "input",
          name: "billingEmail",
          label: "Billing email",
          visibleWhen: { op: "eq", path: "useBilling", value: true },
        },
      ],
    },
    {
      title: "Team",
      fields: [
        {
          type: "group",
          name: "members",
          label: "Team members",
          repeatable: true,
          minItems: 1,
          maxItems: 3,
          fields: [
            {
              type: "input",
              name: "name",
              label: "Member name",
            },
            {
              type: "input",
              name: "email",
              label: "Member email",
            },
          ],
        },
      ],
    },
  ],
}

function renderForm(showInspector = false, defaultValues?: Record<string, unknown>) {
  const onSubmit = vi.fn()
  const mergedDefaults = defaultValues ? { ...createFormDefaults(schema), ...defaultValues } : undefined
  render(
    <SchemaForm
      schema={schema}
      showInspector={showInspector}
      defaultValues={mergedDefaults}
      onSubmit={onSubmit}
    />
  )
  return { onSubmit }
}

const projectWidgetSchema: FormSchema = {
  id: "project-widget-form",
  title: "Project Widgets",
  sections: [
    {
      fields: [
        {
          type: "input",
          name: "budget",
          label: "Budget",
          widget: "number-input",
          widgetProps: { prefix: "$", step: 50 },
          defaultValue: 100,
        },
      ],
    },
  ],
}

const projectWidgets = {
  "number-input": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { label: string; widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <NumberInput
      {...fieldProps}
      value={typeof fieldApi.state.value === "number" ? fieldApi.state.value : undefined}
      disabled={disabled}
      onChange={(next) => fieldApi.handleChange(next ?? "")}
      {...(schema.widgetProps as Record<string, unknown> | undefined)}
    />
  ),
  "color-picker": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <ColorPicker
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "multi-select": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <MultiSelect
      fieldProps={fieldProps}
      options={[
        { label: "Forms", value: "forms" },
        { label: "Tables", value: "tables" },
      ]}
      value={Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as string[]) : []}
      disabled={disabled}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "tag-input": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <TagInput
      fieldProps={fieldProps}
      value={Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as string[]) : []}
      disabled={disabled}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "otp-input": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <InputOTP
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      length={6}
      onChange={(next) => fieldApi.handleChange(next)}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  "radio-group": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <RadioGroup
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      onValueChange={(next) => fieldApi.handleChange(next)}
    >
      {[
        { label: "Owner", value: "owner" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ].map((option) => {
        const id = `access-${option.value}`
        return (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={id} />
            <Label htmlFor={id}>{option.label}</Label>
          </div>
        )
      })}
    </RadioGroup>
  ),
  "range-slider": ({
    fieldApi,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <RangeSlider
      fieldProps={fieldProps}
      value={
        Array.isArray(fieldApi.state.value) && fieldApi.state.value.length >= 2
          ? [Number(fieldApi.state.value[0]), Number(fieldApi.state.value[1])]
          : undefined
      }
      disabled={disabled}
      min={0}
      max={10000}
      step={500}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "time-picker": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <TimePicker
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      hourCycle={typeof schema.widgetProps?.hourCycle === "number" ? (schema.widgetProps.hourCycle as 12 | 24) : 24}
      placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "date-time-picker": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => {
    const rawValue = fieldApi.state.value
    const value =
      rawValue instanceof Date
        ? rawValue
        : typeof rawValue === "string" && rawValue.trim().length > 0
          ? new Date(rawValue)
          : undefined

    return (
      <DateTimePicker
        fieldProps={fieldProps}
        value={value && !Number.isNaN(value.getTime()) ? value : undefined}
        disabled={disabled}
        hourCycle={typeof schema.widgetProps?.hourCycle === "number" ? (schema.widgetProps.hourCycle as 12 | 24) : 24}
        placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
        onChange={(next) => fieldApi.handleChange(format(next, "yyyy-MM-dd'T'HH:mm:ss"))}
      />
    )
  },
  "date-picker": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => {
    const rawValue = fieldApi.state.value
    const value =
      typeof rawValue === "string" && rawValue.trim().length > 0
        ? new Date(`${rawValue}T00:00:00`)
        : rawValue instanceof Date
          ? rawValue
          : undefined

    return (
      <DatePicker
        fieldProps={fieldProps}
        date={value && !Number.isNaN(value.getTime()) ? value : undefined}
        disabled={disabled}
        className={typeof schema.widgetProps?.className === "string" ? schema.widgetProps.className : undefined}
        placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
        onDateChange={(next) => fieldApi.handleChange(next ? format(next, "yyyy-MM-dd") : "")}
      />
    )
  },
  "date-range-picker": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => {
    const rawValue = fieldApi.state.value
    const value =
      rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
        ? (rawValue as { from?: string; to?: string })
        : undefined
    const dateRange =
      value?.from
        ? {
            from: new Date(`${value.from}T00:00:00`),
            to: value.to ? new Date(`${value.to}T00:00:00`) : undefined,
          }
        : undefined

    return (
      <DateRangePicker
        fieldProps={fieldProps}
        disabled={disabled}
        dateRange={dateRange}
        numberOfMonths={typeof schema.widgetProps?.numberOfMonths === "number" ? schema.widgetProps.numberOfMonths : 2}
        placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
        onDateRangeChange={(next) =>
          fieldApi.handleChange(
            next?.from
              ? {
                  from: format(next.from, "yyyy-MM-dd"),
                  to: next.to ? format(next.to, "yyyy-MM-dd") : undefined,
                }
              : undefined,
          )
        }
      />
    )
  },
  "rich-text-editor": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <RichTextEditor
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      minRows={typeof schema.widgetProps?.minRows === "number" ? schema.widgetProps.minRows : undefined}
      maxRows={typeof schema.widgetProps?.maxRows === "number" ? schema.widgetProps.maxRows : undefined}
      placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "comment-editor": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <CommentEditor
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
      maxLength={typeof schema.widgetProps?.maxLength === "number" ? schema.widgetProps.maxLength : undefined}
      mentionUsers={Array.isArray(schema.widgetProps?.mentionUsers) ? (schema.widgetProps.mentionUsers as Array<{ id: string; name: string; username: string }>) : []}
      submitLabel={typeof schema.widgetProps?.submitLabel === "string" ? schema.widgetProps.submitLabel : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "file-upload": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => {
    const items = Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as FileUploadItem[]) : []

    return (
      <FileUpload
        fieldProps={fieldProps}
        disabled={disabled}
        accept={typeof schema.widgetProps?.accept === "string" ? schema.widgetProps.accept : undefined}
        multiple={schema.widgetProps?.multiple !== false}
        maxSize={typeof schema.widgetProps?.maxSize === "number" ? schema.widgetProps.maxSize : undefined}
        maxFiles={typeof schema.widgetProps?.maxFiles === "number" ? schema.widgetProps.maxFiles : undefined}
        placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
        description={typeof schema.widgetProps?.description === "string" ? schema.widgetProps.description : undefined}
        items={items}
        onFilesChange={(files) =>
          fieldApi.handleChange([
            ...items,
            ...files.map((file, index) => ({
              id: `${file.name}-${Date.now()}-${index}`,
              file: { name: file.name, size: file.size, type: file.type },
              status: "pending" as const,
            })),
          ])
        }
        onRemove={(id) => fieldApi.handleChange(items.filter((item) => item.id !== id))}
      />
    )
  },
  "combobox": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <Combobox
      fieldProps={fieldProps}
      disabled={disabled}
      options={Array.isArray(schema.widgetProps?.options) ? (schema.widgetProps.options as Array<{ label: string; value: string; disabled?: boolean }>) : []}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
      searchPlaceholder={typeof schema.widgetProps?.searchPlaceholder === "string" ? schema.widgetProps.searchPlaceholder : undefined}
      emptyMessage={typeof schema.widgetProps?.emptyMessage === "string" ? schema.widgetProps.emptyMessage : undefined}
      className={typeof schema.widgetProps?.className === "string" ? schema.widgetProps.className : undefined}
      onValueChange={(next) => fieldApi.handleChange(next)}
    />
  ),
  "chat-sender": ({
    fieldApi,
    schema,
    disabled,
    fieldProps,
  }: {
    fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void }
    schema: { widgetProps?: Record<string, unknown> }
    disabled: boolean
    fieldProps: { id: string; name: string; "aria-describedby"?: string; "aria-invalid": boolean; "aria-labelledby": string; "aria-required"?: boolean; onBlur: () => void }
  }) => (
    <ChatSender
      fieldProps={fieldProps}
      disabled={disabled}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      placeholder={typeof schema.widgetProps?.placeholder === "string" ? schema.widgetProps.placeholder : undefined}
      loading={Boolean(schema.widgetProps?.loading)}
      allowAttachment={schema.widgetProps?.allowAttachment === true}
      suggestions={Array.isArray(schema.widgetProps?.suggestions) ? (schema.widgetProps.suggestions as string[]) : undefined}
      mentions={Array.isArray(schema.widgetProps?.mentions) ? (schema.widgetProps.mentions as Array<{ key: string; label: string; description?: string }>) : undefined}
      density={typeof schema.widgetProps?.density === "string" ? (schema.widgetProps.density as "default" | "compact" | "dense") : "default"}
      suggestionsVariant={typeof schema.widgetProps?.suggestionsVariant === "string" ? (schema.widgetProps.suggestionsVariant as "inline" | "overlay") : "overlay"}
      attachmentLayout={typeof schema.widgetProps?.attachmentLayout === "string" ? (schema.widgetProps.attachmentLayout as "scroll" | "wrap") : "scroll"}
      attachmentDisplay={typeof schema.widgetProps?.attachmentDisplay === "string" ? (schema.widgetProps.attachmentDisplay as "preview" | "summary") : "summary"}
      footerText={typeof schema.widgetProps?.footerText === "string" ? schema.widgetProps.footerText : undefined}
      maxRows={typeof schema.widgetProps?.maxRows === "number" ? schema.widgetProps.maxRows : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  ),
}

const projectCompositeWidgetSchema: FormSchema = {
  id: "project-composite-widget-form",
  title: "Project Composite Widgets",
  sections: [
    {
      fields: [
        {
          type: "input",
          name: "brandColor",
          label: "Brand color",
          widget: "color-picker",
          defaultValue: "#3b82f6",
        },
        {
          type: "input",
          name: "focusAreas",
          label: "Focus areas",
          widget: "multi-select",
          defaultValue: ["forms"],
        },
        {
          type: "input",
          name: "projectTags",
          label: "Project tags",
          widget: "tag-input",
          defaultValue: ["forms"],
        },
        {
          type: "input",
          name: "verificationCode",
          label: "Verification code",
          widget: "otp-input",
          defaultValue: "123456",
        },
        {
          type: "input",
          name: "accessLevel",
          label: "Access level",
          widget: "radio-group",
          defaultValue: "editor",
        },
        {
          type: "input",
          name: "budgetRange",
          label: "Budget range",
          widget: "range-slider",
          defaultValue: [1000, 5000],
        },
        {
          type: "input",
          name: "launchTime",
          label: "Launch time",
          widget: "time-picker",
          defaultValue: "09:30",
          widgetProps: { hourCycle: 12, placeholder: "Choose launch time" },
        },
        {
          type: "input",
          name: "launchAt",
          label: "Launch window",
          widget: "date-time-picker",
          defaultValue: "2024-12-08T14:30:00",
          widgetProps: { hourCycle: 24, placeholder: "Choose launch window" },
        },
        {
          type: "input",
          name: "launchDate",
          label: "Launch date",
          widget: "date-picker",
          defaultValue: "2024-12-08",
          widgetProps: { placeholder: "Choose launch date", className: "w-[280px]" },
        },
        {
          type: "textarea",
          name: "releaseNotes",
          label: "Release notes",
          widget: "rich-text-editor",
          defaultValue: "## Launch checklist\n- QA\n- Docs\n- Release",
          widgetProps: { minRows: 5, maxRows: 10, placeholder: "Write launch notes" },
        },
        {
          type: "input",
          name: "launchWindow",
          label: "Launch window range",
          widget: "date-range-picker",
          defaultValue: {
            from: "2024-12-01",
            to: "2024-12-07",
          },
          widgetProps: { numberOfMonths: 2, placeholder: "Choose launch window range" },
        },
        {
          type: "textarea",
          name: "launchComment",
          label: "Launch comment",
          widget: "comment-editor",
          defaultValue: "Great launch so far.",
          widgetProps: {
            placeholder: "Leave a launch comment",
            maxLength: 500,
            submitLabel: "Post comment",
            mentionUsers: [
              { id: "u1", name: "Alice", username: "alice" },
              { id: "u2", name: "Bob", username: "bob" },
            ],
          },
        },
        {
          type: "input",
          name: "launchFiles",
          label: "Launch files",
          widget: "file-upload",
          widgetProps: {
            accept: "image/*,.pdf",
            multiple: true,
            maxSize: 10 * 1024 * 1024,
            maxFiles: 3,
            placeholder: "Upload launch files",
            description: "PNG, JPG, PDF up to 10 MB",
          },
        },
        {
          type: "input",
          name: "framework",
          label: "Framework",
          widget: "combobox",
          defaultValue: "next.js",
          widgetProps: {
            placeholder: "Select framework",
            searchPlaceholder: "Search framework",
            options: [
              { label: "Next.js", value: "next.js" },
              { label: "SvelteKit", value: "sveltekit" },
              { label: "Nuxt.js", value: "nuxt.js" },
              { label: "Remix", value: "remix" },
              { label: "Astro", value: "astro" },
            ],
          },
        },
        {
          type: "textarea",
          name: "teamNote",
          label: "Team note",
          widget: "chat-sender",
          defaultValue: "Need feedback on the launch copy.",
          widgetProps: {
            placeholder: "Write a quick team note",
            suggestions: ["Looks good", "Needs a tweak", "Ship it"],
            mentions: [
              { key: "pm", label: "Product", description: "Product manager" },
              { key: "design", label: "Design", description: "Design lead" },
            ],
            footerText: "Press Enter to send",
            density: "compact",
            allowAttachment: false,
          },
        },
      ],
    },
  ],
}

describe("SchemaForm", () => {
  it("syncs derived values from their dependencies", async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText("Workspace name"), "Acme Design")

    await waitFor(() => {
      expect(screen.getByDisplayValue("acme-design")).toBeInTheDocument()
    })
  })

  it("syncs field links from their dependencies", async () => {
    const user = userEvent.setup()
    renderForm()

    fireEvent.change(screen.getByLabelText("Workspace name"), { target: { value: "Acme" } })

    await waitFor(() => {
      expect(screen.getByLabelText("Company name")).toHaveValue("Acme")
    })

    fireEvent.change(screen.getByLabelText("Company name"), { target: { value: "Manual" } })
    fireEvent.change(screen.getByLabelText("Workspace name"), { target: { value: "Acme Labs" } })

    await waitFor(() => {
      expect(screen.getByDisplayValue("Manual")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("switch", { name: "Use billing contact" }))
    await user.type(screen.getByLabelText("Billing email"), "billing@acme.com")
    await user.click(screen.getByRole("switch", { name: "Use billing contact" }))
    await user.click(screen.getByRole("switch", { name: "Use billing contact" }))

    await waitFor(() => {
      expect(screen.getByLabelText("Billing email")).toHaveValue("")
    })
  })

  it("toggles conditional fields from rule evaluation", async () => {
    const user = userEvent.setup()
    renderForm()

    expect(screen.queryByLabelText("Billing email")).not.toBeInTheDocument()

    await user.click(screen.getByRole("switch", { name: "Use billing contact" }))

    await waitFor(() => {
      expect(screen.getByLabelText("Billing email")).toBeInTheDocument()
    })
  })

  it("adds and removes repeatable group rows", async () => {
    const user = userEvent.setup()
    renderForm()

    expect(screen.getByText("Team members #1")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Add item" }))

    await waitFor(() => {
      expect(screen.getByText("Team members #2")).toBeInTheDocument()
    })

    const removeButtons = screen.getAllByRole("button", { name: "Remove" })
    await user.click(removeButtons[1]!)

    await waitFor(() => {
      expect(screen.queryByText("Team members #2")).not.toBeInTheDocument()
    })
    expect(screen.getAllByRole("button", { name: "Remove" })[0]).toBeDisabled()
  })

  it("renders schema and live values in the inspector", async () => {
    const user = userEvent.setup()
    renderForm(true)

    expect(screen.getByText("Schema JSON")).toBeInTheDocument()
    expect(screen.getByText("Dependency graph")).toBeInTheDocument()
    expect(screen.getByText("Field links")).toBeInTheDocument()
    expect(screen.getByText("Live values")).toBeInTheDocument()

    await user.type(screen.getByLabelText("Workspace name"), "Acme")

    await waitFor(() => {
      expect(screen.getAllByText(/"workspaceName"/).length).toBeGreaterThan(0)
      expect(screen.getByDisplayValue("acme")).toBeInTheDocument()
    })
  })

  it("renders project-owned widgets through the registry", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <SchemaForm
        schema={projectWidgetSchema}
        defaultValues={{ budget: 100 }}
        widgets={projectWidgets}
        onSubmit={onSubmit}
      />
    )

    expect(screen.getByLabelText("Budget")).toHaveValue("100")

    await user.clear(screen.getByLabelText("Budget"))
    await user.type(screen.getByLabelText("Budget"), "250")
    await user.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      budget: 250,
    })
  })

  it("wires field metadata into composite project widgets", () => {
    render(
      <SchemaForm
        schema={projectCompositeWidgetSchema}
        defaultValues={{
          brandColor: "#3b82f6",
          focusAreas: ["forms"],
          projectTags: ["forms"],
          verificationCode: "123456",
          accessLevel: "editor",
          budgetRange: [1000, 5000],
          launchTime: "09:30",
          launchAt: "2024-12-08T14:30:00",
          launchDate: "2024-12-08",
          releaseNotes: "## Launch checklist\n- QA\n- Docs\n- Release",
          launchWindow: {
            from: "2024-12-01",
            to: "2024-12-07",
          },
          launchComment: "Great launch so far.",
          launchFiles: [
            {
              id: "launch-files-1",
              file: { name: "brief.pdf", size: 0, type: "application/pdf" },
              status: "done",
            },
          ],
          framework: "next.js",
          teamNote: "Need feedback on the launch copy.",
        }}
        widgets={projectWidgets}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: "Brand color" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Focus areas" })).toBeInTheDocument()
    expect(screen.getByLabelText("Project tags")).toBeInTheDocument()
    expect(screen.getByLabelText("Verification code")).toBeInTheDocument()
    expect(screen.getByRole("radiogroup", { name: "Access level" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Budget range" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Launch time" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Launch window" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Launch date" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Launch window range" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Release notes" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Launch comment" })).toBeInTheDocument()
    expect(screen.getByText("brief.pdf")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Framework" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Team note" })).toBeInTheDocument()
  })
})
