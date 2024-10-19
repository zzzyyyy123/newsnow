import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback } from "react"

const userAtom = atomWithStorage<{
  name?: string
  avatar?: string
}>("user", {})

const jwtAtom = atomWithStorage("jwt", "")

export function useLogin() {
  const [userInfo] = useAtom(userAtom)
  const [jwt, setJwt] = useAtom(jwtAtom)
  const enabledLogin = __ENABLE_LOGIN__
  const login = useCallback(() => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${__G_CLIENT_ID__}`
  }, [])

  return {
    enabledLogin,
    loggedIn: !!jwt,
    userInfo,
    logout: () => setJwt(""),
    login,
  }
}
