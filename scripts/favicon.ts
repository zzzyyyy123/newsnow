import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { getLogos } from "favicons-scraper"
import fetch from "node-fetch"
import { sources } from "../shared/data"

const projectDir = fileURLToPath(new URL("..", import.meta.url))
const iconsDir = join(projectDir, "public", "icons")
async function downloadImage(url: string, outputPath: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`)
    }

    const fileStream = fs.createWriteStream(outputPath)

    await new Promise((resolve, reject) => {
      response.body?.pipe(fileStream)
      fileStream.on("finish", resolve)
      fileStream.on("error", reject)
    })

    console.log("Image downloaded successfully.")
  } catch (error) {
    console.error("Error downloading the image:", error)
  }
}

async function main() {
  await Promise.all(
    Object.entries(sources).map(async ([id, source]) => {
      try {
        const icon = join(iconsDir, `${id}.png`)
        if (fs.existsSync(icon)) return
        if (!source.home) return
        const res = await getLogos(source.home)
        if (res.length) {
          await downloadImage(res[0].src, icon)
        }
      } catch (e) {
        console.error(id, "\n", e                         )
      }
    }),
  )
}

main()
