import { MongoClient, Db, Collection } from "mongodb"
import { allDBS, COLLECTIONS } from "../config/constants"

type ACollections = {
  [key in keyof typeof COLLECTIONS]: Collection
}

const dbs = {}
const addDB = (dbName: string, db: Db): void => {
  dbs[dbName] = db
  console.info(
    `${dbName} Db reference added and now you can access it from any file`
  )
}
const getDB = (dbName: string): Db => {
  if (dbs[dbName]) {
    return dbs[dbName]
  }
  console.info(`${dbName} Db reference not found, we can't access it`)
}

export namespace DBService {
  export let db: Db
  export const collections: ACollections = ({} as unknown) as ACollections
  let client: MongoClient

  export const connect = async (): Promise<Db> => {
    client = new MongoClient(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    await client
      .connect()
      .then(x =>
        console.info(
          `\n\n\n--------------------------connected to MONGODB-----------------------\n\n\n`
        )
      )
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
    db = client.db()
    addDB(allDBS.TINY_URL, db)
    for (const collection of Object.keys(COLLECTIONS)) {
      ensureCollection(COLLECTIONS[collection])
    }
    return db
  }

  export const ensureCollection = (
    collectionName: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      db.listCollections({ name: collectionName }).next(
        async (err, collectionInfo) => {
          if (err) {
            console.error(err)
            reject(err)
          }
          if (collectionInfo) {
            console.info(
              `------>>>>>>>COLLECTION FOUND: ${collectionName}, skipping collection creation`
            )
            resolve(true)
          } else {
            console.info(`------>>>>>>>COLLECTION NOT FOUND: ${collectionName}`)
            await introduceCollection(collectionName)
            resolve(false)
          }
        }
      )
    })
  }

  export const introduceCollection = (
    collectionName: string
  ): Promise<Collection> => {
    return new Promise((resolve, reject) => {
      db.createCollection(collectionName, (err, collection) => {
        if (err) {
          reject(err)
        }
        console.info(`------>>>>>>>COLLECTION CREATED: ${collectionName}`)
        resolve(collection)
      })
    })
  }

  export const getCollection = (
    collectionName: string,
    dbName: string = allDBS.TINY_URL
  ) => {
    const database = getDB(dbName)
    return database.collection(collectionName)
  }
}

export default DBService
