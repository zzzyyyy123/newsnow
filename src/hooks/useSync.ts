import type { PrimitiveMetadata } from "@shared/types"
import { useAtom } from "jotai"
import { ofetch } from "ofetch"
import { useDebounce, useMount } from "react-use"
import { useLogin } from "./useLogin"
import { useToast } from "./useToast"
import { preprocessMetadata, primitiveMetadataAtom } from "~/atoms"
import { safeParseString } from "~/utils"

export async function uploadMetadata(metadata: PrimitiveMetadata) {
  if (!__ENABLE_LOGIN__) return
  const jwt = safeParseString(localStorage.getItem("jwt"))
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
  const jwt = safeParseString(localStorage.getItem("jwt"))
  if (!jwt) return
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
}

export function useSync() {
  const [primitiveMetadata, setPrimitiveMetadata] = useAtom(primitiveMetadataAtom)
  const { logout, login } = useLogin()
  const toaster = useToast()

  useDebounce(async () => {
    if (primitiveMetadata.action === "manual") {
      uploadMetadata(primitiveMetadata)
    }
  }, 10000, [primitiveMetadata])
  useMount(() => {
    const fn = async () => {
      try {
        const metadata = await downloadMetadata()
        if (metadata) {
          setPrimitiveMetadata(preprocessMetadata(metadata))
        }
      } catch (e: any) {
        if (e.statusCode === 401) {
          toaster("身份校验失败，请重新登录", {
            type: "error",
            action: {
              label: "登录",
              onClick: login,
            },
          })
          logout()
        }
      }
    }
    fn()
  })
}
