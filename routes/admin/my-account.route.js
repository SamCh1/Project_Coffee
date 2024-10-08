const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer();
const validate = require("../../validates/admin/roles.validate")

const controller = require("../../controllers/admin/my-account.controllers");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index)
router.get("/edit", controller.edit)
router.patch("/edit",upload.single('avatar'), uploadCloud.uploadSingle,  controller.editPatch)
module.exports = router;