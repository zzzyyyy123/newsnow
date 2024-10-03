import { it } from "vitest"
import { zaobao } from "#/sources/zaobao"

it.skip("res", {
  timeout: 10000,
}, async () => {
  const res = await zaobao()
  console.log(res)
})
