import { columnIds, metadata } from "@shared/metadata"
import type { ColumnID } from "@shared/types"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { useTitle } from "react-use"
import { Dnd } from "./dnd"
import { currentColumnIDAtom } from "~/atoms"

export function Column({ id }: { id: ColumnID }) {
  const [currentColumnID, setCurrentColumnID] = useAtom(currentColumnIDAtom)
  useEffect(() => {
    setCurrentColumnID(id)
  }, [id, setCurrentColumnID])
  useTitle(`NewsNow | ${metadata[id].name}`)
  return (
    <>
      <div className="w-full flex justify-center">
        <span className={clsx([
          "flex gap-2 mb-4 py-3 px-6 rounded-2xl bg-primary/1 shadow shadow-primary/20 hover:shadow-primary/50 transition-shadow duration-500",
          "md:(z-100 mb-6)",
        ])}
        >
          {columnIds.map(columnId => (
            <Link
              key={columnId}
              to="/c/$column"
              params={{ column: columnId }}
              className={clsx(
                "text-sm",
                id === columnId ? "color-primary font-bold" : "op-70 dark:op-90",
              )}
            >
              {metadata[columnId].name}
            </Link>
          ))}
        </span>
      </div>
      { currentColumnID === id && <Dnd />}
    </>
  )
}
