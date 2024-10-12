import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "~/styles/globals.css"
import "virtual:uno.css"
import type { QueryClient } from "@tanstack/react-query"
import { Author, Homepage } from "@shared/consts"
import clsx from "clsx"
import { useEffect } from "react"
import { Header } from "~/components/header"
import { useOnReload } from "~/hooks/useOnReload"
import { OverlayScrollbar } from "~/components/common/overlay-scrollbar"
import { useSticky } from "~/hooks/useSticky"

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
  const { ref, isSticky } = useSticky()
  useEffect(() => {
    console.log(isSticky)
  }, [isSticky])
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg"></div>
      <OverlayScrollbar className="h-full overflow-x-auto relative">
        <header
          ref={ref}
          className={
            clsx("flex justify-between items-center py-4 px-8 md:(py-6 px-20)", "sticky top-0 z-100 backdrop-blur-md")
          }
        >
          <Header />
        </header>
        <main className="min-h-[calc(100vh-12rem)] px-4 md:(px-16 mt--16 min-h-[calc(100vh-8rem)] )">
          <Outlet />
        </main>
        <footer className="py-6 flex flex-col items-center justify-center text-sm text-neutral-500">
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
