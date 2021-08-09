export default class webhook {
  static async recieve_booking(req, res, next) {
      console.log("get")
      res.status(200).json({ result: "get" });
  }
  static async recieve_booking_post(req, res, next) {
      console.log("post");
      res.status(200).json({result:"post"})
  }
}