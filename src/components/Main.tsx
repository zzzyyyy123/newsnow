import { useCallback, useMemo, useState } from "react"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import type { SectionID } from "@shared/types"
import { metadata } from "@shared/data"
import { Item, SortableItem } from "./NewsCard"

export function Main({ sectionId }: { sectionId: SectionID }) {
  // const [items, setItems] = useState(metadata?.[sectionId]?.sourceList ?? [])
  const items = useMemo(() => metadata?.[sectionId]?.sourceList ?? [], [sectionId])
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      // setItems((items) => {
      //   const oldIndex = items.indexOf(active.id as any)
      //   const newIndex = items.indexOf(over!.id as any)

      //   return arrayMove(items, oldIndex, newIndex)
      // })
    }

    setActiveId(null)
  }, [])
  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div
          id="grid-container"
          className="grid w-full gap-5 mt-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {items.map(id => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {!!activeId && <Item id={activeId} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}
