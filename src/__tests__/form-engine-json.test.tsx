import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { SchemaPlayground, parseFormSchemaJson, stringifyFormSchemaJson } from "@/components/form-engine"
import type { FormSchema } from "@/components/form-engine"

const schema: FormSchema = {
  id: "json-playground",
  title: "Original",
  sections: [
    {
      fields: [
        {
          type: "input",
          name: "name",
          label: "Name",
        },
      ],
    },
  ],
}

describe("form-engine json helpers", () => {
  it("parses and stringifies form schema json", () => {
    const deepSchema: FormSchema = {
      ...schema,
      derived: [
        {
          op: "derive",
          path: "slug",
          from: ["name"],
          expr: 'name ? name.trim().toLowerCase() : ""',
        },
      ],
      links: [
        {
          watch: ["name"],
          target: "displayName",
          when: { op: "empty", path: "displayName" },
          effect: { op: "copy", from: "name" },
        },
      ],
      sections: [
        {
          fields: [
            {
              type: "input",
              name: "name",
              label: "Name",
            },
            {
              type: "input",
              name: "brandColor",
              label: "Brand color",
              widget: "color-picker",
              widgetProps: {
                showPresets: true,
              },
            },
            {
              type: "input",
              name: "launchTime",
              label: "Launch time",
              widget: "time-picker",
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
              widgetProps: {
                placeholder: "Choose launch date",
              },
            },
            {
              type: "textarea",
              name: "releaseNotes",
              label: "Release notes",
              widget: "rich-text-editor",
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
              widgetProps: {
                placeholder: "Leave a launch comment",
                maxLength: 500,
                submitLabel: "Post comment",
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
                maxSize: 10485760,
                maxFiles: 3,
                placeholder: "Upload launch files",
              },
            },
            {
              type: "input",
              name: "framework",
              label: "Framework",
              widget: "combobox",
              widgetProps: {
                placeholder: "Select framework",
                searchPlaceholder: "Search framework",
                options: [
                  { label: "Next.js", value: "next.js" },
                  { label: "SvelteKit", value: "sveltekit" },
                ],
              },
            },
            {
              type: "textarea",
              name: "teamNote",
              label: "Team note",
              widget: "chat-sender",
              widgetProps: {
                placeholder: "Write a quick team note",
                suggestions: ["Looks good", "Needs a tweak", "Ship it"],
                footerText: "Press Enter to send",
              },
            },
            {
              type: "group",
              name: "members",
              label: "Members",
              repeatable: true,
              fields: [
                {
                  type: "input",
                  name: "email",
                  label: "Email",
                },
              ],
            },
          ],
        },
      ],
    }

    const source = stringifyFormSchemaJson(deepSchema)
    const parsed = parseFormSchemaJson(source)

    expect(parsed.schema?.id).toBe("json-playground")
    expect(parsed.error).toBeUndefined()
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"title": "Original"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"derived"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"links"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "color-picker"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "time-picker"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "date-time-picker"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "date-picker"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "date-range-picker"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "rich-text-editor"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "comment-editor"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "file-upload"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "combobox"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"widget": "chat-sender"')
    expect(stringifyFormSchemaJson(parsed.schema as FormSchema)).toContain('"showPresets": true')
  })

  it("rejects invalid schema json", () => {
    expect(parseFormSchemaJson("{ not json }").error).toBeTruthy()
    expect(parseFormSchemaJson(JSON.stringify({ id: "x" })).error).toBeTruthy()
    expect(
      parseFormSchemaJson(
        JSON.stringify({
          id: "broken",
          sections: [
            {
              fields: [
                {
                  type: "input",
                  name: "name",
                },
              ],
            },
          ],
        }),
      ).error,
    ).toBeTruthy()
    expect(
      parseFormSchemaJson(
        JSON.stringify({
          id: "broken-links",
          sections: [],
          links: [
            {
              watch: ["name"],
              target: "companyName",
              effect: { op: "copy", from: 1 },
            },
          ],
        }),
      ).error,
    ).toBeTruthy()
    expect(
      parseFormSchemaJson(
        JSON.stringify({
          id: "broken-select",
          sections: [
            {
              fields: [
                {
                  type: "select",
                  name: "role",
                  label: "Role",
                  options: [{ label: "Owner", id: "owner" }],
                },
              ],
            },
          ],
        }),
      ).error,
    ).toBeTruthy()
  })
})

describe("SchemaPlayground", () => {
  it("renders a live preview and surfaces parse errors", async () => {
    const user = userEvent.setup()
    render(<SchemaPlayground schema={schema} />)

    expect(screen.getByText("Original")).toBeInTheDocument()
    expect(screen.getByLabelText("Schema JSON editor")).toBeInTheDocument()

    const editor = screen.getByLabelText("Schema JSON editor")
    fireEvent.change(editor, { target: { value: stringifyFormSchemaJson({ ...schema, title: "Edited" }) } })

    expect(screen.getByText("Edited")).toBeInTheDocument()

    await user.clear(editor)
    fireEvent.change(editor, { target: { value: "{ invalid json" } })

    expect(screen.getByRole("alert")).toHaveTextContent("Schema parse error")
  })
})
