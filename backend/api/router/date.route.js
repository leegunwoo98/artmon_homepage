import express from "express"
import date from "../controller/date.controller.js"

const router = express.Router();

router.route("/").get(date.apiGet);
router.route("/sync").get(date.apiSync)

export default router;