const mongoose = require("mongoose")

const exchangeGiftSchema = new mongoose.Schema(
    {
        gifts: [
            {
                gift_id: String,
                score: Number,
                title: String,
                thumbnail: String,
                description: String,
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

const ExchangeGift = mongoose.model("ExchangeGift", exchangeGiftSchema , "exchang-gifts")
module.exports = ExchangeGift;