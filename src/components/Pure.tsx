import { useAtomValue } from "jotai"
import type { PropsWithChildren } from "react"
import { CardWrapper } from "./Card"
import { currentSectionAtom } from "~/atoms"

export function GridContainer({ children }: PropsWithChildren) {
  return (
    <div
      className="grid w-full gap-5"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      }}
    >
      {children}
    </div>
  )
}

export function Main() {
  const currentSection = useAtomValue(currentSectionAtom)
  return (
    <GridContainer>
      {currentSection.sourceList.map(id => (
        <CardWrapper key={id} id={id} />
      ))}
    </GridContainer>
  )
}
