import { metadata, sectionIds } from "@shared/data"
import type { SectionID } from "@shared/types"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { Dnd } from "./dnd"
import { CardWrapper } from "./card"
import { currentSectionIDAtom } from "~/atoms"

export function Section({ id }: { id: SectionID }) {
  const setCurrentSectionID = useSetAtom(currentSectionIDAtom)
  useEffect(() => {
    setCurrentSectionID(id)
  }, [id, setCurrentSectionID])

  return (
    <div className="flex flex-col justify-center items-center">
      <section className="flex gap-2 py-4 sm:mt--12">
        {sectionIds.map(section => (
          <Link
            key={section}
            to="/s/$section"
            params={{ section }}
            className={clsx(
              "btn-action-sm",
              id === section && "btn-action-active",
            )}
          >
            {metadata[section].name}
          </Link>
        ))}
      </section>

      <div
        className="grid w-full gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        {id === "focus"
          ? <Dnd />
          : (
              <>
                {
                  metadata[id].sourceList.map(source => (
                    <CardWrapper key={source} id={source} />
                  ))
                }
              </>
            )}
      </div>
    </div>
  )
}
