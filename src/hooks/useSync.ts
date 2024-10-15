import type { PrimitiveMetadata } from "@shared/types"
import { useAtom } from "jotai"
import { ofetch } from "ofetch"
import { useCallback, useEffect } from "react"
import { preprocessMetadata, primitiveMetadataAtom } from "~/atoms"

export function useSync() {
  const [primitiveMetadata, setPrimitiveMetadata] = useAtom(primitiveMetadataAtom)
  const uploadMetadata = useCallback(async () => {
    if (!__ENABLE_LOGIN__) return
    const jwt = localStorage.getItem("user_jwt")
    if (!jwt) return
    if (primitiveMetadata.action !== "manual") return
    try {
      await ofetch("/api/me/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: {
          data: primitiveMetadata.data,
          updatedTime: primitiveMetadata.updatedTime,
        },
      })
    } catch (e) {
      console.error(e)
    }
  }, [primitiveMetadata])

  const downloadMetadata = useCallback(async () => {
    if (!__ENABLE_LOGIN__) return
    const jwt = localStorage.getItem("user_jwt")
    if (!jwt) return
    try {
      const { data, updatedTime } = await ofetch("/api/me/sync", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }) as PrimitiveMetadata
      if (data && updatedTime > primitiveMetadata.updatedTime) {
        // 不用同步 action 字段
        setPrimitiveMetadata(preprocessMetadata({ action: "sync", data, updatedTime }, "sync"))
      }
    } catch (e) {
      console.error(e)
    }
    // 只需要在初始化时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPrimitiveMetadata])

  useEffect(() => {
    downloadMetadata()
  }, [setPrimitiveMetadata, downloadMetadata])
  useEffect(() => {
    uploadMetadata()
  }, [primitiveMetadata, uploadMetadata])
}
