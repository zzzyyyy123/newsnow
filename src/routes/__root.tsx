import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "~/styles/globals.css"
import "virtual:uno.css"
import type { QueryClient } from "@tanstack/react-query"
import { Header } from "~/components/header"
import { useOnReload } from "~/hooks/useOnReload"
import { OverlayScrollbar } from "~/components/common/overlay-scrollbar"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  const nav = Route.useNavigate()
  nav({
    to: "/",
  })
}

function RootComponent() {
  useOnReload()
  return (
    <>
      <OverlayScrollbar className="md:p-8 p-4 h-full overflow-x-auto">
        <Header />
        <Outlet />
      </OverlayScrollbar>
      { import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
