import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { Buffer } from "node:buffer"
import { getLogos } from "favicons-scraper"
import { sources } from "../shared/data"

const projectDir = fileURLToPath(new URL("..", import.meta.url))
const iconsDir = join(projectDir, "public", "icons")
async function downloadImage(url: string, outputPath: string, id: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`${id}: could not fetch ${url}, status: ${response.status}`)
    }

    const image = await (await fetch(url)).arrayBuffer()
    fs.writeFileSync(outputPath, Buffer.from(image))
    console.log(`${id}: downloaded successfully.`)
  } catch (error) {
    console.error(`${id}: error downloading the image. `, error)
  }
}

async function main() {
  await Promise.all(
    Object.entries(sources).map(async ([id, source]) => {
      try {
        const icon = join(iconsDir, `${id.split("-")[0]}.png`)
        if (fs.existsSync(icon)) {
          console.log(`${id}: icon exists. skip.`)
          return
        }
        if (!source.home) return
        const res = await getLogos(source.home)
        if (res.length) {
          await downloadImage(res[0].src, icon, id)
        }
      } catch (e) {
        console.error(id, "\n", e)
      }
    }),
  )
}

main()
