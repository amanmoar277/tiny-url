import * as express from "express"
import UrlController from "./controllers/url.controller"
import errorWrapper from "./utils/errorWrapper"

const router: express.Router = express.Router()

router.get("/", (req, res) => {
  res.send("Hi, this is backend service").status(200)
})

router.route("/encode").post(errorWrapper(UrlController.encodeUrl))
router.route("/:randomString").get(errorWrapper(UrlController.decodeUrl))

export { router }
