import { Link } from "@tanstack/react-router"
import logo from "~/assets/react.svg"
import { useDark } from "~/hooks/useDark"

function ThemeToggle() {
  const { toggleDark } = useDark()
  return (
    <button
      type="button"
      title="Toggle Dark Mode"
      className="i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone btn-pure"
      onClick={toggleDark}
    />
  )
}

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <Link className="text-8 flex gap-2 items-center" to="/">
        <img src={logo} alt="logo" className="h-10" />
        <span>NewsNow</span>
      </Link>
      <div className="flex gap-2">
        <button type="button" className="i-ph:arrow-clockwise btn-pure"></button>
        <ThemeToggle />
        <Link className="i-ph:gear btn-pure" to="/setting" />
      </div>
    </header>
  )
}
