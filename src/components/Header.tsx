import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import { useAtomValue } from "jotai"
import type { SourceID } from "@shared/types"
import { queryClient } from "~/main"
import logo from "~/assets/react.svg"
import { useDark } from "~/hooks/useDark"
import { currentSectionAtom } from "~/atoms"

function ThemeToggle() {
  const { toggleDark } = useDark()
  return (
    <button
      type="button"
      title="Toggle Dark Mode"
      className="i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone btn-pure"
      onClick={toggleDark}
    />
  )
}

function RefreshButton() {
  const currentSection = useAtomValue(currentSectionAtom)
  const refreshAll = useCallback(async () => {
    await queryClient.refetchQueries({
      predicate(query) {
        return currentSection.sourceList.includes(query.queryKey[0] as SourceID)
      },
    })
  }, [currentSection])

  return (
    <button type="button" className="i-ph:arrow-clockwise btn-pure" onClick={refreshAll} />
  )
}

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <Link className="text-6 flex gap-2 items-center" to="/">
        <img src={logo} alt="logo" className="h-8" />
        <span className="font-mono">NewsNow</span>
      </Link>
      <div className="flex gap-2">
        <RefreshButton />
        <ThemeToggle />
        <Link className="i-ph:gear btn-pure" to="/setting" />
      </div>
    </header>
  )
}
