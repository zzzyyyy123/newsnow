import { metadata, sectionIds } from "@shared/data"
import type { SectionID } from "@shared/types"
import { Link, createFileRoute } from "@tanstack/react-router"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo } from "react"
import { currentSectionIDAtom, focusSourcesAtom } from "~/atoms"
import { Dnd } from "~/components/section/Dnd"
import { Pure } from "~/components/section/Pure"

export const Route = createFileRoute("/")({
  validateSearch: (search: any) => ({
    section: (search.section as SectionID),
  }),
  component: IndexComponent,
})

function IndexComponent() {
  const { section } = Route.useSearch()
  const focusSources = useAtomValue(focusSourcesAtom)
  const nav = Route.useNavigate()
  const [currentSectionID, setCurrentSectionID] = useAtom(currentSectionIDAtom)
  const id = useMemo(() => {
    if (sectionIds.includes(section)) return section
    else return focusSources.length ? "focus" : "social"
  }, [section, focusSources])

  useEffect(() => {
    setCurrentSectionID(id)
    nav({
      to: "/",
      search: { section: id },
      replace: true,
    })
  }, [setCurrentSectionID, id, nav])

  return currentSectionID === id && (
    <div className="flex flex-col justify-center items-center">
      <section className="flex gap-2 py-4">
        {sectionIds.map(section => (
          <Link
            key={section}
            to="/"
            search={{ section }}
            className={clsx("btn-action-sm", id === section && "btn-action-active")}
          >
            {metadata[section].name}
          </Link>
        ))}
      </section>
      {
        id === "focus" ? <Dnd /> : <Pure />
      }
    </div>
  )
}
