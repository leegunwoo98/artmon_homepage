import mongodb from "mongodb";
import beds24 from "../beds24/beds24.sync.js";
const ObjectId = mongodb.ObjectId;
let rooms;

export default class RoomsDAO {
  static async injectDB(conn) {
    if (rooms) {
      return;
    }
    try {
      rooms = await conn
        .db(process.env.DB_NS)
        .collection("rooms");
        console.log(`connected to database`)
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in roomsDAO: ${e}`
      );
    }
  }
  static async getRooms(){
      let cursor;
      try{
          
          cursor = await rooms.find();
      } catch(e){
          console.log(`Unable to issue find command, ${e}`);
          return {error:e};
      }
      try{
          const value = await cursor.toArray();
          console.log(value)
          return value
      } catch(e){
          console.log(e)
          return {error:e};
      }
  }
    static async getInventory(roomId){
        try{
            let cursor = await rooms.findOne(
                {
                    roomId:roomId
                },
                {
                    num_units:1,
                    _id:0
                }
            )
            return cursor.toArray()
        }catch(e){
            return {error:e.message};
        }
    }
    static async getRoomId(){
        try{
            let cursor = await rooms.aggregate([
                {
                    $project:{
                        _id:0,
                        roomId:1
                        }
                    }
                ]
            );
            var val=await cursor.toArray()
            return val
        }catch(e){
            return {error:e.message};
        }
    }
    static async updateRooms(id){
        let cursor;
        try{
            return beds24.getRooms(id).then((room)=>{
                var {error} = room
                if(error){
                    throw new Error(error)
                }
                return room
            }).then(async (room) => {
                    var num=0;
                    let units=room.units
                    for(var i in units){
                        if(units[i].unitId!=undefined){
                            num++;
                        }
                    }
                    room.num_units=num
                    const updateResponse= await rooms.updateOne(
                        {roomId:room.roomId},
                        {$set:room},
                        {upsert: true}
                    )
                    return updateResponse;
            })
        }catch(e){
            console.error(`Unable to post property: ${e}`);
            return { error: e };
        }
    }
  static async deleteRooms(id){
        try{
            return rooms.deleteOne(
                {roomId:id}
            )
        }
        catch(e){
            return {error : e};
        }
    }

}
