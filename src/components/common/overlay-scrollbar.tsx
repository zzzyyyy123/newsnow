import type { UseOverlayScrollbarsParams } from "overlayscrollbars-react"
import { useOverlayScrollbars } from "overlayscrollbars-react"
import type { HTMLProps, PropsWithChildren } from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { defu } from "defu"
import { useSetAtom } from "jotai"
import { goToTopAtom } from "~/atoms"

type Props = HTMLProps<HTMLDivElement> & UseOverlayScrollbarsParams
const defaultScrollbarParams: UseOverlayScrollbarsParams = {
  options: {
    scrollbars: {
      autoHide: "scroll",
    },
  },
  defer: true,
}

export function OverlayScrollbar({ children, options, events, defer, ...props }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollbarParams = useMemo(() => defu<UseOverlayScrollbarsParams, Array<UseOverlayScrollbarsParams> >({
    options,
    events,
    defer,
  }, defaultScrollbarParams), [options, events, defer])

  const [initialize] = useOverlayScrollbars(scrollbarParams)

  useEffect(() => {
    initialize({
      target: ref.current!,
      cancel: {
        // 如果浏览器原生滚动条是覆盖在元素上的，则取消初始化
        nativeScrollbarsOverlaid: true,
      },
    })
  }, [initialize])

  return (
    <div ref={ref} {...props}>
      {/* 只能有一个 element */}
      <div>{children}</div>
    </div>
  )
}

export function GlobalOverlayScrollbar({ children, ...props }: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const ref = useRef<HTMLDivElement>(null)
  const lastScroll = useRef(0)
  const timer = useRef<any>()
  const setGoToTop = useSetAtom(goToTopAtom)
  const onScroll = useCallback((e: Event) => {
    const now = Date.now()
    if (now - lastScroll.current > 50) {
      lastScroll.current = now
      clearTimeout(timer.current)
      timer.current = setTimeout(
        () => {
          const el = e.target as HTMLElement
          setGoToTop({
            ok: el.scrollTop > 100,
            fn: () => el.scrollTo({ top: 0, behavior: "smooth" }),
          })
        },
        500,
      )
    }
  }, [setGoToTop])
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        autoHide: "scroll",
      },
    },
    events: {
      scroll: (_, e) => onScroll(e),
    },
    defer: true,
  })

  useEffect(() => {
    initialize({
      target: ref.current!,
      cancel: {
        nativeScrollbarsOverlaid: true,
      },
    })
  }, [initialize])

  useEffect(() => {
    const el = ref.current
    if (el) {
      ref.current?.addEventListener("scroll", onScroll)
      return () => {
        el?.removeEventListener("scroll", onScroll)
      }
    }
  }, [onScroll])

  return (
    <div ref={ref} {...props}>
      <div>{children}</div>
    </div>
  )
}
