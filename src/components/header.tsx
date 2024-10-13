import { Link } from "@tanstack/react-router"
import { useCallback } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { useIsFetching } from "@tanstack/react-query"
import clsx from "clsx"
import type { SourceID } from "@shared/types"
import { Homepage, Version } from "@shared/consts"
import { useCookie } from "react-use"
import { useDark } from "~/hooks/useDark"
import { currentColumnAtom, goToTopAtom, refetchSourcesAtom } from "~/atoms"

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

function LoginIn() {
  const [name] = useCookie("name")
  const [avatar] = useCookie("avatar")
  const [jwt, setJwt] = useCookie("jwt")
  if (jwt) {
    return (
      <button
        type="button"
        className="btn-pure"
        title={name ?? ""}
        onClick={() => {
          setJwt("")
        }}
      >
        <div
          className="h-5 w-5 rounded-full bg-cover border"
          style={
            {
              backgroundImage: `url(${avatar})`,
            }
          }
        />
      </button>
    )
  }
  return (
    <a
      type="button"
      title="Login in with GitHub"
      className="i-ph:sign-in-duotone btn-pure"
      // @ts-expect-error >_<
      href={`https://github.com/login/oauth/authorize?client_id=${__G_CLIENT_ID__}&scope=read:user,user:email`}
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
        className="i-ph:arrow-fat-up-duotone btn-pure"
        onClick={goToTop}
      />
    )
  )
}
export function GithubIcon() {
  return <a className="i-ph-github-logo-duotone inline-block btn-pure" href={Homepage} title="Project Homepage" />
}

function RefreshButton() {
  const currentColumn = useAtomValue(currentColumnAtom)
  const setRefetchSource = useSetAtom(refetchSourcesAtom)
  const refreshAll = useCallback(() => {
    const obj = Object.fromEntries(currentColumn.map(id => [id, Date.now()]))
    setRefetchSource(prev => ({
      ...prev,
      ...obj,
    }))
  }, [currentColumn, setRefetchSource])

  const isFetching = useIsFetching({
    predicate: (query) => {
      return currentColumn.includes(query.queryKey[0] as SourceID)
    },
  })

  return (
    <button
      type="button"
      title="Refresh"
      className={clsx("i-ph:arrow-counter-clockwise-duotone btn-pure", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
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
              <span className="color-red-6">N</span>
              <span>ow</span>
            </p>
          </span>
        </Link>
        <a className="btn-pure text-sm ml-1 font-mono">
          {`v${Version}`}
        </a>
      </span>
      <span className="flex gap-2 items-center text-xl text-primary-600 dark:text-primary">
        <GoTop />
        <RefreshButton />
        <ThemeToggle />
        <GithubIcon />
        <LoginIn />
      </span>
    </>
  )
}
