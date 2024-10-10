const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    _io.once("connection", (socket) => {
        //User send message to server
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            });

            await chat.save();

            //Trả data ra giao diện realtime
            _io.emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        //Typing
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        });
    });
}