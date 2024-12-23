const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/gift.controller");

router.get("/", controller.index);
router.get("/rewards", controller.reward);
router.get("/detail/:id", controller.detail);
router.get("/exchange/voucher/:id", controller.exchangeVoucher);
router.get("/exchange/gift/:id", controller.exchangeGift);
module.exports = router;