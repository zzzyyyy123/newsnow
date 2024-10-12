import type { NewsItem, SourceID, SourceInfo, SourceResponse } from "@shared/types"
import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { useAtom } from "jotai"
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { sources } from "@shared/sources"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { ofetch } from "ofetch"
import { OverlayScrollbar } from "../common/overlay-scrollbar"
import { focusSourcesAtom, refetchSourcesAtom } from "~/atoms"
import { useRelativeTime } from "~/hooks/useRelativeTime"

export interface ItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  id: SourceID
  /**
   * 是否显示透明度，拖动时原卡片的样式
   */
  isDragged?: boolean
  handleListeners?: SyntheticListenerMap
}

interface NewsCardProps {
  id: SourceID
  inView: boolean
  handleListeners?: SyntheticListenerMap
}

interface Query {
  query: UseQueryResult<SourceInfo, Error>
}

export const CardWrapper = forwardRef<HTMLDivElement, ItemsProps>(({ id, isDragged, handleListeners, style, ...props }, dndRef) => {
  const ref = useRef<HTMLDivElement>(null)
  const { ref: inViewRef, inView } = useInView()

  useImperativeHandle(dndRef, () => ref.current!)
  useImperativeHandle(inViewRef, () => ref.current!)

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col h-500px rounded-2xl bg-blue bg-op-50 p-4 backdrop-blur-5",
        isDragged && "op-50",
        `bg-${sources[id].color}`,
      )}
      style={{
        transformOrigin: "50% 50%",
        ...style,
      }}
      {...props}
    >
      <NewsCard id={id} inView={inView} handleListeners={handleListeners} />
    </div>
  )
})

export function CardOverlay({ id }: { id: SourceID }) {
  return (
    <div className={clsx(
      "flex flex-col h-500px rounded-2xl bg-op-50 p-4 backdrop-blur-5",
      "backdrop-blur-5 bg-op-40",
      `bg-${sources[id].color}`,
    )}
    >
      <div className={clsx("flex justify-between mx-2 mt-0 mb-2 items-center")}>
        <div className="flex gap-2 items-center">
          <div
            className={clsx("w-8 h-8 rounded-full")}
            style={{
              background: `center / contain no-repeat url(/icons/${id.split("-")[0]}.png)`,
            }}
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">
                {sources[id].name}
              </span>
              {sources[id]?.title && <span className="text-sm">{sources[id].title}</span>}
            </span>
            <span className="text-xs">正在刷新</span>
          </span>
        </div>
        <div className="flex gap-2 op-80">
          <button
            type="button"
            className={clsx("i-ph:dots-six-vertical-duotone", "cursor-grabbing")}
          />
        </div>
      </div>
      <div className="h-full p-2 overflow-x-auto bg-base bg-op-70! rounded-2xl" />
    </div>
  )
}

