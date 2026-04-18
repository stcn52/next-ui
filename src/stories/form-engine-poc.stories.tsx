import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { format } from "date-fns"
import { SchemaForm, SchemaPlayground, createFieldWidgetRegistry, defineFieldWidget } from "@/components/form-engine"
import type { FieldWidgetRegistry, FormSchema } from "@/components/form-engine"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/inputs/input-otp"
import { ColorPicker } from "@/components/ui/color-picker"
import { MultiSelect } from "@/components/ui/inputs/multi-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/inputs/radio-group"
import { RangeSlider } from "@/components/ui/inputs/range-slider"
import { NumberInput } from "@/components/ui/inputs/number-input"
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

const meta: Meta = {
  title: "Patterns/Form Engine",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

const workspaceIntakeSchema: FormSchema = {
  id: "workspace-intake",
  title: "Workspace Intake",
  description: "Schema-driven form with TanStack Form, derived values, field links, repeatable groups, and conditional fields.",
  submitLabel: "Provision workspace",
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
      description: "Core workspace details.",
      fields: [
        {
          type: "input",
          name: "workspaceName",
          label: "Workspace name",
          placeholder: "Acme Design System",
          helpText: "Shown to your team and in the sidebar.",
          validate: [
            { op: "required", message: "Workspace name is required" },
            { op: "minLength", value: 3, message: "At least 3 characters" },
          ],
        },
        {
          type: "select",
          name: "workspaceType",
          label: "Workspace type",
          placeholder: "Choose a type",
          options: [
            { label: "Personal", value: "personal" },
            { label: "Team", value: "team" },
            { label: "Enterprise", value: "enterprise" },
          ],
          validate: [{ op: "required", message: "Choose one type" }],
        },
        {
          type: "input",
          name: "workspaceSlug",
          label: "Workspace slug",
          placeholder: "acme-design-system",
          description: "Derived automatically from the workspace name.",
          props: { readOnly: true },
        },
      ],
    },
    {
      title: "Business details",
      fields: [
        {
          type: "input",
          name: "companyName",
          label: "Company name",
          placeholder: "Acme Inc.",
          visibleWhen: { op: "in", path: "workspaceType", value: ["team", "enterprise"] },
          validate: [{ op: "required", message: "Company name is required" }],
        },
        {
          type: "input",
          name: "teamSize",
          label: "Team size",
          inputType: "number",
          placeholder: "12",
          visibleWhen: { op: "eq", path: "workspaceType", value: "enterprise" },
          validate: [{ op: "min", value: 1, message: "At least 1 member" }],
        },
        {
          type: "switch",
          name: "useBilling",
          label: "Use billing contact",
          description: "Reveal extra billing-related fields when enabled.",
        },
        {
          type: "input",
          name: "billingEmail",
          label: "Billing email",
          inputType: "email",
          placeholder: "billing@acme.com",
          visibleWhen: { op: "eq", path: "useBilling", value: true },
          validate: [
            { op: "required", message: "Billing email is required" },
            { op: "pattern", value: "^\\S+@\\S+\\.\\S+$", message: "Enter a valid email" },
          ],
        },
      ],
    },
    {
      title: "Team members",
      description: "A repeatable group that grows and shrinks with the roster.",
      fields: [
        {
          type: "group",
          name: "teamMembers",
          label: "Team members",
          description: "Add collaborators, then remove them as the team evolves.",
          repeatable: true,
          minItems: 1,
          maxItems: 4,
          fields: [
            {
              type: "input",
              name: "name",
              label: "Member name",
              placeholder: "Chen Yu",
              validate: [{ op: "required", message: "Member name is required" }],
            },
            {
              type: "select",
              name: "role",
              label: "Role",
              options: [
                { label: "Owner", value: "owner" },
                { label: "Editor", value: "editor" },
                { label: "Viewer", value: "viewer" },
              ],
            },
            {
              type: "input",
              name: "email",
              label: "Email",
              inputType: "email",
              placeholder: "chen@acme.com",
            },
          ],
        },
      ],
    },
  ],
}

