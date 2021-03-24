import * as express from "express"
import UrlDBController from "./controllers/urlDB.controller"
import errorWrapper from "./utils/errorWrapper"

const router: express.Router = express.Router()

router.get("/", (req, res) => {
  res.send("Hi, this is backend service").status(200)
})

router.route("/encode").post(errorWrapper(UrlDBController.encodeUrl))
router.route("/:randomString").get(errorWrapper(UrlDBController.decodeUrl))

export { router }
