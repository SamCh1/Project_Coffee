const Account = require("../../models/account.model")

//[POST] /admin/rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = "Tư vấn";
    const userId = req.body.userId;
    const dataRoom = {
        title: title,
        typeRoom: "Advise",
        users: []
    };

    dataRoom.users.push({
        user_id:res.locals.user.id,
        role: "admin"
    });

    userId.forEach(userId => {
        dataRoom.users.push({
            user_id:userId,
            role: "admin"
        });
    });
    const roomChat = new RoomChat(dataRoom);
    await roomChat.save();

    res.redirect(`admin/chat/${roomchat.id}`);
}