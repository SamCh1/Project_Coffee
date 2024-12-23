const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    users:{
        user_id:String,
        fullName:String
    },
    product:{
        product_id:String,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type:String,
        trim:true,
    },
    createdBy:{
        accountID: String,
        createdAt: Date,
    },
    deletedAt: Date,
    featured: String,
},{
    timestamps: true
});

const Comment = mongoose.model("comment", commentSchema, "comments");

module.exports = Comment;