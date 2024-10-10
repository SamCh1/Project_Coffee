const Account = require("../../models/account.model")
const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")

module.exports.ChatBot = async (req, res, next) => {
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
        }).select("-password");

        if(user){
            const expirationTime = 86400 * 1000; // Convert seconds to milliseconds
            const expiredAt = new Date(Date.now() + expirationTime);
            const title = "Tư Vấn";
            const userId = user.id;
            const adminIds = await Account.find().select("_id");
            const adminIdList = adminIds.map(admin => admin._id);
            
            const existingRoom = await RoomChat.findOne({
                users: { $elemMatch: { user_id: userId } },
            });
            if (!existingRoom) {
                const dataRoom = {
                    title: title,
                    typeRoom: "Manager",
                    users: [],
                    expiredAt:expiredAt,
                };
            
                dataRoom.users.push({
                    user_id:userId,
                    role: "user"
                });
            
                adminIdList.forEach(Id => {
                    dataRoom.users.push({
                        user_id:Id,
                        role: "admin"
                    });
                });
                const roomChat = new RoomChat(dataRoom);
                await roomChat.save();
                const roomChatInDB = await RoomChat.findOne({
                    users: { $elemMatch: { user_id: userId } },
                })  
                global.InfoRoom = roomChatInDB;
            } else {
                global.InfoRoom = existingRoom;
            }
        }
    }
    next();
}
