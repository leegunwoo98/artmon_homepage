import mongodb from "mongodb";
import roomsDAO from "./roomsDAO.js";
let date_DB
export default class dateDAO{
    static async injectDB(conn) {
        if (date_DB) {
            return;
        }
        try {
            date_DB = await conn.db(process.env.DB_NS).collection("date");
            console.log(`connected to database`);
        } catch (e) {
            console.error(
            `Unable to establish a collection handle in dateDAO: ${e}`
            );
        }
    }
    static async getRoomId(){
        try{
            return roomsDAO.getRoomId()
        }catch(e){
            return {error:e.message}
        }
    }
    static async syncDate(myDate){
        try{
            let response = await date_DB.bulkWrite(myDate);
            return response
        }catch(e){
            return {error:e.message}
        }
    }
    static async get(id,from_str,to_str){
        let from=new Date(from_str)
        let to = new Date(to_str);
        try{
            let response = await date_DB.aggregate([
                    {
                        $match:{
                            date:{
                                $gte:from,
                                $lt:to,
                            },

                        }
                    },
                    { 
                      $project:{
                          _id:0,
                          price:"$room."+id+".price",
                          inventory:"$room."+id+".inventory"
                      }  
                    },
                    {
                        $group:{
                            _id:null,
                            price:{$sum:"$price"},
                            inventory:{$min:"$inventory"}
                        }
                    }
                ]
            )
            let pre_val = await response.toArray()
            let val={price:pre_val[0].price,inventory:pre_val[0].inventory}
            return val
        }catch(e){
            return {error:"unable to get room"}
        }
    }
}
