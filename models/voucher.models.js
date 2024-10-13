const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const voucherSchema = new mongoose.Schema({
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
    code: String,
    description: String,
    discountPercentage: Number,
    score: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    type: String,
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
    // expireAt: { type: Date, default: Date.now, expires: false },
},{
    timestamps: true
});

const Voucher = mongoose.model("voucher", voucherSchema, "vouchers");

module.exports = Voucher;