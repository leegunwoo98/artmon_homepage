import RoomsDAO from "../../dao/roomsDAO.js"
export default class RoomsController {
    static async apiGetRooms(req, res, next){
        const value = await RoomsDAO.getRooms();
        console.log(value)
        res.json(value)
    }
    static async apiUpdateRooms(req, res, next){
        try{
            const id = req.body.roomId
            const key = req.body.apiKey
            if(key!==process.env.BACKEND_KEY){
                throw new Error(`key does not match`)
            }
            const response = await RoomsDAO.updateRooms(
                id
            );
            var { error } = response;
            if (error) {
                throw new Error(error)
            }
            if (response.modifiedCount === 0&&response.upsertedCount===0) {
            throw new Error(
                "unable to sync room - room already synced"
            );
            }
            res.json({response});
        } catch(e){
            res.status(500).json({ error: e.message });
        }
    }
    static async apiDeleteRooms(req,res,next){
        try{
            const id = req.body.roomId;
            const key = req.body.apiKey;
            if (key !== process.env.BACKEND_KEY) {
                throw new Error(`key does not match`);
            }
            const response = await RoomsDAO.deleteRooms(id);
            var { error } = response;
            if (error) {
                throw new Error(error);
            }
            res.json({response});
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }
}