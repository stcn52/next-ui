import { describe, expect, it, vi } from "vitest"
import {
  applySchemaLinks,
  analyzeSchemaDependencies,
  createFieldDefaults,
  createFormDefaults,
  evaluateRule,
  getPathValue,
  isEmptyValue,
  validateRule,
} from "@/components/form-engine"

describe("form-engine rule engine", () => {
  it("resolves nested values by path", () => {
    const values = { profile: { firstName: "Chen", team: [{ name: "A" }] } }
    expect(getPathValue(values, "profile.firstName")).toBe("Chen")
    expect(getPathValue(values, "profile.team[0].name")).toBe("A")
  })

  it("evaluates comparison and logical rules", () => {
    const values = { status: "team", count: 3, enabled: true }
    expect(evaluateRule({ op: "eq", path: "status", value: "team" }, { values })).toBe(true)
    expect(evaluateRule({ op: "in", path: "status", value: ["team", "enterprise"] }, { values })).toBe(true)
    expect(
      evaluateRule(
        { op: "and", rules: [{ op: "eq", path: "enabled", value: true }, { op: "gt", path: "count", value: 2 }] },
        { values },
      ),
    ).toBe(true)
  })

  it("validates field rules", () => {
    expect(validateRule({ op: "required" }, "")).toBe("Required")
    expect(validateRule({ op: "minLength", value: 3 }, "ab")).toContain("at least 3")
    expect(validateRule({ op: "pattern", value: "^\\d+$" }, "12")).toBeUndefined()
  })

  it("detects empty values", () => {
    expect(isEmptyValue("")).toBe(true)
    expect(isEmptyValue([])).toBe(true)
    expect(isEmptyValue(12)).toBe(false)
  })

  it("builds default values for nested and repeatable groups", () => {
    const schema = {
      id: "defaults",
      sections: [
        {
          fields: [
            {
              type: "input",
              name: "title",
              label: "Title",
            },
            {
              type: "group",
              name: "team",
              label: "Team",
              repeatable: true,
              minItems: 2,
              fields: [
                { type: "input", name: "name", label: "Name" },
                {
                  type: "group",
                  name: "meta",
                  label: "Meta",
                  fields: [{ type: "checkbox", name: "active", label: "Active" }],
                },
              ],
            },
          ],
        },
      ],
    } as const

    expect(createFieldDefaults(schema.sections[0].fields)).toEqual({
      title: "",
      team: [
        { name: "", meta: { active: false } },
        { name: "", meta: { active: false } },
      ],
    })
    expect(createFormDefaults(schema)).toEqual({
      title: "",
      team: [
        { name: "", meta: { active: false } },
        { name: "", meta: { active: false } },
      ],
    })
  })

  it("analyzes rule and derived dependencies", () => {
    const schema = {
      id: "deps",
      derived: [{ op: "derive", path: "fullName", from: ["firstName", "lastName"], expr: "`${firstName} ${lastName}`" }],
      links: [
        {
          watch: ["workspaceName"],
          target: "companyName",
          when: { op: "empty", path: "companyName" },
          effect: { op: "copy", from: "workspaceName" },
        },
      ],
      sections: [
        {
          fields: [
            {
              type: "input",
              name: "firstName",
              label: "First name",
            },
            {
              type: "group",
              name: "profile",
              label: "Profile",
              visibleWhen: { op: "eq", path: "firstName", value: "Chen" },
              fields: [
                {
                  type: "input",
                  name: "lastName",
                  label: "Last name",
                  disabledWhen: { op: "empty", path: "firstName" },
                },
              ],
            },
          ],
        },
      ],
    } as const

    expect(analyzeSchemaDependencies(schema)).toEqual([
      { path: "firstName", kind: "field", dependsOn: [] },
      {
        path: "profile",
        kind: "group",
        dependsOn: ["firstName"],
        children: [
          {
            path: "profile.lastName",
            kind: "field",
            dependsOn: ["firstName"],
          },
        ],
      },
      {
        path: "fullName",
        kind: "derived",
        dependsOn: ["fullName", "firstName", "lastName"],
      },
      {
        path: "companyName",
        kind: "link",
        dependsOn: ["workspaceName", "companyName"],
      },
    ])
  })

  it("applies field links without overriding manual edits", () => {
    const schema = {
      id: "links",
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
      sections: [],
    } as const

    const form = { setFieldValue: vi.fn() }

    applySchemaLinks(form as never, schema, {
      workspaceName: "Acme",
      companyName: "",
      billingEmail: "billing@acme.com",
      useBilling: false,
    })

    expect(form.setFieldValue).toHaveBeenCalledTimes(2)
    expect(form.setFieldValue).toHaveBeenNthCalledWith(1, "companyName", "Acme")
    expect(form.setFieldValue).toHaveBeenNthCalledWith(2, "billingEmail", undefined)

    form.setFieldValue.mockClear()

    applySchemaLinks(form as never, schema, {
      workspaceName: "Acme Labs",
      companyName: "Manual",
      billingEmail: "",
      useBilling: true,
    })

    expect(form.setFieldValue).not.toHaveBeenCalled()
  })
})
