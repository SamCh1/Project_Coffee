const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/chat.controllers");
const chatMiddleware = require("../../middlewares/admin/chat1.middleware")

router.get("/:roomChatid",chatMiddleware.isAccess,controller.index)
module.exports = router;