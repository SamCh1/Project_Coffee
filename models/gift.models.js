const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const giftSchema = new mongoose.Schema({
    title: String,
    gift_category_id: {
        type: String,
        default: ""
    },
    slug: { 
        type: String, 
        slug: "title",
        unique: true 
    },
    description: String,
    score: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    year: Number,
    origin: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        accountID: String,
        createdAt: Date,
    },
    deletedAt: Date,
    featured: String,
},{
    timestamps: true
});

const Gift = mongoose.model("gift", giftSchema, "gifts");

module.exports = Gift;