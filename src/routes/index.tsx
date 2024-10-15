import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { focusSourcesAtom } from "~/atoms"
import { Column } from "~/components/column"
import { } from "cookie-es"

export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  const focusSources = useAtomValue(focusSourcesAtom)
  const id = useMemo(() => {
    return focusSources.length ? "focus" : "realtime"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Column id={id} />
}
