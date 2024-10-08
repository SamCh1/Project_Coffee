const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/auth.controllers")

router.get("/login", controller.login)
router.post("/login", controller.loginPost)
router.get("/logout", controller.logOut)

module.exports = router;