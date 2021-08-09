import mongodb from "mongodb"

const oneday = 86400000;

let books
export default class booking {
  static async injectDB(conn) {
    if (books) {
      return;
    }
    try {
      books = await conn.db(process.env.DB_NS).collection("bookings");
      console.log(`connected to database`);
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in roomsDAO: ${e}`
      );
    }
  }
  static async getDB_OBJ(){
    return books
  }
  
  static async updateBookings(bookings){
    try{
        var bulk=new Array(bookings.length);
        for(var index in bookings){
            var booking=bookings[index];
            booking.firstNight=new Date(booking.firstNight)
            var lastNight = new Date(booking.lastNight);
            booking.lastNight=new Date(lastNight.setDate(lastNight.getDate()+1))
            bulk[index]={
                updateOne:{
                    filter:{bookId:booking.bookId},
                    update: {$set:booking},
                    upsert:true
                }
            };
        }
        var response= await books.bulkWrite(bulk);
        return {success:`succesfully updated bookings database from beds24`}
    }
    catch(e){
        return {error:`cannot update booking database ${e}`}
    }
  }
  static async updateOneBookings(booking){

  }
  static async getBookings(id){
  }
  static async apiGetOneAvail(room,from,to, inventory){
    var date_from=new Date(from)
    var date_to=new Date(to)
    var days = (date_to.getTime() - date_from.getTime())/oneday;
    var index=0;
    var facet = {}
    while(index<days){
      var facet_date_from=new Date(date_from.valueOf())
      var facet_date_to = new Date(date_from.valueOf());
      facet_date_from.setDate(facet_date_from.getDate()+index);
      facet_date_to.setDate(facet_date_to.getDate()+index+1);
      facet[facet_date_from] = [
        {
          $match: {
            roomId: room,
            lastNight: {
              $gt: facet_date_from,
            },
            firstNight: {
              $lt: facet_date_to,
            },
            $or: [{ status: "1" }, { status: "2" }],
          },
        },
        {
          $count: "num",
        },
      ];
      index++
    }

    
    var pipeline = [
      {
        $match: {
          roomId: room,
          lastNight: {
            $gt: date_from,
          },
          firstNight: {
            $lt: date_to,
          },
          $or: [{ status: "1" }, { status: "2" }],
        },
      },
      {
        $facet:facet
      }
    ];
    try{
      let data = await books.aggregate(pipeline)
      let data_arr = await data.toArray()
      let data_json=data_arr[0]
      let min=inventory;
      for(var key in data_json) {
        let num_books_data = data_json[key][0]
        let num_books=(num_books_data==undefined) ? 0 : num_books_data.num
        let avail=inventory-num_books
        if(avail<min){
          min=avail
        }
      }
      return min
    }catch(e){
        return {error: e.message}
    }
  }
}