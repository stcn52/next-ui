import { motion, AnimatePresence, type Variants } from "motion/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

type AnimatedCardProps = {
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AnimatedCard({ title, description, children, footer, className }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </motion.div>
  )
}

type FadeInProps = {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered list container
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

// AnimatePresence wrapper for list transitions
export function AnimatedList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <AnimatePresence mode="popLayout">
      <div className={className}>{children}</div>
    </AnimatePresence>
  )
}

export function AnimatedListItem({
  children,
  layoutId,
  className,
}: {
  children: React.ReactNode
  layoutId?: string
  className?: string
}) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale-on-tap wrapper
export function ScaleTap({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
