import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { focusSourcesAtom } from "~/atoms"
import { Section } from "~/components/section"

export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  const focusSources = useAtomValue(focusSourcesAtom)
  const id = useMemo(() => {
    return focusSources.length ? "focus" : "social"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Section id={id} />
}
