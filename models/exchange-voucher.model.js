const mongoose = require("mongoose")

const exchangeVoucherSchema = new mongoose.Schema(
    {
        code: String,
        vouchers: [
            {
                voucher_id: String,
                score: Number,
                discountPercentage: Number,
                thumbnail: String,
            },
        ],
        users: {
            user_id: String,
            email: String,
            score: Number
        },
        scoreTotal: Number,
        scoreCurrent: Number,
        scoreUsed: Number,
        status: String,
        createdAt: Date,
        expireAt: { type: Date, default: Date.now, expires: false },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

const ExchangeVoucher = mongoose.model("ExchangeVoucher", exchangeVoucherSchema , "exchang-vouchers")
module.exports = ExchangeVoucher;