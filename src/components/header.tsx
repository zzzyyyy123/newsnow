import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { useIsFetching } from "@tanstack/react-query"
import clsx from "clsx"
import type { SourceID } from "@shared/types"
import { Homepage, Version } from "@shared/consts"
import { useLocalStorage } from "react-use"
import { useDark } from "~/hooks/useDark"
import { currentSourcesAtom, goToTopAtom, refetchSourcesAtom } from "~/atoms"

function ThemeToggle() {
  const { toggleDark } = useDark()
  return (
    <button
      type="button"
      title="Toggle Dark Mode"
      className="i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone btn"
      onClick={toggleDark}
    />
  )
}

function LoginIn() {
  // useLocalStorage 默认会自动序列化
  const [info] = useLocalStorage<{ name: string, avatar: string }>("user_info")
  const [jwt, _setJwt] = useLocalStorage<string>("user_jwt", undefined, {
    raw: true,
  })
  if (jwt) {
    return (
      <button
        type="button"
        className="btn"
        title={info?.name ?? ""}
        onClick={() => {
          // setJwt("")
        }}
      >
        <div
          className="h-6 w-6 rounded-full bg-cover border p-1 border-primary-600 dark:border-primary"
          style={
            {
              backgroundImage: `url(${info?.avatar})`,
            }
          }
        />
      </button>
    )
  }
  return (
    <a
      title="Login in with GitHub"
      className="i-ph:sign-in-duotone btn"
      href={`https://github.com/login/oauth/authorize?client_id=${__G_CLIENT_ID__}`}
    />
  )
}

function GoTop() {
  const { ok, fn: goToTop } = useAtomValue(goToTopAtom)
  return (
    ok && (
      <button
        type="button"
        title="Go To Top"
        className="i-ph:arrow-fat-up-duotone btn"
        onClick={goToTop}
      />
    )
  )
}
export function GithubIcon() {
  return <a className="i-ph-github-logo-duotone inline-block btn" href={Homepage} title="Project Homepage" />
}

function RefreshButton() {
  const currentSources = useAtomValue(currentSourcesAtom)
  const setRefetchSource = useSetAtom(refetchSourcesAtom)
  const refreshAll = useCallback(() => {
    const obj = Object.fromEntries(currentSources.map(id => [id, Date.now()]))
    setRefetchSource(prev => ({
      ...prev,
      ...obj,
    }))
  }, [currentSources, setRefetchSource])

  const isFetching = useIsFetching({
    predicate: (query) => {
      return currentSources.includes(query.queryKey[0] as SourceID)
    },
  })

  return (
    <button
      type="button"
      title="Refresh"
      className={clsx("i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <span className="flex">
        <Link to="/" className="flex gap-2 items-center">
          <div className="h-10 w-10 bg-cover" title="logo" style={{ backgroundImage: "url(/icon.svg)" }} />
          <span className="text-2xl font-brand line-height-none!">
            <p>News</p>
            <p className="mt--1">
              <span className="color-primary-6">N</span>
              <span>ow</span>
            </p>
          </span>
        </Link>
        <a className="btn text-sm ml-1 font-mono">
          {`v${Version}`}
        </a>
      </span>
      <span className="flex gap-2 items-center text-xl text-primary-600 dark:text-primary">
        <GoTop />
        <RefreshButton />
        <ThemeToggle />
        <GithubIcon />
        { __ENABLE_LOGIN__ && <LoginIn />}
      </span>
    </>
  )
}
