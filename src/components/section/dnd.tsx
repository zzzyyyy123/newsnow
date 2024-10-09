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
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { useAtom } from "jotai"
import type { SourceID } from "@shared/types"
import { CSS } from "@dnd-kit/utilities"
import type { ItemsProps } from "./card"
import { CardWrapper } from "./card"
import { currentSectionAtom } from "~/atoms"

export function Dnd() {
  const [items, setItems] = useAtom(currentSectionAtom)
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
        {items.map(id => (
          <SortableCardWrapper key={id} id={id} />
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {!!activeId && <CardWrapper id={activeId as SourceID} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}

function SortableCardWrapper({ id, ...props }: ItemsProps) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <CardWrapper
      ref={setNodeRef}
      id={id}
      style={style}
      isDragged={isDragging}
      handleListeners={listeners}
      {...attributes}
      {...props}
    />
  )
}