const policyDrivenSchema: FormSchema = {
  id: "policy-driven-intake",
  title: "Policy-Driven Intake",
  description: "Highlights requiredWhen, validateWhen, disabledWhen, derived values, and copy/set/clear links.",
  submitLabel: "Save policy",
  derived: [
    {
      op: "derive",
      path: "contactSlug",
      from: ["contactName"],
      expr:
        'contactName ? contactName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : ""',
    },
  ],
  links: [
    {
      watch: ["contactName"],
      target: "primaryContact",
      when: { op: "empty", path: "primaryContact" },
      effect: { op: "copy", from: "contactName" },
    },
    {
      watch: ["accountType"],
      target: "serviceTier",
      when: { op: "eq", path: "accountType", value: "enterprise" },
      effect: { op: "set", value: "priority" },
    },
    {
      watch: ["receiveAlerts"],
      target: "backupEmail",
      when: { op: "eq", path: "receiveAlerts", value: false },
      effect: { op: "clear" },
    },
  ],
  sections: [
    {
      title: "Policy",
      description: "A realistic mix of conditional visibility and validation rules.",
      fields: [
        {
          type: "select",
          name: "accountType",
          label: "Account type",
          placeholder: "Choose one",
          options: [
            { label: "Personal", value: "personal" },
            { label: "Team", value: "team" },
            { label: "Enterprise", value: "enterprise" },
          ],
          validate: [{ op: "required", message: "Choose an account type" }],
        },
        {
          type: "input",
          name: "contactName",
          label: "Contact name",
          placeholder: "Ada Lovelace",
          validate: [{ op: "required", message: "Contact name is required" }],
        },
        {
          type: "input",
          name: "primaryContact",
          label: "Primary contact",
          placeholder: "Ada Lovelace",
          description: "Auto-filled from Contact name until the user changes it.",
        },
        {
          type: "input",
          name: "contactSlug",
          label: "Contact slug",
          placeholder: "ada-lovelace",
          description: "Derived from Contact name.",
          props: { readOnly: true },
        },
        {
          type: "select",
          name: "serviceTier",
          label: "Service tier",
          options: [
            { label: "Standard", value: "standard" },
            { label: "Priority", value: "priority" },
          ],
          description: "Set automatically for enterprise accounts.",
          props: { className: "max-w-sm" },
        },
        {
          type: "switch",
          name: "receiveAlerts",
          label: "Receive alerts",
          description: "Turning this off clears backup email.",
        },
        {
          type: "input",
          name: "alertEmail",
          label: "Alert email",
          inputType: "email",
          placeholder: "ops@example.com",
          visibleWhen: { op: "eq", path: "receiveAlerts", value: true },
          validateWhen: { op: "eq", path: "receiveAlerts", value: true },
          validate: [
            { op: "required", message: "Alert email is required" },
            { op: "pattern", value: "^\\S+@\\S+\\.\\S+$", message: "Enter a valid email" },
          ],
        },
        {
          type: "input",
          name: "backupEmail",
          label: "Backup email",
          inputType: "email",
          placeholder: "backup@example.com",
          disabledWhen: { op: "eq", path: "receiveAlerts", value: false },
          helpText: "Disabled when alerts are off.",
        },
        {
          type: "input",
          name: "taxId",
          label: "Tax ID",
          placeholder: "12-3456789",
          visibleWhen: { op: "eq", path: "accountType", value: "enterprise" },
          requiredWhen: { op: "eq", path: "accountType", value: "enterprise" },
          validateWhen: { op: "eq", path: "accountType", value: "enterprise" },
          validate: [
            { op: "required", message: "Tax ID is required for enterprise accounts" },
            { op: "pattern", value: "^\\d{2}-\\d{7}$", message: "Use the 12-3456789 format" },
          ],
        },
      ],
    },
  ],
}

