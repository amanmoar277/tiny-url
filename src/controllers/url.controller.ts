import * as express from "express"

interface EncodedUrlParams {
    url: string
}

interface DecodeUrlParams {
    randomString: string
}
// Use DB if we want to persist the data and want the functionality works well even after app is restarted
namespace UrlController {
  const dict = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const long2short = new Map()
  const short2long = new Map()

  export const encodeUrl = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { url } = req.body as EncodedUrlParams

    if (!url) {
      res.send("URL is required param").status(400)
    }

    // logic starts from here
    const alreadyPresentShortUrl: string | undefined = long2short.get(url)
    if (alreadyPresentShortUrl) {
      res
        .send({
          url: `${process.env.APP_BASE_URL + alreadyPresentShortUrl}`
        })
        .status(200)
      return
    }

    let idx: number = 0
    const randomStringArray: string[] = []
    for (let i: number = 0; i < 6; i++) {
      randomStringArray[i] = dict[(Math.random() * 61).toFixed()]
    }

    let randomString: string = randomStringArray.join("")
    while (short2long.has(randomString)) {
      randomStringArray[idx] = dict[(Math.random() * 61).toFixed()]
      idx = (idx + 1) % 6
    }
    randomString = randomStringArray.join("")

    short2long.set(randomString, url)
    long2short.set(url, randomString)
    res.send({ url: `${process.env.APP_BASE_URL + randomString}` }).status(200)
  }

  export const decodeUrl = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { randomString } = req.params as DecodeUrlParams
    const url: string | undefined = short2long.get(randomString)
    if (!url) {
      res.send("No such encoding").status(409)
      return
    }
    res.send({ url }).status(200)
  }
}

export default UrlController
