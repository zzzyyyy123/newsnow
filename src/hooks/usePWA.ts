import { useEffect } from "react"
import { toast } from "sonner"
import { useRegisterSW } from "virtual:pwa-register/react"

export function usePWA() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (needRefresh) {
      toast("网站有更新，点击更新", {
        action: {
          label: "更新",
          onClick: () => updateServiceWorker(true),
        },
        onDismiss: () => {
          setNeedRefresh(false)
        },
      })
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh])
}
