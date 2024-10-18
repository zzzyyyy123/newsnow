import { columnIds, metadata } from "@shared/metadata"
import type { ColumnID } from "@shared/types"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { useTitle } from "react-use"

export function NavBar({ id }: { id: ColumnID }) {
  useTitle(`NewsNow | ${metadata[id].name}`)
  return (
    <div className="w-full flex justify-center">
      <span className={clsx([
        "flex mb-4 p-3 rounded-2xl bg-primary/1",
        "shadow shadow-primary/20 hover:shadow-primary/50 transition-shadow-500",
        "md:(z-100 mb-6)",
      ])}
      >
        {columnIds.map(columnId => (
          <Link
            key={columnId}
            to="/c/$column"
            params={{ column: columnId }}
            className={clsx(
              "text-sm px-2",
              id === columnId ? "color-primary font-bold" : "op-70 dark:op-90 hover:(bg-primary/15 rounded-md)",
            )}
          >
            {metadata[columnId].name}
          </Link>
        ))}
      </span>
    </div>
  )
}
