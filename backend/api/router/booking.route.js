import express from "express"
import booking from "../controller/booking.controller.js"

const router = express.Router();

router.route('/')
    .get(booking.apiGetBooking)
router.route('/sync')
    .post(booking.apiSyncBookings)


export default router;