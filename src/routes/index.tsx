import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { localSourcesAtom } from "~/atoms"
import { Column } from "~/components/column"

export const Route = createFileRoute("/")({
  component: IndexComponent,
  loader: async () => {
    if (window.location.search.includes("login")) {
      window.history.replaceState(null, "", "/")
    }
  },
})

function IndexComponent() {
  const focusSources = useAtomValue(localSourcesAtom)
  const id = useMemo(() => {
    return focusSources.focus.length ? "focus" : "realtime"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Column id={id} />
}
