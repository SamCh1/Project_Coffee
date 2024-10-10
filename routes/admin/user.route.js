const express = require("express");
const router = express.Router();
const multer = require('multer');

const upload = multer();
const controller = require("../../controllers/admin/user.controllers");

router.get("/", controller.index);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('avatar'), controller.editPatch)
router.delete("/delete/:id", controller.deleteUser)
router.patch("/change-status/:status/:id", controller.changeStatus)
module.exports = router;