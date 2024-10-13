import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { localSourcesAtom } from "~/atoms"
import { Column } from "~/components/column"

export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  const focusSources = useAtomValue(localSourcesAtom)
  const id = useMemo(() => {
    return focusSources.focus.length ? "focus" : "realtime"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Column id={id} />
}
