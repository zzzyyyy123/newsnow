import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { useIsFetching } from "@tanstack/react-query"
import clsx from "clsx"
import type { SourceID } from "@shared/types"
import { Homepage, Version } from "@shared/consts"
import logo from "~/assets/icon.svg"
import { useDark } from "~/hooks/useDark"
import { currentSectionAtom, refetchSourcesAtom } from "~/atoms"

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

export function GithubIcon() {
  return <a className="i-ph-github-logo-duotone inline-block btn-pure" href={Homepage} />
}

function RefreshButton() {
  const currentSection = useAtomValue(currentSectionAtom)
  const setRefetchSource = useSetAtom(refetchSourcesAtom)
  const refreshAll = useCallback(() => {
    const obj = Object.fromEntries(currentSection.map(id => [id, Date.now()]))
    setRefetchSource(prev => ({
      ...prev,
      ...obj,
    }))
  }, [currentSection, setRefetchSource])

  const isFetching = useIsFetching({
    predicate: (query) => {
      return currentSection.includes(query.queryKey[0] as SourceID)
    },
  })

  return (
    <button
      type="button"
      className={clsx("i-ph:arrow-counter-clockwise-duotone btn-pure", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <div className="flex">
        <div className="flex">
          <Link to="/" className="flex gap-2">
            <img src={logo} alt="logo" className="h-12" />
            <span className="flex flex-col text-2xl font-mono font-bold line-height-none">
              <span>News</span>
              <span>Now</span>
            </span>
          </Link>
          <a className="btn-pure text-sm ml-1">
            {`v${Version}`}
          </a>
        </div>
      </div>
      <span className="flex gap-2 items-center text-xl">
        <RefreshButton />
        <ThemeToggle />
        <GithubIcon />
      </span>
    </>
  )
}
