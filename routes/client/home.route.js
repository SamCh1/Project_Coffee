const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/home.controller");

router.get("/", controller.index);

module.exports = router;

//get: lấy ra
//post: thêm mới
//patch: chỉnh sửa
//delete: xóa
//use: dùng - phương thức chung