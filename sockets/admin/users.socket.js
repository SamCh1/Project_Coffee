const RoomChat = require("../../models/rooms-chat.model")
const Account = require("../../models/account.model")

module.exports = async (res) => {
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ACCEPT_FRIEND",async (userIdA) => {
            const Account = await Account.find();
            const roomChat = new RoomChat({
                typeRoom: "Hỏi đáp",
                users: [
                    ...Account.map(admin => ({
                        user_id: admin._id,
                        role: "Admin"
                    })),
                    {
                        user_id: userIdB,
                        role: "User"
                    }
                ],
            });
            await roomChat.save();

            await Account.updateMany({},{
                $push: {
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: roomChat.id
                    }
                }
            })

            await User.updateOne({
                _id: userIdB
            },{
                $push:{
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: roomChat.id
                    }
                }
            })
        })
    })
}