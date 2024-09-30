import type { CSSProperties, HTMLAttributes } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { forwardRef } from "react"
import clsx from "clsx"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string
  withOpacity?: boolean
  isDragging?: boolean
  listeners?: SyntheticListenerMap
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(({ id, withOpacity, isDragging, listeners, style, ...props }, ref) => {
  const inlineStyles: CSSProperties = {
    transformOrigin: "50% 50%",
    minHeight: "500px",
    ...style,
  }

  const css = [
    "border rounded-xl",
    isDragging ? "scale-105" : "",
    withOpacity && "op-50",
  ]

  return (
    <div
      ref={ref}
      className={clsx(css)}
      style={inlineStyles}
      {...props}
    >
      <div
        className={clsx("border-b", isDragging ? "cursor-grabbing" : "cursor-grab")}
        {...listeners}
      >
        你好
      </div>
      <div>
        {id}
      </div>
    </div>
  )
})

export function SortableItem(props: ItemProps) {
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
    <Item
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      isDragging={isDragging}
      listeners={listeners}
      {...attributes}
      {...props}
    />
  )
}
