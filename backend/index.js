import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RoomsDAO from "./dao/roomsDAO.js"
import BookingDAO from "./dao/bookingDAO.js"
import DateDAO from "./dao/dateDAO.js";

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.PROP_DB_URI,
    {
        wtimeoutMS:3000
    }
)
.catch(err => {
    console.log(err);
    process.exit(1)
})
.then(async client =>{
    RoomsDAO.injectDB(client)
    BookingDAO.injectDB(client)
    DateDAO.injectDB(client)
    app.listen(port, () =>{
        console.log(`listening on ${port}`)
    })
}) 