const rosterBuilderSchema: FormSchema = {
  id: "roster-builder",
  title: "Roster Builder",
  description: "Exercises repeatable groups, nested groups, and conditional sections for larger dynamic forms.",
  submitLabel: "Save roster",
  links: [
    {
      watch: ["teamName"],
      target: "projectCode",
      when: { op: "empty", path: "projectCode" },
      effect: { op: "copy", from: "teamName" },
    },
  ],
  sections: [
    {
      title: "Team overview",
      fields: [
        {
          type: "input",
          name: "teamName",
          label: "Team name",
          placeholder: "Platform",
          validate: [{ op: "required", message: "Team name is required" }],
        },
        {
          type: "switch",
          name: "hasContractors",
          label: "Include contractors",
          description: "Reveals the contractor section below.",
        },
        {
          type: "input",
          name: "projectCode",
          label: "Project code",
          placeholder: "platform",
          description: "Auto-copied from team name until edited.",
        },
        {
          type: "group",
          name: "members",
          label: "Core members",
          description: "A repeatable group with nested profile data.",
          repeatable: true,
          minItems: 1,
          maxItems: 4,
          fields: [
            {
              type: "input",
              name: "name",
              label: "Name",
              validate: [{ op: "required", message: "Member name is required" }],
            },
            {
              type: "select",
              name: "role",
              label: "Role",
              options: [
                { label: "Owner", value: "owner" },
                { label: "Editor", value: "editor" },
                { label: "Viewer", value: "viewer" },
              ],
            },
            {
              type: "group",
              name: "profile",
              label: "Profile",
              fields: [
                {
                  type: "input",
                  name: "email",
                  label: "Email",
                  inputType: "email",
                  placeholder: "name@example.com",
                },
                {
                  type: "input",
                  name: "github",
                  label: "GitHub",
                  placeholder: "chenyu",
                },
              ],
            },
          ],
        },
        {
          type: "group",
          name: "contractors",
          label: "Contractors",
          description: "Only visible when contractors are enabled.",
          repeatable: true,
          minItems: 0,
          maxItems: 3,
          visibleWhen: { op: "eq", path: "hasContractors", value: true },
          fields: [
            {
              type: "input",
              name: "vendor",
              label: "Vendor",
              validate: [{ op: "required", message: "Vendor is required" }],
            },
            {
              type: "input",
              name: "startDate",
              label: "Start date",
              placeholder: "2026-04-01",
            },
          ],
        },
      ],
    },
  ],
}

const numberInputWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => (
  <NumberInput
    {...fieldProps}
    value={typeof fieldApi.state.value === "number" ? fieldApi.state.value : undefined}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
    {...(schema.widgetProps as Record<string, unknown> | undefined)}
  />
))

const colorPickerWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => (
  <ColorPicker
    fieldProps={fieldProps}
    value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
    {...(schema.widgetProps as Record<string, unknown> | undefined)}
  />
))

const multiSelectWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => (
  <MultiSelect
    fieldProps={fieldProps}
    value={Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as string[]) : []}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
    {...(schema.widgetProps as Record<string, unknown> | undefined)}
  />
))

const tagInputWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => (
  <TagInput
    fieldProps={fieldProps}
    value={Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as string[]) : []}
    disabled={disabled}
    onChange={(next) => fieldApi.handleChange(next)}
    {...(schema.widgetProps as Record<string, unknown> | undefined)}
  />
))

const otpWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const length = typeof widgetProps.length === "number" ? widgetProps.length : 6
  const numericOnly = widgetProps.numericOnly !== false
  const mask = Boolean(widgetProps.mask)
  const leftLength = Math.ceil(length / 2)
  const rightLength = Math.max(0, length - leftLength)

  return (
    <InputOTP
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      length={length}
      numericOnly={numericOnly}
      mask={mask}
      onChange={(next) => fieldApi.handleChange(next)}
    >
      <InputOTPGroup>
        {Array.from({ length: leftLength }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
      {rightLength > 0 ? <InputOTPSeparator /> : null}
      {rightLength > 0 ? (
        <InputOTPGroup>
          {Array.from({ length: rightLength }, (_, index) => {
            const actualIndex = index + leftLength
            return <InputOTPSlot key={actualIndex} index={actualIndex} />
          })}
        </InputOTPGroup>
      ) : null}
    </InputOTP>
  )
})

const radioGroupWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const options = Array.isArray(widgetProps.options) ? widgetProps.options as Array<{ label: string; value: string }> : []

  return (
    <RadioGroup
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      onValueChange={(next) => fieldApi.handleChange(next)}
      className="gap-3"
    >
      {options.map((option) => {
        const id = `${schema.name}-${option.value}`
        return (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={id} />
            <Label htmlFor={id}>{option.label}</Label>
          </div>
        )
      })}
    </RadioGroup>
  )
})

const rangeSliderWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const min = typeof widgetProps.min === "number" ? widgetProps.min : 0
  const max = typeof widgetProps.max === "number" ? widgetProps.max : 100
  const step = typeof widgetProps.step === "number" ? widgetProps.step : 1

  return (
    <RangeSlider
      fieldProps={fieldProps}
      value={
        Array.isArray(fieldApi.state.value) && fieldApi.state.value.length >= 2
          ? [Number(fieldApi.state.value[0]), Number(fieldApi.state.value[1])]
          : undefined
      }
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const timePickerWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const value = typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined

  return (
    <TimePicker
      fieldProps={fieldProps}
      value={value}
      disabled={disabled}
      hourCycle={typeof widgetProps.hourCycle === "number" ? (widgetProps.hourCycle as 12 | 24) : 24}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const dateTimePickerWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
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
        hourCycle={typeof widgetProps.hourCycle === "number" ? (widgetProps.hourCycle as 12 | 24) : 24}
        placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
        onChange={(next) => fieldApi.handleChange(format(next, "yyyy-MM-dd'T'HH:mm:ss"))}
      />
    )
  })

const datePickerWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
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
        className={typeof widgetProps.className === "string" ? widgetProps.className : undefined}
        placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
        onDateChange={(next) => fieldApi.handleChange(next ? format(next, "yyyy-MM-dd") : "")}
      />
    )
  })

const dateRangePickerWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
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
      numberOfMonths={typeof widgetProps.numberOfMonths === "number" ? widgetProps.numberOfMonths : 2}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
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
})

const richTextEditorWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>

  return (
    <RichTextEditor
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      minRows={typeof widgetProps.minRows === "number" ? widgetProps.minRows : undefined}
      maxRows={typeof widgetProps.maxRows === "number" ? widgetProps.maxRows : undefined}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const commentEditorWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const mentionUsers = Array.isArray(widgetProps.mentionUsers) ? widgetProps.mentionUsers : []

  return (
    <CommentEditor
      fieldProps={fieldProps}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      disabled={disabled}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      maxLength={typeof widgetProps.maxLength === "number" ? widgetProps.maxLength : undefined}
      mentionUsers={mentionUsers as Array<{ id: string; name: string; username: string; avatar?: string }>}
      submitLabel={typeof widgetProps.submitLabel === "string" ? widgetProps.submitLabel : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const fileUploadWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const items = Array.isArray(fieldApi.state.value) ? (fieldApi.state.value as FileUploadItem[]) : []

  return (
    <FileUpload
      fieldProps={fieldProps}
      disabled={disabled}
      accept={typeof widgetProps.accept === "string" ? widgetProps.accept : undefined}
      multiple={widgetProps.multiple !== false}
      maxSize={typeof widgetProps.maxSize === "number" ? widgetProps.maxSize : undefined}
      maxFiles={typeof widgetProps.maxFiles === "number" ? widgetProps.maxFiles : undefined}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      description={typeof widgetProps.description === "string" ? widgetProps.description : undefined}
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
})

const comboboxWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const options = Array.isArray(widgetProps.options) ? (widgetProps.options as Array<{ label: string; value: string; disabled?: boolean }>) : []

  return (
    <Combobox
      fieldProps={fieldProps}
      disabled={disabled}
      options={options}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      searchPlaceholder={typeof widgetProps.searchPlaceholder === "string" ? widgetProps.searchPlaceholder : undefined}
      emptyMessage={typeof widgetProps.emptyMessage === "string" ? widgetProps.emptyMessage : undefined}
      className={typeof widgetProps.className === "string" ? widgetProps.className : undefined}
      onValueChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const chatSenderWidget = defineFieldWidget(({ fieldApi, schema, disabled, fieldProps }) => {
  const widgetProps = (schema.widgetProps ?? {}) as Record<string, unknown>
  const suggestions = Array.isArray(widgetProps.suggestions) ? (widgetProps.suggestions as string[]) : undefined
  const mentions = Array.isArray(widgetProps.mentions) ? (widgetProps.mentions as Array<{ key: string; label: string; description?: string }>) : undefined

  return (
    <ChatSender
      fieldProps={fieldProps}
      disabled={disabled}
      value={typeof fieldApi.state.value === "string" ? fieldApi.state.value : undefined}
      placeholder={typeof widgetProps.placeholder === "string" ? widgetProps.placeholder : undefined}
      loading={Boolean(widgetProps.loading)}
      allowAttachment={widgetProps.allowAttachment === true}
      suggestions={suggestions}
      mentions={mentions}
      density={typeof widgetProps.density === "string" ? widgetProps.density as "default" | "compact" | "dense" : "default"}
      suggestionsVariant={typeof widgetProps.suggestionsVariant === "string" ? widgetProps.suggestionsVariant as "inline" | "overlay" : "overlay"}
      attachmentLayout={typeof widgetProps.attachmentLayout === "string" ? widgetProps.attachmentLayout as "scroll" | "wrap" : "scroll"}
      attachmentDisplay={typeof widgetProps.attachmentDisplay === "string" ? widgetProps.attachmentDisplay as "preview" | "summary" : "summary"}
      footerText={typeof widgetProps.footerText === "string" ? widgetProps.footerText : undefined}
      maxRows={typeof widgetProps.maxRows === "number" ? widgetProps.maxRows : undefined}
      onChange={(next) => fieldApi.handleChange(next)}
    />
  )
})

const projectWidgets = createFieldWidgetRegistry({
  "number-input": numberInputWidget,
  "color-picker": colorPickerWidget,
  "multi-select": multiSelectWidget,
  "tag-input": tagInputWidget,
  "otp-input": otpWidget,
  "radio-group": radioGroupWidget,
  "range-slider": rangeSliderWidget,
  "time-picker": timePickerWidget,
  "date-time-picker": dateTimePickerWidget,
  "date-picker": datePickerWidget,
  "date-range-picker": dateRangePickerWidget,
  "rich-text-editor": richTextEditorWidget,
  "comment-editor": commentEditorWidget,
  "file-upload": fileUploadWidget,
  "combobox": comboboxWidget,
  "chat-sender": chatSenderWidget,
})

const projectComponentsSchema: FormSchema = {
  id: "project-components",
  title: "Project Components",
  description: "Shows how form-engine can host project-owned inputs through a widget registry.",
  submitLabel: "Save project settings",
  sections: [
    {
      title: "Branding",
      fields: [
        {
          type: "input",
          name: "monthlyBudget",
          label: "Monthly budget",
          widget: "number-input",
          widgetProps: { prefix: "$", step: 50 },
          defaultValue: 500,
        },
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
          widgetProps: {
            placeholder: "Choose focus areas",
            options: [
              { label: "Forms", value: "forms" },
              { label: "Tables", value: "tables" },
              { label: "Virtualization", value: "virtualization" },
              { label: "Charts", value: "charts" },
            ],
          },
        },
        {
          type: "input",
          name: "projectTags",
          label: "Project tags",
          widget: "tag-input",
          defaultValue: ["forms", "tanstack"],
          widgetProps: {
            placeholder: "Add a tag and press Enter",
          },
        },
        {
          type: "input",
          name: "verificationCode",
          label: "Verification code",
          widget: "otp-input",
          defaultValue: "123456",
          widgetProps: {
            length: 6,
            numericOnly: true,
          },
        },
        {
          type: "input",
          name: "accessLevel",
          label: "Access level",
          widget: "radio-group",
          defaultValue: "editor",
          widgetProps: {
            options: [
              { label: "Owner", value: "owner" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ],
          },
        },
        {
          type: "input",
          name: "budgetRange",
          label: "Budget range",
          widget: "range-slider",
          defaultValue: [1000, 5000],
          widgetProps: {
            min: 0,
            max: 10000,
            step: 500,
          },
        },
        {
          type: "input",
          name: "launchTime",
          label: "Launch time",
          widget: "time-picker",
          defaultValue: "09:30",
          widgetProps: {
            hourCycle: 12,
            placeholder: "Choose launch time",
          },
        },
        {
          type: "input",
          name: "launchAt",
          label: "Launch window",
          widget: "date-time-picker",
          defaultValue: "2024-12-08T14:30:00",
          widgetProps: {
            hourCycle: 24,
            placeholder: "Choose launch window",
          },
        },
        {
          type: "input",
          name: "launchDate",
          label: "Launch date",
          widget: "date-picker",
          defaultValue: "2024-12-08",
          widgetProps: {
            placeholder: "Choose launch date",
            className: "w-[280px]",
          },
        },
        {
          type: "textarea",
          name: "releaseNotes",
          label: "Release notes",
          widget: "rich-text-editor",
          defaultValue: "## Launch checklist\n- QA\n- Docs\n- Release",
          widgetProps: {
            minRows: 5,
            maxRows: 10,
            placeholder: "Write launch notes",
          },
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
          widgetProps: {
            numberOfMonths: 2,
            placeholder: "Choose launch window range",
          },
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

const schemas = {
  workspace: workspaceIntakeSchema,
  policy: policyDrivenSchema,
  roster: rosterBuilderSchema,
  project: projectComponentsSchema,
} as const

function StoryFrame({
  schema,
  showInspector = false,
  widgets,
}: {
  schema: FormSchema
  showInspector?: boolean
  widgets?: FieldWidgetRegistry
}) {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <SchemaForm
        schema={schema}
        showInspector={showInspector}
        widgets={widgets}
        onSubmit={(values) => setSubmitted(values as Record<string, unknown>)}
      />

      <div className="rounded-lg border bg-muted/30 p-4 text-sm">
        <div className="mb-2 font-medium">Submitted payload</div>
        <pre className="overflow-auto text-xs leading-relaxed">
          {submitted ? JSON.stringify(submitted, null, 2) : "No submission yet."}
        </pre>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <StoryFrame schema={schemas.workspace} showInspector />,
}

export const PolicyDriven: Story = {
  render: () => <StoryFrame schema={schemas.policy} showInspector />,
}

export const RosterBuilder: Story = {
  render: () => <StoryFrame schema={schemas.roster} showInspector />,
}

export const ProjectComponents: Story = {
  render: () => <StoryFrame schema={schemas.project} showInspector widgets={projectWidgets} />,
}

export const JsonPlayground: Story = {
  render: () => <SchemaPlayground schema={schemas.project} showInspector widgets={projectWidgets} />,
}
