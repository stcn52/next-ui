import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import { X } from "lucide-react"

const meta: Meta = {
  title: "Patterns/Shared Layout Transition",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

type CardItem = {
  id: number
  title: string
  description: string
  color: string
  detail: string
}

const items: CardItem[] = [
  {
    id: 1,
    title: "Design System",
    description: "Component library with Tailwind CSS",
    color: "bg-blue-500/10 border-blue-500/20",
    detail:
      "A comprehensive design system built with React, Tailwind CSS v4, and shadcn/ui. Includes 40+ components with full Storybook documentation, dark mode, and customizable theming.",
  },
  {
    id: 2,
    title: "Data Visualization",
    description: "Charts and interactive dashboards",
    color: "bg-green-500/10 border-green-500/20",
    detail:
      "Real-time data visualization with D3.js and React. Features interactive charts, drag-to-zoom, streaming data support, and responsive layouts for all screen sizes.",
  },
  {
    id: 3,
    title: "AI Integration",
    description: "Machine learning workflow engine",
    color: "bg-purple-500/10 border-purple-500/20",
    detail:
      "End-to-end ML pipeline with model training, evaluation, and deployment. Supports LLM fine-tuning, RAG systems, and real-time inference with edge deployment.",
  },
  {
    id: 4,
    title: "DevOps Pipeline",
    description: "CI/CD automation platform",
    color: "bg-orange-500/10 border-orange-500/20",
    detail:
      "Automated CI/CD pipelines with GitHub Actions, Docker containerization, Kubernetes orchestration, and progressive rollouts with automated canary analysis.",
  },
]

function SharedLayoutDemo() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedItem = items.find((i) => i.id === selectedId)

  return (
    <LayoutGroup>
      <div className="relative max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className={`cursor-pointer rounded-xl border p-4 ${item.color} transition-shadow hover:shadow-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.h3
                layoutId={`title-${item.id}`}
                className="text-sm font-semibold"
              >
                {item.title}
              </motion.h3>
              <motion.p
                layoutId={`desc-${item.id}`}
                className="mt-1 text-xs text-muted-foreground"
              >
                {item.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedItem && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setSelectedId(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  layoutId={`card-${selectedItem.id}`}
                  className={`relative w-full max-w-md rounded-xl border p-6 bg-card shadow-xl ${selectedItem.color}`}
                >
                  <button
                    className="absolute right-3 top-3 rounded-full p-1 hover:bg-muted"
                    onClick={() => setSelectedId(null)}
                  >
                    <X className="size-4" />
                  </button>
                  <motion.h3
                    layoutId={`title-${selectedItem.id}`}
                    className="text-lg font-semibold"
                  >
                    {selectedItem.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`desc-${selectedItem.id}`}
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {selectedItem.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <p className="text-sm leading-relaxed">
                      {selectedItem.detail}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

export const Default: Story = {
  name: "Card → Modal Fly-in",
  render: () => <SharedLayoutDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Design System")).toBeInTheDocument()
  },
}
