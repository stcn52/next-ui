import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline"
import { Stepper, Step } from "@/components/ui/stepper"

describe("Timeline", () => {
  it("renders with correct data-slot", () => {
    render(
      <Timeline data-testid="timeline">
        <TimelineItem>
          <TimelineDot />
          <TimelineContent>
            <TimelineTitle>Event 1</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    )
    expect(screen.getByTestId("timeline")).toHaveAttribute("data-slot", "timeline")
    expect(screen.getByText("Event 1").closest("[data-slot='timeline-title']")).toBeInTheDocument()
  })

  it("renders all sub-components", () => {
    render(
      <Timeline>
        <TimelineItem data-testid="item">
          <TimelineConnector data-testid="connector" />
          <TimelineDot data-testid="dot" variant="primary" />
          <TimelineContent data-testid="content">
            <TimelineTitle>Title</TimelineTitle>
            <TimelineDescription>Description</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    )
    expect(screen.getByTestId("item")).toHaveAttribute("data-slot", "timeline-item")
    expect(screen.getByTestId("connector")).toHaveAttribute("data-slot", "timeline-connector")
    expect(screen.getByTestId("dot")).toHaveAttribute("data-slot", "timeline-dot")
    expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "timeline-content")
    expect(screen.getByText("Description")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <Timeline data-testid="tl" className="custom-class">
        <TimelineItem>content</TimelineItem>
      </Timeline>
    )
    expect(screen.getByTestId("tl")).toHaveClass("custom-class")
  })
})

describe("Stepper", () => {
  it("renders steps with correct statuses", () => {
    render(
      <Stepper activeStep={1}>
        <Step label="Step 1" />
        <Step label="Step 2" />
        <Step label="Step 3" />
      </Stepper>
    )
    const steps = screen.getAllByRole("listitem")
    expect(steps).toHaveLength(3)
    expect(steps[0]).toHaveAttribute("data-status", "completed")
    expect(steps[1]).toHaveAttribute("data-status", "active")
    expect(steps[2]).toHaveAttribute("data-status", "upcoming")
  })

  it("renders step labels", () => {
    render(
      <Stepper activeStep={0}>
        <Step label="First" description="Do first thing" />
        <Step label="Second" />
      </Stepper>
    )
    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Do first thing")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("has role=list on container", () => {
    render(
      <Stepper activeStep={0} data-testid="stepper">
        <Step label="A" />
      </Stepper>
    )
    expect(screen.getByTestId("stepper")).toHaveAttribute("role", "list")
  })

  it("all completed when activeStep exceeds length", () => {
    render(
      <Stepper activeStep={3}>
        <Step label="A" />
        <Step label="B" />
      </Stepper>
    )
    const steps = screen.getAllByRole("listitem")
    expect(steps[0]).toHaveAttribute("data-status", "completed")
    expect(steps[1]).toHaveAttribute("data-status", "completed")
  })
})
