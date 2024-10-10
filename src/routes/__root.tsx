import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "~/styles/globals.css"
import "virtual:uno.css"
import type { QueryClient } from "@tanstack/react-query"
import { Author, Homepage } from "@shared/consts"
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
      <OverlayScrollbar className="px-6 md:(px-16) h-full overflow-x-auto relative">
        <header className="flex justify-between items-center sticky top-0 z-100 bg-base py-4 md:(pt-8)">
          <Header />
        </header>
        <main className="min-h-[calc(100vh-11rem)]">
          <Outlet />
        </main>
        <footer className="py-6 flex flex-col items-center justify-center text-sm">
          <a href={`${Homepage}/LICENCE`}>MIT LICENCE</a>
          <span>
            <span> © 2024 By </span>
            <a href={Author.url}>
              {Author.name}
            </a>
          </span>
        </footer>
      </OverlayScrollbar>
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
