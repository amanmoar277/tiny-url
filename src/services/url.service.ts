import { COLLECTIONS } from "../config/constants"
import DBService from "./db.service"

namespace UrlService {
  export const set = async (
    longURL: string,
    shortURL: string
  ): Promise<void> => {
    const collection = DBService.getCollection(COLLECTIONS.URL)
    await collection.insertOne({
      longURL,
      shortURL
    })
  }

  export const get = async ({
    longURL,
    shortURL
  }: {
    longURL?: string
    shortURL?: string
  }): Promise<any> => {
    const collection = DBService.getCollection(COLLECTIONS.URL)
    if (!longURL && !shortURL) {
      return
    }
    const result = await collection.findOne({
      ...(longURL && { longURL }),
      ...(shortURL && { shortURL })
    })
    return result
  }
}

export default UrlService
