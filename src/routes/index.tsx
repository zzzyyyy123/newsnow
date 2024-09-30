import { metadata, sectionIds } from "@shared/data"
import type { SectionID } from "@shared/types"
import { Link, createFileRoute } from "@tanstack/react-router"
import clsx from "clsx"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { currentSectionAtom } from "~/atoms"
import { Main as DndMain } from "~/components/Dnd"
import { Main as PureMain } from "~/components/Pure"

export const Route = createFileRoute("/")({
  validateSearch: (search: any) => ({
    section: (search.section as SectionID),
  }),
  component: IndexComponent,
})

function IndexComponent() {
  const { section: id = "focus" } = Route.useSearch()
  const setCurrentSectionAtom = useSetAtom(currentSectionAtom)
  useEffect(() => {
    setCurrentSectionAtom(id)
  }, [setCurrentSectionAtom, id])

  return id && (
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
        id === "focus" ? <DndMain /> : <PureMain />
      }
    </div>
  )
}
