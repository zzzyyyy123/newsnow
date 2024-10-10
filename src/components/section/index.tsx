import { metadata, sectionIds } from "@shared/data"
import type { SectionID } from "@shared/types"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { Dnd } from "./dnd"
import { currentSectionIDAtom } from "~/atoms"

export function Section({ id }: { id: SectionID }) {
  const [currentSectionID, setCurrentSectionID] = useAtom(currentSectionIDAtom)
  useEffect(() => {
    setCurrentSectionID(id)
  }, [id, setCurrentSectionID])

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="flex gap-2 mb-6">
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
        </div>
      </div>
      { currentSectionID === id && <Dnd />}
    </>
  )
}
