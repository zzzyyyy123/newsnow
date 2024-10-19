import { useEffect } from "react"
import { toast } from "sonner"
import { useRegisterSW } from "virtual:pwa-register/react"

export function usePWA() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (offlineReady) {
      toast.info("PWA 准备好了")
    } else if (needRefresh) {
      toast("有更新，点击更新", {
        action: {
          label: "更新",
          onClick: () => updateServiceWorker(true),
        },
        onDismiss: () => {
          setOfflineReady(false)
          setNeedRefresh(false)
        },
      })
    }
  }, [offlineReady, needRefresh, updateServiceWorker, setOfflineReady, setNeedRefresh])
}
