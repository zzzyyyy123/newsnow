import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/setting")({
  component: Setting
})

function Setting() {
  return (
    <div className="p-2">
      <h3>Setting</h3>
    </div>
  )
}