"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLocale } from "@/components/config-provider"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
}: {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
}) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)

  const resolvedPlaceholder = placeholder ?? locale.selectOption
  const resolvedSearchPlaceholder = searchPlaceholder ?? locale.search
  const resolvedEmptyMessage = emptyMessage ?? locale.noResults
  const selectedLabel = options.find((opt) => opt.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={selectedLabel ? `${selectedLabel} selected` : resolvedPlaceholder}
            className={cn(
              "w-[200px] justify-between font-normal",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        {selectedLabel ?? resolvedPlaceholder}
        <ChevronsUpDownIcon className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={resolvedSearchPlaceholder} />
          <CommandList>
            <CommandEmpty>{resolvedEmptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  data-checked={value === option.value ? true : undefined}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
