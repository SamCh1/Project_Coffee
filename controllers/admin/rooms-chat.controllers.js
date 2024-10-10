const Account = require("../../models/account.model")
const RoomChat = require("../../models/rooms-chat.model")
//[GET] /admin/rooms-chat
module.exports.index = async (req,res) => {
    const userId = res.locals.user.id;
    const listRoomChat = await RoomChat.find({
        "users.user_id": userId,
        typeRoom:"Manager",
        deleted:false
    });

    res.render("admin/pages/rooms-chat/index.pug", {
        pageTitle: "Danh sách phòng chat",
        listRoomChat: listRoomChat
    })
}

//[GET] /admin/rooms-chat/create
module.exports.create = async (req, res) => {
    const adminUser = res.locals.user
    const adminList = await Account.find({ _id: { $ne: adminUser.id } }).select("_id fullName");
    res.render("admin/pages/rooms-chat/create.pug",{
        pageTitle: "Tạo Phòng chat",
        adminList: adminList
    })
}

//[POST] /admin/rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const userId = req.body.userId;

    const dataRoom = {
        title: title,
        typeRoom: "Manager",
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

    res.redirect(`admin/chat/${roomChat.id}`);
}