import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "~/styles/globals.css"
import "virtual:uno.css"
import type { QueryClient } from "@tanstack/react-query"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import { Header } from "~/components/Header"
import { useOnReload } from "~/hooks/useOnReload"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

export function RootComponent() {
  useOnReload()
  return (
    <OverlayScrollbarsComponent
      defer
      className="md:p-10 p-4 h-full"
      element="div"
      options={{
        showNativeOverlaidScrollbars: true,
        scrollbars: { autoHide: "scroll" },
      }}
    >
      <Header />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </OverlayScrollbarsComponent>
  )
}
