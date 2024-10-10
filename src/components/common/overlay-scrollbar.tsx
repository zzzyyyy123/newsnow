import type { UseOverlayScrollbarsParams } from "overlayscrollbars-react"
import { useOverlayScrollbars } from "overlayscrollbars-react"
import type { HTMLProps, PropsWithChildren } from "react"
import { useEffect, useMemo, useRef } from "react"
import { defu } from "defu"

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
