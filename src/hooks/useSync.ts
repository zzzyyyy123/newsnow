import type { PrimitiveMetadata } from "@shared/types"
import { useAtom } from "jotai"
import { ofetch } from "ofetch"
import { useEffect } from "react"
import { useDebounce } from "react-use"
import { preprocessMetadata, primitiveMetadataAtom } from "~/atoms"

export async function uploadMetadata(metadata: PrimitiveMetadata) {
  if (!__ENABLE_LOGIN__) return
  const jwt = localStorage.getItem("user_jwt")
  if (!jwt) return
  try {
    await ofetch("/api/me/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: {
        data: metadata.data,
        updatedTime: metadata.updatedTime,
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export async function downloadMetadata(): Promise<PrimitiveMetadata | undefined> {
  if (!__ENABLE_LOGIN__) return
  const jwt = localStorage.getItem("user_jwt")
  if (!jwt) return
  try {
    const { data, updatedTime } = await ofetch("/api/me/sync", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }) as PrimitiveMetadata
    // 不用同步 action 字段
    if (data) {
      return {
        action: "sync",
        data,
        updatedTime,
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export function useSync() {
  const [primitiveMetadata, setPrimitiveMetadata] = useAtom(primitiveMetadataAtom)

  useDebounce(async () => {
    if (primitiveMetadata.action === "manual") {
      uploadMetadata(primitiveMetadata)
    }
  }, 10000, [primitiveMetadata])
  useEffect(() => {
    const fn = async () => {
      const metadata = await downloadMetadata()
      if (metadata) {
        setPrimitiveMetadata(preprocessMetadata(metadata))
      }
    }
    fn()
  }, [setPrimitiveMetadata])
}
