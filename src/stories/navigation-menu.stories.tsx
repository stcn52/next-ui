import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "UI/NavigationMenu",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

function ListItem({
  className,
  title,
  children,
  href,
}: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
}) {
  return (
    <li>
      <NavigationMenuLink
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  )
}

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink
                  href="/"
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                >
                  <div className="mb-2 mt-4 text-lg font-medium">
                    @chenyang/ui
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Accessible component library built with shadcn/ui v3 + Base
                    UI.
                  </p>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs/introduction" title="Introduction">
                Overview and principles of the component library.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install and configure the library.
              </ListItem>
              <ListItem href="/docs/theming" title="Theming">
                Customize colors, fonts, and spacing.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {[
                { title: "Button", desc: "Clickable primary action element." },
                { title: "Card", desc: "Container with header, body, footer." },
                { title: "Dialog", desc: "Modal dialog overlay." },
                { title: "DataTable", desc: "Sortable, filterable data grid." },
                { title: "Kanban", desc: "Cross-column drag-and-drop board." },
                { title: "Combobox", desc: "Searchable dropdown selection." },
              ].map(({ title, desc }) => (
                <ListItem key={title} title={title} href={`/docs/${title.toLowerCase()}`}>
                  {desc}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Getting Started")).toBeInTheDocument()
    await expect(canvas.getByText("Components")).toBeInTheDocument()
    await expect(canvas.getByText("Documentation")).toBeInTheDocument()
  },
}
