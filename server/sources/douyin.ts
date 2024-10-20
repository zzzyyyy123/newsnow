interface Res {
  data: {
    word_list: {
      sentence_id: string
      word: string
      event_time: string
      hot_value: string
    }[]
  }
}

async function getDyCookies() {
  try {
    const cookisUrl = "https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383"
    const data = await $fetch.raw(cookisUrl)
    const pattern = /passport_csrf_token=(.*); Path/s
    const matchResult = data.headers.get("set-cookie")?.[0]?.match(pattern)
    if (matchResult && matchResult.length > 1) {
      const cookieData = matchResult[1]
      return cookieData
    }
  } catch (error) {
    logger.error(`获取抖音 Cookie 出错: ${error}`)
    return null
  }
}

export default defineSource(async () => {
  const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1"
  const cookie = await getDyCookies()
  const res: Res = await $fetch(url, {
    headers: {
      Cookie: `passport_csrf_token=${cookie}`,
    },
  })
  return res.data.word_list
    .map((k) => {
      return {
        id: k.sentence_id,
        title: k.word,
        url: `https://www.douyin.com/hot/${k.sentence_id}`,
      }
    })
})
