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
        <span className={clsx([
          "flex gap-2 mb-4 py-3 px-6 rounded-2xl bg-primary/1 shadow shadow-red/20 hover:shadow-red/50 transition-shadow duration-500",
          "md:(z-100 mb-6)",
        ])}
        >
          {sectionIds.map(section => (
            <Link
              key={section}
              to="/s/$section"
              params={{ section }}
              className={clsx(
                "text-sm",
                id === section ? "color-primary font-bold" : "op-70 dark:op-90",
              )}
            >
              {metadata[section].name}
            </Link>
          ))}
        </span>
      </div>
      { currentSectionID === id && <Dnd />}
    </>
  )
}
