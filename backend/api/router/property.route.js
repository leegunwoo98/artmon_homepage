import express from "express"
import RoomsCtrl from "../controller/rooms.controller.js"

const router=express.Router();

router
  .route("/")
  .get(RoomsCtrl.apiGetRooms)
  .post(RoomsCtrl.apiUpdateRooms)
  .delete(RoomsCtrl.apiDeleteRooms);


export default router