import bookingDAO from '../../dao/bookingDAO.js'
import beds24 from "../../beds24/beds24.sync.js"


export default class Booking{
    //sync booking from Beds24
    static async apiSyncBookings(req, res, next){
        try{
            var key=req.body.apiKey
            if(key!==process.env.BACKEND_KEY) {
                throw new Error(`key does not match`)
            }
            var info = await beds24.getBooking().then((response)=>{
                return bookingDAO.updateBookings(response)
            })
            res.json(info)
        }catch(e){
            res.status(500).json({error:e})
        }
    }
    static async apiGetBooking(req, res, next){
        
    }
}