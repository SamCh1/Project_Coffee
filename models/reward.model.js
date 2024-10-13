const mongoose = require("mongoose");
const rewardSchema = new mongoose.Schema(
    {
        user_id: String,
        products:[
            {
                product_id: String,
                quantity: Number,
            }
        ],
    },
    {
        timestamps: true,
    }
);
const Reward = mongoose.model("Reward", rewardSchema, "rewards");
module.exports = Reward;