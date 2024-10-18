import type { ColumnID } from "@shared/types"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { Dnd } from "./dnd"
import { NavBar } from "./navbar"
import { currentColumnIDAtom } from "~/atoms"

export function Column({ id }: { id: ColumnID }) {
  const [currentColumnID, setCurrentColumnID] = useAtom(currentColumnIDAtom)
  useEffect(() => {
    setCurrentColumnID(id)
  }, [id, setCurrentColumnID])
  return (
    <>
      <NavBar id={id} />
      { currentColumnID === id && <Dnd />}
    </>
  )
}
