import type { ColumnID } from "@shared/types"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { useTitle } from "react-use"
import { metadata } from "@shared/metadata"
import { NavBar } from "../navbar"
import { Dnd } from "./dnd"
import { currentColumnIDAtom } from "~/atoms"

export function Column({ id }: { id: ColumnID }) {
  const [currentColumnID, setCurrentColumnID] = useAtom(currentColumnIDAtom)
  useEffect(() => {
    setCurrentColumnID(id)
  }, [id, setCurrentColumnID])

  useTitle(`NewsNow | ${metadata[id].name}`)
  if (id === currentColumnID) {
    return (
      <>
        <div className="flex justify-center md:hidden">
          <NavBar />
        </div>
        <div className="mt-10">
          <Dnd />
        </div>
      </>
    )
  }
}
