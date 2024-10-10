const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatid;
  const userId = res.locals.user.id;

  console.log("Phòng chat: ",roomChatId);
  console.log("Id user: ",userId);

  try {
    const isAccessRoomChat = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": userId,
      deleted: false
    });
  
    if(isAccessRoomChat) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
}