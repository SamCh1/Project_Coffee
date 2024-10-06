const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
// [GET] /chat/
module.exports.index = async (req, res) => {
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
    });

    //Lấy hết data từ database
    const chats = await Chat.find({
        deleted: false
    });

    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser;
    }

    //
    
    res.render("client_v2/pages/chat/index", {
        pageTitle:"chat",
        chats: chats
    });
};