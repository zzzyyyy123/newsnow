import { Link } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { sectionsAtom } from "~/atoms/news"

export function NavBar() {
  const items = useAtomValue(sectionsAtom)
  return (
    <section className="flex gap-2">
      {items.map(nav => (
        <Link
          key={nav.id}
          to="/section"
          search={{ n: nav.id }}
          activeProps={{ className: "bg-blue-500" }}
        >
          {nav.name}
        </Link>
      ))}
    </section>
  )
}
