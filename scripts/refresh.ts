import { sources } from "../shared/sources"
import { delay } from "../shared/utils"

async function main() {
  for (const id of Object.keys(sources)) {
    await delay(100)
    fetch(`https:newsnow.busiyi/api/s/${id}`)
  }
}

main().catch(console.error)
