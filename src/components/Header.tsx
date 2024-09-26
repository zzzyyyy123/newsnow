import logo from "~/assets/react.svg"

export function Header() {
  return (
    <div>
      <div>
        <img src={logo} alt="logo" />
        <span>NewsNow</span>
      </div>
    </div>
  )
}
