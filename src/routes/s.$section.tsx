import { createFileRoute, redirect } from "@tanstack/react-router"
import { sectionIds } from "@shared/data"
import { Section } from "~/components/section"

export const Route = createFileRoute("/s/$section")({
  component: SectionComponent,
  params: {
    parse: (params) => {
      const section = sectionIds.find(x => x === params.section.toLowerCase())
      if (!section)
        throw new Error(`"${params.section}" is not a valid section.`)
      return {
        section,
      }
    },
    stringify: params => params,
  },
  onError: (error) => {
    if (error?.routerCode === "PARSE_PARAMS") {
      throw redirect({ to: "/" })
    }
  },
})

function SectionComponent() {
  const { section } = Route.useParams()
  return <Section id={section} />
}
