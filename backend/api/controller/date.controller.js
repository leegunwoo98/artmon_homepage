import booksDAO from "../../dao/bookingDAO.js";
import dateDAO from "../../dao/dateDAO.js";
import beds24 from "../../beds24/beds24.sync.js";

export default class dateCtrl {
  static async apiGet(req, res, next) {
    try{
      const roomId = req.query.roomId;
      const from = req.query.from;
      const to = req.query.to;
      let info;
      info = await dateDAO.get(roomId, from, to);
      let {error} = info
      if(error) {
        throw new Error(error.message)
      }
      res.json(info);
    }catch(e){
      res.json(e)
    }
  }


  static async apiSync(req, res, next) {
    try {
      let roomId = await dateDAO.getRoomId();

      async function sync() {
        let myDate = new Array(366);
        let date_index = 0;
        for (date_index; date_index < myDate.length; date_index++) {
          myDate[date_index] = {
            updateOne: {
              filter: {},
              update: {
                $set: {
                  room: {},
                },
              },
              upsert: true,
            },
          };
        }
        let i = 0;
        let date;
        for (; i < roomId.length; i++) {
          date = await beds24.getPrice(roomId[i].roomId, i);
          let { error } = date;
          if (error) {
            throw new Error(error);
          }
          let index = 0;
          for (let key in date) {
            let year = key.substring(0, 4);
            let month = key.substring(4, 6);
            let day = key.substring(6, 8);
            let newDate = new Date(year+"-"+month+"-"+day);
            myDate[index].updateOne.filter.date = newDate;
            myDate[index].updateOne.update.$set.date = newDate;
            myDate[index]["updateOne"]["update"]["$set"]["room"][
              roomId[i].roomId
            ] = {
              inventory: date[key].i,
              price: parseInt(date[key].p1),
            };
            index++;
          }
        }
        return await myDate;
      }
      var response = dateDAO.syncDate(await sync());
      res.json(await response);
    } catch (e) {
      res.json(e);
    }
  }
}
