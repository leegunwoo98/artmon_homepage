import axios from 'axios';
import dotenv from 'dotenv'

export default class Beds24Sync {
    //get Availability from beds24 using id
  static async getAvail(id, from, to) {
    var avail = await axios({
      method: "post",
      url: "https://api.beds24.com/json/getAvailabilities",
      data: {
        checkIn: from,
        checkOut: to,
        roomId: id,
        propId: process.env.PROP_ID,
      },
    }).then((response) => {
      try {
        return response.data[id].roomsavail;
      } catch (e) {
        return response;
      }
    });
  }
  static async getRooms(id) {
    var response = await axios({
      method: "post",
      url: "https://api.beds24.com/json/getProperty",
      data: {
        authentication:{
          apiKey:process.env.API_KEY,
          propKey: process.env.PROP_KEY,
        },
      includeRooms: true,
      includeRoomUnits: true,
      },
    }).then((response) => {
      try {
        var rooms = response.data.getProperty[0].roomTypes;
        for(var key in rooms){
          if(rooms[key].roomId===id){
            return rooms[key]
          }
        }
      } catch (e) {
        return { error: "roomId cannot be found" };
      }
    });
    return response;
  }
  static async getBooking() {
    var response = await axios({
      method: "post",
      url: "https://api.beds24.com/json/getBookings",
      data: {
        authentication: {
          apiKey: process.env.API_KEY,
          propKey: process.env.PROP_KEY,
        },
      },
    })
    .then((response) => {
      try {
        return response.data;
      } catch (e) {
        return { error: "cannot getBooking" };
      }
    });
    return response;
  }
  static async getPrice(roomId,i){
    let d=new Date();
    var sYear = d.getFullYear()+1;
    var sMonth = d.getMonth() + 1;
    var sDate = d.getDate();
    let apiKey=i%2 ? process.env.API_KEY : process.env.API_KEY2

    sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
    sDate = sDate > 9 ? sDate : "0" + sDate;
    var to = sYear + sMonth + sDate;
    try{
      var response = await axios({
        method: "post",
        url: "https://api.beds24.com/json/getRoomDates",
        data: {
          authentication: {
            apiKey: apiKey,
            propKey: process.env.PROP_KEY,
          },
          roomId: roomId,
          to: to,
          incMaxStay: 0,
          incMultiplier: 0,
          incOverride: 0,
          allowInventoryNegative: 0,
          incChannelBookingLimit: 0,
        },
      });
      return response.data
    }
    catch(e){
      console.log(e)
      return {error:e}
    }
    
  }
}