const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

module.exports = (req,res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;
    _io.once("connection", (socket) => {
        socket.join(roomChatId);
        //User send message to server
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const chat = new Chat({
                user_id: userId,
                content: data,
                room_chat_id: roomChatId,
            });

            await chat.save();

            //Trả data ra giao diện realtime
            _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName, 
                content: data
            });
        });

        //Typing
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        });
    });
}