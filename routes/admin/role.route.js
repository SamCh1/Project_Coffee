const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controllers");
const validate = require("../../validates/admin/roles.validate")

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",  validate.createPost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", validate.createPost, controller.editPatch);
router.get("/permission", controller.permission);
router.patch("/permissions", controller.permissionPatch);
router.delete("/delete/:id", controller.deleteRole)
module.exports = router;