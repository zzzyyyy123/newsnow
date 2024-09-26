import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return <Link to="/section" search={{ n: "focus" }}> 关注 </Link>
}
