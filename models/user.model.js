const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: String,
        phone: String,
        avatar: String,
        score: Number,
        friendsList: [
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;