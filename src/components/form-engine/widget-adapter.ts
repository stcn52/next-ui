"use client"

import type { AnyFieldApi } from "@tanstack/react-form"
import type { ReactNode } from "react"

export type FieldControlProps = {
  id: string
  name: string
  "aria-labelledby": string
  "aria-describedby"?: string
  "aria-invalid": boolean
  "aria-required"?: boolean
  onBlur: () => void
}

export type FieldWidgetRenderProps<
  TSchema = unknown,
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = {
  fieldApi: AnyFieldApi
  schema: TSchema
  disabled: boolean
  values: TValues
  fieldProps: FieldControlProps
}

export type FieldWidgetRenderer<
  TSchema = unknown,
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = (props: FieldWidgetRenderProps<TSchema, TValues>) => ReactNode

export type FieldWidgetRegistry<
  TSchema = unknown,
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = Record<string, FieldWidgetRenderer<TSchema, TValues>>

export function createFieldWidgetRegistry<
  TSchema = unknown,
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(registry: FieldWidgetRegistry<TSchema, TValues>) {
  return registry
}

export function defineFieldWidget<
  TSchema = unknown,
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(renderer: FieldWidgetRenderer<TSchema, TValues>) {
  return renderer
}
