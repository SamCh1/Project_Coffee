const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        // user_id: String,
        card_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number,
            },
        ],
        users: {
            user_id: String,
            email: String
        },
        discountPercentage: Number,
        DecreasePrice: Number,
        totalPrice: Number
    },
    {
        timestamps: true,
    }
)

const Order = mongoose.model("Order", orderSchema , "orders")
module.exports = Order;