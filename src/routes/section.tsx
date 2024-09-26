import { createFileRoute } from "@tanstack/react-router"
import type { SectionId } from "~/atoms/news"
import { NavBar } from "~/components/NavBar"

export const Route = createFileRoute("/section")({
  validateSearch: (search: any) => ({
    n: search.n as SectionId,
  }),
  component: Section,
})

export function Section() {
  return (
    <div className="p-10">
      <NavBar />
    </div>
  )
}
