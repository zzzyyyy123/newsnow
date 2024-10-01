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
import { GridContainer } from "./Pure"
import type { ItemsProps } from "./Card"
import { CardWrapper } from "./Card"
import { focusSourcesAtom } from "~/atoms"

export function Dnd() {
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
        {!!activeId && <CardWrapper id={activeId as SourceID} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}

function SortableCardWrapper(props: ItemsProps) {
  const { id } = props
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
    transition: transition || undefined,
  }

  return (
    <CardWrapper
      ref={setNodeRef}
      style={style}
      isDragged={isDragging}
      listeners={listeners}
      {...attributes}
      {...props}
    />
  )
}
