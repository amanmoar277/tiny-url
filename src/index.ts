import * as express from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import { router } from "./routes"

export const app: express.Application = express()

const PORT = process.env.PORT || 5000

const initConfig = () => {
  Object.assign(process.env, require("../.env"))
}

const initMiddlewares = () => {
  app.use(cors())
  app.use(bodyParser.json({ limit: "20mb" }))
  app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }))

  // apis
  app.use("/api/", router)

  // rest all non-matching request comes here
  app.get("*", (req, res) => {
    res.send("Nothing on this route")
  })
}

const main = async () => {
  initConfig()
  initMiddlewares()

  app.listen(PORT, err => {
    if (err) {
      console.log(err)
    }
    console.log(`Server listening at PORT ${PORT}`)
  })
}

main()
