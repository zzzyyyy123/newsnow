import type { SourceID, SourceInfo } from "@shared/types"
import { useQuery } from "@tanstack/react-query"
import { formatTime } from "@shared/utils"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"
import { currentSectionAtom, focusSourcesAtom, refetchSourceAtom } from "~/atoms"

export function Main() {
  const currentSection = useAtomValue(currentSectionAtom)
  return (
    <div
      id="grid-container"
      className="grid w-full gap-5 mt-10"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      }}
    >
      {currentSection.sourceList.map(id => (
        <CardWrapper key={id} id={id} />
      ))}
    </div>
  )
}

function CardWrapper({ id }: { id: SourceID }) {
  const { ref, inView } = useInView({
    threshold: 0,
  })
  return (
    <div ref={ref} className="flex flex-col border rounded-md px-2 h-500px" key={id}>
      <NewsCard id={id} inView={inView} />
    </div>
  )
}

function NewsCard({ id, inView }: { id: SourceID, inView: boolean }) {
  const [focusSources, setFocusSources] = useAtom(focusSourcesAtom)
  const addFocusList = useCallback(() => {
    setFocusSources(focusSources.includes(id) ? focusSources.filter(i => i !== id) : [...focusSources, id])
  }, [setFocusSources, focusSources, id])
  const [refetchSource, setRefetchSource] = useAtom(refetchSourceAtom)
  const { isPending, error, isFetching, data } = useQuery({
    queryKey: [id, refetchSource[id]],
    queryFn: async ({ queryKey }) => {
      const [_id, _refetchTime] = queryKey as [SourceID, number]
      let url = `/api/${_id}`
      if (Date.now() - _refetchTime < 1000) {
        url = `/api/${_id}?latest`
      }
      const response = await fetch(url)
      return await response.json() as SourceInfo
    },
    // refetch 时显示原有的数据
    placeholderData: prev => prev,
    staleTime: 1000 * 60 * 5,
    enabled: inView,
    refetchOnWindowFocus: true,
  })

  const manualRefetch = useCallback(() => {
    setRefetchSource(prev => ({
      ...prev,
      [id]: Date.now(),
    }))
  }, [setRefetchSource, id])

  if (isPending || !data) {
    return (
      <>
        {Array.from({ length: 18 }).map((_, i) => i).map(i => <div key={i} className="skeleton m1"></div>)}
      </>
    )
  } else if (error) {
    return <div>Error: </div>
  } else if (data) {
    return (
      <>
        <div className="flex justify-between py-2">
          <span className="text-md font-bold">
            { data?.title }
          </span>
          <span>
            { data?.subtitle}
          </span>
        </div>
        <div className="overflow-auto">
          {data?.data.slice(0, 20).map((item, index) => (
            <div key={item.title} className="flex gap-2 border-b border-gray-300/20">
              <span>
                { index + 1}
              </span>
              <a href={item.url} target="_blank">
                {item.title}
              </a>
            </div>
          ))}
        </div>
        <div className="py-2 flex items-center justify-between">
          <span>
            {formatTime(data!.updateTime)}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className={clsx("i-ph:arrow-clockwise", isFetching && "animate-spin")}
              onClick={manualRefetch}
            />
            <button type="button" className={clsx(focusSources.includes(id) ? "i-ph:star-fill" : "i-ph:star")} onClick={addFocusList} />
          </div>
        </div>
      </>
    )
  }
}
