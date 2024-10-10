const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    thumbnail: String,
    description: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
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

const Blog = mongoose.model("blog", blogSchema, "blogs");

module.exports = Blog;