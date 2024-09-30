import { useCallback, useState } from "react"
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
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { useAtom } from "jotai"
import type { SourceID } from "@shared/types"
import { GridContainer } from "./Pure"
import { CardWrapper, SortableCardWrapper } from "./Card"
import { focusSourcesAtom } from "~/atoms"

export function Main() {
  const [items, setItems] = useAtom(focusSourcesAtom)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as any)
        const newIndex = items.indexOf(over!.id as any)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }, [setItems])
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
        <GridContainer>
          {items.map(id => (
            <SortableCardWrapper key={id} id={id} />
          ))}
        </GridContainer>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {!!activeId && <CardWrapper id={activeId as SourceID} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}
