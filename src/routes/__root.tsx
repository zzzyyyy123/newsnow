import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { QueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { Header } from "~/components/header"
import { useOnReload } from "~/hooks/useOnReload"
import { GlobalOverlayScrollbar } from "~/components/common/overlay-scrollbar"
import { useSync } from "~/hooks/useSync"
import { Footer } from "~/components/footer"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  beforeLoad: () => {
    const query = new URLSearchParams(window.location.search)
    if (query.has("login")) {
      [...query.entries()].forEach(key => localStorage.setItem(key[0], key[1]))
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  },
})

function NotFoundComponent() {
  const nav = Route.useNavigate()
  nav({
    to: "/",
  })
}

function RootComponent() {
  useOnReload()
  useSync()
  return (
    <>
      <GlobalOverlayScrollbar className={clsx([
        "h-full overflow-x-auto px-4",
        "md:(px-10)",
        "lg:(px-24)",
      ])}
      >
        <header className={clsx([
          "flex justify-between items-center py-4 px-5",
          "lg:(py-6)",
          "sticky top-0 z-100 backdrop-blur-md",
        ])}
        >
          <Header />
        </header>
        <main className={clsx([
          "min-h-[calc(100vh-170px)] transition-margin",
          "md:(min-h-[calc(100vh-110px)] mt--14)",
          "lg:(min-h-[calc(100vh-124px)] mt--16)",
        ])}
        >
          <Outlet />
        </main>
        <footer className="py-6 flex flex-col items-center justify-center text-sm text-neutral-500 font-mono">
          <Footer />
        </footer>
      </GlobalOverlayScrollbar>
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