function NewsCard({ id, inView, handleListeners }: NewsCardProps) {
  const [focusSources, setFocusSources] = useAtom(focusSourcesAtom)
  const [refetchSource, setRefetchSource] = useAtom(refetchSourcesAtom)
  const query = useQuery({
    queryKey: [id, refetchSource[id]],
    queryFn: async ({ queryKey }) => {
      const [_id, _refetchTime] = queryKey as [SourceID, number]
      let url = `/api/${_id}`
      if (Date.now() - _refetchTime < 1000) {
        url = `/api/${_id}?latest`
      }
      const response: SourceResponse = await ofetch(url, { timeout: 5000 })
      if (response.status === "error") {
        throw new Error(response.message)
      } else {
        return response.data
      }
    },
    // refetch 时显示原有的数据
    placeholderData: prev => prev,
    staleTime: 1000 * 60 * 5,
    enabled: inView,
  })

  const addFocusList = useCallback(() => {
    setFocusSources(focusSources.includes(id) ? focusSources.filter(i => i !== id) : [...focusSources, id])
  }, [setFocusSources, focusSources, id])
  const manualRefetch = useCallback(() => {
    setRefetchSource(prev => ({
      ...prev,
      [id]: Date.now(),
    }))
  }, [setRefetchSource, id])

  return (
    <>
      <div className={clsx("flex justify-between mx-2 mt-0 mb-2 items-center")}>
        <div className="flex gap-2 items-center">
          <div
            className={clsx("w-8 h-8 rounded-full")}
            style={{
              background: `center / contain no-repeat url(/icons/${id.split("-")[0]}.png)`,
            }}
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">
                {sources[id].name}
              </span>
              {sources[id]?.title && <span className="text-sm">{sources[id].title}</span>}
            </span>
            <span className="text-xs"><UpdateTime query={query} /></span>
          </span>
        </div>
        <div className="flex gap-2 op-80">
          <button
            type="button"
            className={clsx("i-ph:arrow-counter-clockwise-duotone", query.isFetching && "animate-spin i-ph:circle-dashed-duotone")}
            onClick={manualRefetch}
          />
          <button
            type="button"
            className={clsx(focusSources.includes(id) ? "i-ph:star-fill" : "i-ph:star-duotone")}
            onClick={addFocusList}
          />
          <button
            {...handleListeners}
            type="button"
            className={clsx("i-ph:dots-six-vertical-duotone", "cursor-grab")}
          />
        </div>
      </div>

      <OverlayScrollbar
        className={clsx("h-full p-2 overflow-x-auto bg-base bg-op-70! rounded-2xl transition-all duration-500", query.isFetching && "blur-3px")}
        options={{
          overflow: { x: "hidden" },
        }}
      >
        {sources[id].type === "hottest" ? <NewsList query={query} /> : <NewsListTimeLine query={query} />}
      </OverlayScrollbar>
    </>
  )
}

function UpdateTime({ query }: Query) {
  const updatedTime = useRelativeTime(query.data?.updatedTime ?? "")
  if (updatedTime) return `${updatedTime}更新`
  if (query.isError) return "获取失败"
  return "加载中..."
}

function ExtraInfo({ item }: { item: NewsItem }) {
  if (item?.extra?.info) {
    return <>{item.extra.info}</>
  }
  if (item?.extra?.icon) {
    return <img src={item.extra.icon} className="w-5 inline" onError={e => e.currentTarget.hidden = true} />
  }
}

function NewsList({ query }: Query) {
  const items = query.data?.items
  return (
    <ol>
      {items?.map((item, i) => (
        <li key={item.title} className="flex gap-2 items-center mb-2 items-stretch">
          <span className={clsx("bg-gray-4/10 min-w-6 flex justify-center items-center rounded-md text-sm")}>
            {i + 1}
          </span>
          <a href={item.url} target="_blank" className="self-start">
            <span className="mr-2">
              {item.title}
            </span>
            <span className="text-xs text-gray-4/80 truncate align-middle">
              <ExtraInfo item={item} />
            </span>
          </a>
        </li>
      ))}
    </ol>
  )
}

function UpdatedTime({ item }: { item: NewsItem }) {
  const relativeTime = useRelativeTime(item?.extra?.date)
  return <>{relativeTime}</>
}

function NewsListTimeLine({ query }: Query) {
  const items = query.data?.items
  return (
    <ol className="relative border-s border-dash border-gray-4/30">
      {items?.map(item => (
        <li key={item.title} className="flex gap-2 mb-2 ms-4">
          <div className={clsx("absolute w-2 h-2 bg-gray-4/50 rounded-full ml-0.5 mt-1 -start-1.5")} />
          <span className="flex flex-col">
            <span className="text-xs text-gray-4/80 truncate align-middle">
              <UpdatedTime item={item} />
            </span>
            <a href={item.url} target="_blank">
              <span>
                {item.title}
              </span>
              <span className="text-xs text-gray-4/80 truncate align-middle">
                <ExtraInfo item={item} />
              </span>
            </a>
          </span>
        </li>
      ))}
    </ol>
  )
}
