import * as express from "express"
import RedisService from "../services/redis.service"
import UrlService from "../services/url.service"

const getValueFromResources = async ({
  longURL,
  shortURL
}: {
  longURL?: string
  shortURL?: string
}) => {
  const url = longURL || shortURL
  const redisClient = RedisService.getClient()
  const getFromCache = await new Promise((resolve, reject) => {
    redisClient.get(url, (err, result) => {
      // console.log(result)
      resolve(result)
    })
  })

  console.log(getFromCache, "getFromCache")
  if (getFromCache) {
    return getFromCache
  }
  const getFromDB = await UrlService.get({
    ...(longURL && { longURL }),
    ...(shortURL && { shortURL })
  })
  console.log(getFromDB, "getFromDB")
  return getFromDB && getFromDB.shortURL
}

namespace UrlController {
  const dict = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

  export const encodeUrl = async (
    req: express.Request,
    res: express.Response
  ) => {
    const start = Date.now()
    const { url } = req.body

    if (!url) {
      res.send("URL is required param").status(400)
    }

    // logic starts from here
    const redisClient = await RedisService.getClient()
    const shortURLFromResources = await getValueFromResources({ longURL: url })

    if (shortURLFromResources) {
      res
        .send({
          url: `${process.env.APP_BASE_URL}api/${shortURLFromResources}`
        })
        .status(200)
      return
    }

    let idx = 0
    const randomStringArray: string[] = []
    for (let i = 0; i < 6; i++) {
      randomStringArray[i] = dict[(Math.random() * 61).toFixed()]
    }

    let randomString = randomStringArray.join("")
    while (await getValueFromResources({ shortURL: randomString })) {
      randomStringArray[idx] = dict[(Math.random() * 61).toFixed()]
      idx = (idx + 1) % 6
    }
    randomString = randomStringArray.join("")

    await UrlService.set(url, randomString)

    Promise.all([
      redisClient.set(url, randomString),
      redisClient.set(randomString, url)
    ])

    const end = Date.now()
    console.log(
      "value-> ",
      randomString,
      "resolved in-> ",
      Math.floor(end - start),
      "milliSec or",
      Math.floor((end - start) / 1000),
      "s"
    )
    res.send({ url: `${process.env.APP_BASE_URL}api/${shortURLFromResources}` }).status(200)
  }

  export const decodeUrl = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { randomString } = req.params

    const url = await getValueFromResources({ shortURL: randomString })
    if (!url) {
      res.send({message: "No such encoding "}).status(409)
      return
    }
    res.redirect(url)
    // res.send({ url }).status(200)
  }
}

export default UrlController
